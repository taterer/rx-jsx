import { css } from "@emotion/css";
import { animationFrameScheduler } from "rxjs";
import { combineLatestWith, concatMap, distinctUntilKeyChanged, map, mergeWith, takeUntil, tap } from "rxjs/operators";
import { fromEventElement$, toElement$ } from "../../jsx";
import { viewport$ } from "../../streams/viewport";

export default function ({ destruction$ }) {
  const [canvas$] = toElement$(destruction$)
  const canvasContext$ = canvas$.pipe(
    map((canvas: any) => canvas.getContext('2d'))
  )
  
  const offset$ = viewport$.pipe(
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

  const stroke$ = fromEventElement$(canvas$, 'mousedown').pipe(
    mergeWith(fromEventElement$(canvas$, 'mouseup'), fromEventElement$(canvas$, 'mouseleave')),
    map(event => {
      if (event.type === 'mousedown') return true
      if (event.type === 'mouseup') return false
      if (event.type === 'mouseleave') return false
    })
  )

  stroke$.pipe(
    combineLatestWith(canvasContext$, fromEventElement$(canvas$, 'mousemove'), offset$),
    distinctUntilKeyChanged(0),
    takeUntil(destruction$),
  ).subscribe({
    next: ([stroke, canvasContext, mouseMove, offset]: any) => {
      if (stroke) {
        canvasContext.beginPath()
        canvasContext.moveTo(mouseMove.pageX - offset.x, mouseMove.pageY - offset.y)
        canvasContext.strokeStyle = '#000000'
        canvasContext.lineWidth = 2
        canvasContext.lineCap = 'round'
      } else {
        canvasContext.closePath()
      }
    }
  })

  fromEventElement$(canvas$, 'mousemove').pipe(
    combineLatestWith(stroke$, canvasContext$, offset$),
  ).subscribe({
    next: ([mousemove, stroke, canvasContext, offset]: any) => {
      if (stroke) {
        canvasContext.lineTo(mousemove.pageX - offset.x, mousemove.pageY - offset.y)
        canvasContext.stroke()
      }
    }
  })

  return <canvas element$={canvas$}
    class={css`
      background-color: #eee;
    `}
    width={750}
    height={750} />
}
