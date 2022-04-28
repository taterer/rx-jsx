import { takeUntil } from "rxjs"
import Babylon1 from "../../components/Babylon1"
import { toElement$, _withAnimationFrame_ } from "../../jsx"
import { secondPathChange$ } from "../../observables/location"

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
    <div>
      <div onClick={() => history.pushState({}, '', '/babylon/1')}>Test 1</div>
      <div onClick={() => history.pushState({}, '', '/babylon/2')}>Test 2</div>
      <div element$={canvas$} />
    </div>
  )
}
