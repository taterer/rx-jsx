import { css } from '@emotion/css'
import { of, map, startWith, takeUntil, combineLatest } from 'rxjs'
import { Icon, tag } from "@taterer/rxjs-debugger";
import { fromValueElementKeyup$ } from '@taterer/rx-jsx'
import { panel } from '../../styles'

const lineItemClass = css`max-width: 400px;`

function toDollar (str: number) {
  return `$${Math.round(str * 100) / 100}`
    .replace(/(^[^.]*$)/, '$1.00')
    .replace(/\.(.{0,2}).*/, '.$100')
    .replace(/(\...).*/, '$1')
}

export default function Mortgage ({ destruction$ }) {
  const principal$ = of<Element>(<input id='principal' placeholder='0' />)
  const interest$ = of<Element>(<input id='interest' placeholder='0' />)
  const term$ = of<Element>(<input id='term' placeholder='0' />)

  const result$ = combineLatest(
    fromValueElementKeyup$(principal$),
    fromValueElementKeyup$(interest$),
    fromValueElementKeyup$(term$),
  )
  .pipe(
    tag({ name: 'Mortgage Calculator', color: 'purple', icon: Icon.image }),
    map(([principal, interest, term]) => {
      if (!principal || !interest || !term) {
        return <div>TBD</div>
      }
      try {
        const p = parseFloat(principal as string)
        const i = parseFloat(interest as string)/100
        const t = parseFloat(term as string)
        const result = p*i/12/(1-Math.pow(1+i/12,-t*12))
        return <div>{isNaN(result) ? 'Err' : toDollar(result)}</div>
      } catch (err) {}
      return <div>Err</div>
    }),
    takeUntil(destruction$)
  )

  return (
    <div class={panel}>
      <p>Mortgage Calculator</p>
      <div>
        <div class={lineItemClass}>
          <label for='principal'>Principal</label>
          <div single$={principal$} />
        </div>
        <div class={lineItemClass}>
          <label for='interest'>Interest</label>
          <div single$={interest$} />
        </div>
        <div class={lineItemClass}>
          <label for='term'>Term (years)</label>
          <div single$={term$} />
        </div>
        <div class={css`
          display: flex;
          flex-direction: row;
          justify-content: center;
          margin: 20px;
        `}>
          <div>Monthly Payment:&nbsp;</div>
          <div single$={result$.pipe(startWith(<div>TBD</div>))} />
        </div>
      </div>
    </div>
  )
}
