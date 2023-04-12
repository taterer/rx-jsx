import { css } from '@emotion/css';
import { from, of, Subject } from 'rxjs';
import {
  combineLatestWith,
  concatMap,
  delay,
  filter,
  map,
  mergeWith,
  scan,
  share,
  shareReplay,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import { Icon, tag } from "@taterer/rxjs-debugger";
import { viewport$ } from '../../domain/viewport/query';
import { mapToPersistable_, withIndexedDB_, concatMapPersist_, Tables, indexedDB$, Persistence } from '../../domain/persistence/repository';
import { fromEventElement$, withAnimationFrame } from '@taterer/rx-jsx';
import { panel } from '../../styles';
import { socketDraw$, subscribeAndPushToChannel } from '../../domain/sync/sockets';
import { draw } from '../../domain/2d/canvas';

export default function Draw ({ destruction$ }) {
  const canvas$ = of<Element>(
    <canvas
      class={css`
        background-color: #eee;
      `}
      width={750}
      height={750} />
  )

  const clear$ = of<Element>(
    <a class='btn blue waves-effect waves-light right'>Clear</a>
  )

  const canvasContext$ = canvas$
  .pipe(
    map((canvas: any) => canvas.getContext('2d')),
    shareReplay(1)
  )
  
  const offset$ = viewport$
  .pipe(
    withAnimationFrame,
    combineLatestWith(canvas$),
    map(([_, canvas]) => {
      const boundingClientRect = canvas.getBoundingClientRect()
      return { x: boundingClientRect.left + window.pageXOffset, y: boundingClientRect.top + window.pageYOffset }
    }),
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
    share(),
  )

  stroke$
  .pipe(
    filter(stroke => !!stroke.stroke),
    combineLatestWith(canvasContext$),
    tag({ name: 'Draw', color: 'black', icon: Icon.face }),
    takeUntil(destruction$),
  )
  .subscribe(([stroke, canvasContext]: any) => {
    draw(canvasContext, stroke)
  })

  // Begin sync

  subscribeAndPushToChannel(destruction$, 'draw', stroke$
  .pipe(
    filter(stroke => !!stroke.stroke),
  ))

  socketDraw$
  .pipe(
    combineLatestWith(canvasContext$),
    takeUntil(destruction$),
  ).subscribe(([stroke, canvasContext]: any) => {
    draw(canvasContext, stroke, '#ff0000')
  })

  // End sync

  // Begin persistence

  stroke$
  .pipe(
    filter(stroke => !!stroke.stroke || stroke.close || stroke.begin),
    mapToPersistable_(),
    withIndexedDB_(),
    concatMapPersist_(Tables.strokes),
    takeUntil(destruction$),
  )
  .subscribe()

  // redraw
  indexedDB$
  .pipe(
    concatMap((db: Persistence) => db.query(Tables.strokes)),
    map((strokes: any[]) => strokes.sort((a, b) => {
      if (a.created_at === b.created_at && (a.begin || b.close)) {
        return -1
      }
      return a.created_at - b.created_at
    })),
    switchMap(strokes => from(strokes)),
    combineLatestWith(canvasContext$),
    delay(0),
    takeUntil(destruction$),
  )
  .subscribe(([stroke, canvasContext]) => {
    draw(canvasContext, stroke)
  })

  const clearing$ = new Subject()

  const pending$ = clearing$
  .pipe(
    map(clearing => {
      if (clearing) {
        return (
          <h1 class={css`
            position: absolute;
            margin: 220px;
          `}>
            Clearing ...
          </h1>
        )
      }
    }),
    takeUntil(destruction$)
  )

  fromEventElement$(clear$, 'click')
  .pipe(
    combineLatestWith(canvas$, canvasContext$, indexedDB$),
    tag({ name: 'Clear', color: 'red' }),
    takeUntil(destruction$),
  )
  .subscribe(async ([_, canvas, canvasContext, db]: any) => {
    clearing$.next(true)
    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    const strokes = await db.query(Tables.strokes)
    await Promise.all(strokes.map((stroke: any) => db.remove(Tables.strokes, stroke.id)))
    clearing$.next(false)
  })

  // End persistence

  return <div class={panel}>
    <div single$={pending$} />
    <div single$={canvas$} />
    <div single$={clear$} />
  </div>
}
