import { css } from '@emotion/css'
import { combineLatest, takeUntil } from 'rxjs'
import { toElement$, fromValueElementKeyup$ } from '../../jsx'
import { panel } from '../../styles'

const lineItemClass = css`max-width: 400px;`

function toDollar (str: number) {
  return `$${Math.round(str * 100) / 100}`
    .replace(/(^[^.]*$)/, '$1.00')
    .replace(/\.(.{0,2}).*/, '.$100')
    .replace(/(\...).*/, '$1')
}

export default function Mortgage ({ destruction$ }) {
  const [principal$] = toElement$(destruction$)
  const [interest$] = toElement$(destruction$)
  const [term$] = toElement$(destruction$)
  const [results$, setResult] = toElement$(destruction$)

  combineLatest([
    fromValueElementKeyup$(principal$),
    fromValueElementKeyup$(interest$),
    fromValueElementKeyup$(term$),
  ])
  .pipe(
    takeUntil(destruction$)
  )
  .subscribe({
    next: ([principal, interest, term]) => {
      try {
        const p = parseFloat(principal as string)
        const i = parseFloat(interest as string)/100
        const t = parseFloat(term as string)
        const result = p*i/12/(1-Math.pow(1+i/12,-t*12))
        setResult(<div>{isNaN(result) ? 'TBD' : toDollar(result)}</div>)
      } catch (err) {
        setResult(<div>Err</div>)
      }
    }
  })

  return (
    <div class={panel}>
      <p>Mortgage Calculator</p>
      <div>
        <div class={lineItemClass}>
          <label for='principal'>Principal</label>
          <input id='principal' element$={principal$} placeholder='0' />
        </div>
        <div class={lineItemClass}>
          <label for='interest'>Interest</label>
          <input id='interest' element$={interest$} placeholder='0' />
        </div>
        <div class={lineItemClass}>
          <label for='term'>Term (years)</label>
          <input id='term' element$={term$} placeholder='0' />
        </div>
        <div class={css`
          display: flex;
          flex-direction: row;
          justify-content: center;
          margin: 20px;
        `}>
          <div>Monthly Payment:&nbsp;</div>
          <div element$={results$}>
            TBD
          </div>
        </div>
      </div>
    </div>
  )
}
