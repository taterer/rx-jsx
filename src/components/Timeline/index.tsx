import { css } from "@emotion/css"
import { Subject } from "rxjs"
import { tap, takeUntil, withLatestFrom, map } from "rxjs/operators"
import { AddTimelineEvent, Icon } from "../../domain/timeline/command"
import { timelineEvents$ } from "../../domain/timeline/query"
import { toElement$, _withAnimationFrame_ } from "../../jsx"
import Explosion from "./Explosion"

const animationTransform = [
  { transform: 'translateX(0px)' },
  { transform: 'translateX(740px)' }
]

const animationTiming = {
  duration: 5000,
  iterations: 1
}

export default function Timeline ({ destruction$, debug = false, scroll = true }) {
  const [timeline$] = toElement$(destruction$)

  timelineEvents$
  .pipe(
    withLatestFrom(timeline$),
    takeUntil(destruction$),
  )
  .subscribe(([timelineEvent, timeline]) => {
    const timelineElement = <i style={`position: ${scroll ? 'absolute' : ''}; color: ${timelineEvent.color}`} class="material-icons dp48">{timelineEvent.icon}</i>
    timeline.appendChild(timelineElement)
    if (scroll) {
      setTimeout(() => {
        timelineElement.remove()
      }, animationTiming.duration -1)
  
      timelineElement.animate(animationTransform, animationTiming)
    }

    if (timelineEvent.icon === 'star') {
      timelineElement.appendChild(<Explosion destruction$={destruction$} icon='star' color='gold' particles={10} />)
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
    `} />
}
