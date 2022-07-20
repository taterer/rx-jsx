import { css } from "@emotion/css"
import { Observable } from "rxjs"
import { takeUntil, withLatestFrom, concatMap, filter, map } from "rxjs/operators"
import { Icon } from "../../domain/timeline/command"
import { toElement$, _withAnimationFrame_ } from "../../jsx"
import { parseTag, spy$ } from "../../utils/tag"
import Explosion from "./Explosion"

const animationTransform = [
  { transform: 'translateX(120px)' },
  { transform: 'translateX(740px)' }
]

const animationTiming = {
  duration: 5000,
  iterations: 1
}

export default function Timeline ({
  destruction$,
  rawTag,
  debug = false,
  scroll = true
}: {
  destruction$: Observable<any>,
  rawTag: string,
  debug?: boolean,
  scroll?: boolean,
}) {
  const [timeline$] = toElement$(destruction$)
  const tag = parseTag(rawTag)

  spy$
  .pipe(
    filter(i => i.tag === rawTag),
    map(() => tag),
    concatMap(async i => i),
    withLatestFrom(timeline$),
    takeUntil(destruction$),
  )
  .subscribe(([tag, timeline]) => {
    const timelineElement = <i style={`position: ${scroll ? 'absolute' : ''}; color: ${tag.color || 'black'}`} class="material-icons dp48">{tag.icon || Icon.message}</i>
    timeline.appendChild(timelineElement)
    if (scroll) {
      setTimeout(() => {
        timelineElement.remove()
      }, animationTiming.duration -1)
  
      timelineElement.animate(animationTransform, animationTiming)
    }

    if (tag.icon === 'star') {
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
    `}>
      {tag.name}
    </div>
}
