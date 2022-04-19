import { css, cx } from '@emotion/css'
import { distinctUntilChanged, share, EMPTY } from 'rxjs'
import { toElement$ } from '../jsx'
import { pathname$, _firstPath_ } from '../streams/location'
import Calculator from './Calculator'
import Home from './Home'
import NotFound from './NotFound'

export default function Routes() {
  const [route$, setRoute] = toElement$(EMPTY)

  const newPath$ = pathname$.pipe(
    _firstPath_,
    distinctUntilChanged(),
    share()
  )

  newPath$.subscribe({
    next: firstPath => {
      if (firstPath === '') {
        setRoute(<Home destruction$={newPath$} />)
      } else if (/calc/.test(firstPath)) {
        setRoute(<Calculator destruction$={newPath$} />)
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
