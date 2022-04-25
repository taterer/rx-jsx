import { css } from '@emotion/css';
import { animationFrameScheduler, from } from 'rxjs';
import { combineLatestWith, concatMap, delay, filter, map, mergeWith, scan, share, switchMap, takeUntil } from 'rxjs/operators';
import { fromEventElement$, toElement$ } from '../../jsx';
import { Persistence, Tables } from '../../utils/repository';
import { _mapToPersistable_, _withIndexedDB_, _concatMapPersist_, indexedDB$ } from '../../utils/repository';
import { viewport$ } from '../../observables/viewport';

function draw (canvasContext, stroke) {
  if (stroke.begin) {
    canvasContext.beginPath()
    canvasContext.moveTo(stroke.x, stroke.y)
    canvasContext.strokeStyle = '#000000'
    canvasContext.lineWidth = 2
    canvasContext.lineCap = 'round'
  }
  if (stroke.stroke) {
    canvasContext.lineTo(stroke.x, stroke.y)
    canvasContext.stroke()
  }
  if (stroke.close) {
    canvasContext.closePath()
  }
}

export default function Draw ({ destruction$ }) {
  const [canvas$] = toElement$(destruction$)
  const [clear$] = toElement$(destruction$)
  const [pending$, setPending] = toElement$(destruction$)

  const canvasContext$ = canvas$
  .pipe(
    map((canvas: any) => canvas.getContext('2d'))
  )
  
  const offset$ = viewport$
  .pipe(
    combineLatestWith(canvas$),
    concatMap(async ([_, canvas]) => {
      return await new Promise(resolve => {
        animationFrameScheduler.schedule(() => {
          const boundingClientRect = canvas.getBoundingClientRect()
          resolve({ x: boundingClientRect.left + window.pageXOffset, y: boundingClientRect.top + window.pageYOffset })
        })
      })
    })
  )

  const isStroke$ = fromEventElement$(canvas$, 'mousedown')
  .pipe(
    mergeWith(fromEventElement$(canvas$, 'mouseup'), fromEventElement$(canvas$, 'mouseleave')),
    map(event => {
      if (event.type === 'mousedown') return true
      if (event.type === 'mouseup') return false
      if (event.type === 'mouseleave') return false
    })
  )

  const stroke$ = fromEventElement$(canvas$, 'mousemove')
  .pipe(
    combineLatestWith(isStroke$, offset$),
    map(([mousemove, stroke, offset]: any) => ({ x: mousemove.pageX - offset.x, y: mousemove.pageY - offset.y, stroke })),
    scan((acc, current) => {
      let begin = !acc.stroke && current.stroke
      let close = acc.stroke && !current.stroke
      return { ...current, begin, close }
    }, { x: 0, y: 0, stroke: false, begin: false, close: false }),
    share()
  )

  stroke$
  .pipe(
    filter(stroke => !!stroke.stroke),
    combineLatestWith(canvasContext$),
    takeUntil(destruction$),
    ).subscribe({
    next: ([stroke, canvasContext]: any) => {
      draw(canvasContext, stroke)
    }
  })

  // Begin persistence

  stroke$
  .pipe(
    filter(stroke => !!stroke.stroke || stroke.close || stroke.begin),
    _mapToPersistable_,
    _withIndexedDB_,
    _concatMapPersist_(Tables.strokes),
    takeUntil(destruction$),
  ).subscribe()

  indexedDB$
  .pipe(
    concatMap((db: Persistence) => db.query(Tables.strokes)),
    map((strokes: any[]) => strokes.sort((a, b) => {
      if (a.created_at === b.created_at && (a.begin || b.close)) {
        return -1
      }
      return a.created_at - b.created_at
    })),
    takeUntil(destruction$),
    switchMap(strokes => from(strokes)),
    combineLatestWith(canvasContext$),
    delay(0)
  )
  .subscribe({
    next: ([stroke, canvasContext]) => {
      draw(canvasContext, stroke)
    }
  })

  fromEventElement$(clear$, 'click')
  .pipe(
    takeUntil(destruction$),
    combineLatestWith(canvas$, canvasContext$, indexedDB$)
  )
  .subscribe({
    next: async ([_, canvas, canvasContext, db]: any) => {
      setPending(<h1 class={css`
        position: absolute;
        margin: 220px;
      `}>
        Clearing ...
      </h1>)
      canvasContext.clearRect(0, 0, canvas.width, canvas.height)
      const strokes = await db.query(Tables.strokes)
      await Promise.all(strokes.map((stroke: any) => db.remove(Tables.strokes, stroke.id)))
      setPending(<div />)
    }
  })

  // End persistence

  return <div>
    <div element$={pending$} />
    <canvas element$={canvas$}
      class={css`
        background-color: #eee;
      `}
      width={750}
      height={750} />
    <a class='btn blue waves-effect waves-light right' element$={clear$}>Clear</a>
  </div>
}
