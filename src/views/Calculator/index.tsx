import { css } from '@emotion/css'
import { combineLatest, takeUntil } from 'rxjs'
import Textfield from '../../components/Textfield'
import { toElement$, fromValueElementKeyup$ } from '../../jsx'

function toDollar (str: number) {
  return `$${Math.round(str * 100) / 100}`
    .replace(/(^[^.]*$)/, '$1.00')
    .replace(/\.(.{0,2}).*/, '.$100')
    .replace(/(\...).*/, '$1')
}

export default function Routes ({ destruction$ }) {
  const [principal$] = toElement$(destruction$)
  const [interest$] = toElement$(destruction$)
  const [term$] = toElement$(destruction$)
  const [results$, setResult] = toElement$(destruction$)

  combineLatest([
    fromValueElementKeyup$(principal$),
    fromValueElementKeyup$(interest$),
    fromValueElementKeyup$(term$),
  ]).pipe(
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
    <div>
      <p>Mortgage Calculator</p>
      <div class={css`
          display: flex;
          flex-direction: column;
          max-width: 400px;
        `}>
        <Textfield input$={principal$} title="Principal" />
        <Textfield input$={interest$} title="Interest" />
        <Textfield input$={term$} title="Term (in years)" />
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
