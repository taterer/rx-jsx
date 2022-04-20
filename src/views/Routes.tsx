import { css, cx } from '@emotion/css'
import { EMPTY } from 'rxjs'
import { toElement$ } from '../jsx'
import { firstPathChange$ } from '../streams/location'
import Calculator from './Calculator'
import Home from './Home'
import NotFound from './NotFound'

export default function Routes() {
  const [route$, setRoute] = toElement$(EMPTY)

  firstPathChange$.subscribe({
    next: firstPath => {
      if (firstPath === '') {
        setRoute(<Home destruction$={firstPathChange$} />)
      } else if (/calc/.test(firstPath)) {
        setRoute(<Calculator destruction$={firstPathChange$} />)
      } else {
        setRoute(<NotFound />)
      }
    }
  })

  return <div class={cx('card-panel', css`
    width: 100%;
    max-width: 800px;
  `)}>
    <div element$={route$} />
  </div>
}
