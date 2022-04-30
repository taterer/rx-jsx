import { css } from "@emotion/css"
import { takeUntil } from "rxjs"
import Babylon1 from "../../components/Babylon1"
import { toElement$, _withAnimationFrame_ } from "../../jsx"
import { secondPathChange$ } from "../../observables/location"

const BASE_URL = process.env.BASE_URL || ''

export default function Babylon ({ destruction$ }) {
  const [canvas$, setCanvas] = toElement$(destruction$)

  secondPathChange$
  .pipe(
    _withAnimationFrame_,
    takeUntil(destruction$)
  )
  .subscribe(path => {
    if (/1/.test(path)) {
      setCanvas(<Babylon1 destruction$={secondPathChange$} />)
    } else if (/1/.test(path)) {
      setCanvas(<div>Something {path}</div>)
    } else {
      setCanvas(<div>Missing something for path: {path}</div>)
    }
  })

  return (
    <div class={css`
      align-items: center;
      display: flex;
      flex-direction: column;
    `}>
      <div class={css`
        width: 100%;
        justify-content: space-around;
        display: flex;
      `}>
        <div class={css`cursor: pointer;`} onClick={() => history.pushState({}, '', `${BASE_URL}/babylon/1`)}>Test 1</div>
        <div class={css`cursor: pointer;`} onClick={() => history.pushState({}, '', `${BASE_URL}/babylon/2`)}>Test 2</div>
      </div>
      <div element$={canvas$} />
    </div>
  )
}
