import { css, cx } from "@emotion/css";
import { BehaviorSubject, EMPTY, Observable, pipe } from 'rxjs'
import { filter, map, share, take, tap, withLatestFrom } from 'rxjs/operators'
import { tag as ogTag } from "rxjs-spy/cjs/operators";
import { create } from "rxjs-spy";
import { panel } from "../styles";
import Debugger from "../components/Debugger";
import Explosion from "../components/Debugger/Explosion";

export interface Tag {
  name: string
  skipTap?: boolean
  icon?: string
  color?: string
}

export function tag<T> (tag: Tag) {
  const tagged = ogTag<T>(JSON.stringify({ ...tag, id: Math.random() }))
  if (tag.skipTap) {
    return tagged
  }
  return pipe(
    tagged,
    tap(i => console.log(`%cTag%c "${tag.name}": ${i}`, `background: ${tag.color}`, `background: white`))
  )
}

export function parseTag (tag: string): Tag {
  return JSON.parse(tag)
}

const spy = create();
export const spy$ = new Observable<string>(function (subscriber) {
    spy.log({ log: i => subscriber.next(i) })
  })
  .pipe(
    map(i => {
      const [line1, line2] = i.split('; ')
      const [_tag, tag] = line1.split(' = ')
      const [_notitication, notitication] = line2.split(' = ')
      return { tag, notitication }
    }),
    share()
  )

const view$ = new BehaviorSubject(<View />)

function View () {
  return (
    <div id='mydivheader' class={cx(
      panel,
      css`
        position: fixed;
        bottom: 25px;
        left: 25px;
        padding: 0px;
        overflow: auto;
        height: fit-content;
        max-height: 800px;
        margin: 0px;
        z-index: 2;
      `
    )}>
      <div class={css`
        font-size: 1.2em;
        font-weight: 700;
        background-color: #ff00aa;
        padding: 20px;
        margin-bottom: 15px;
      `}>
        RxJS Debugger
      </div>
    </div>
  )
}

view$
.pipe(
  take(1)
)
.subscribe(view => {
  const parent = <div id='mydiv' />
  parent.appendChild(view)
  document.body.appendChild(parent)
  dragElement(view)
})

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  const headerElement = document.getElementById(elmnt.id + "header")
  if (headerElement) {
    // if present, the header is where you move the DIV from:
    headerElement.onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

spy$
.pipe(
  filter(i => i.notitication === 'subscribe'),
  withLatestFrom(view$),
)
.subscribe(([spy, view]) => {
  const timeline = <div class={css`
    padding: 10px 20px;
  `}>
    <Debugger destruction$={EMPTY} rawTag={spy.tag} />
  </div>
  view.appendChild(timeline)
  spy$
  .pipe(
    filter(i => i.tag === spy.tag && i.notitication === 'unsubscribe'),
    take(1),
  )
  .subscribe(() => {
    timeline.appendChild(<div class={css`
      margin: -1.2em;
      position: absolute;
    `}>
      <Explosion destruction$={EMPTY} icon='flare' color='red' particles={15} />
    </div>)
    setTimeout(() => {
      timeline.remove()
    }, 5000)
  })
})
