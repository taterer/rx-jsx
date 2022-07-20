import { css } from "@emotion/css"
import { takeUntil, withLatestFrom, map, concatMap } from "rxjs/operators"
import { spy$ } from "../../App"
import { Icon } from "../../domain/timeline/command"
import { toElement$, _withAnimationFrame_ } from "../../jsx"
import Explosion from "./Explosion"

const animationTransform = [
  { transform: 'translateX(120px)' },
  { transform: 'translateX(740px)' }
]

const animationTiming = {
  duration: 5000,
  iterations: 1
}

export default function Timeline ({ destruction$, title, color, debug = false, scroll = true }) {
  const [timeline$] = toElement$(destruction$)

  spy$
  .pipe(
    concatMap(async i => i),
    withLatestFrom(timeline$),
    takeUntil(destruction$),
  )
  .subscribe(([event, timeline]) => {
    console.log('Something')
    const timelineElement = <i style={`position: ${scroll ? 'absolute' : ''}; color: ${color}`} class="material-icons dp48">{Icon.message}</i>
    timeline.appendChild(timelineElement)
    if (scroll) {
      setTimeout(() => {
        timelineElement.remove()
      }, animationTiming.duration -1)
  
      timelineElement.animate(animationTransform, animationTiming)
    }

    if (debug) {
      console.log('Timeline element', timelineElement)
    }
  })

  return <div element$={timeline$}
    class={css`
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-end;
      position: relative;
      width: 100%;
      height: 40px;
      margin-top: 20px;
      margin-bottom: 20px;
    `}>
      {title}
    </div>
}
