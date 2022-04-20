import { css } from '@emotion/css'
import { EMPTY, withLatestFrom } from 'rxjs'
import Routes from './views/Routes'
import { firstPathChange$ } from './streams/location'
import { toElement$ } from './jsx'

export default function App () {
  const [home$] = toElement$(EMPTY)
  const [calc$] = toElement$(EMPTY)
  const [draw$] = toElement$(EMPTY)
  const [else$] = toElement$(EMPTY)

  firstPathChange$.pipe(
    withLatestFrom(home$, calc$, draw$, else$)
  ).subscribe({
    next: ([firstPath, home, calc, draw, elsewhere]) => {
      if (firstPath === '') {
        home.classList.add('active')
        calc.classList.remove('active')
        draw.classList.remove('active')
        elsewhere.classList.remove('active')
      } else if (/calc/.test(firstPath)) {
        home.classList.remove('active')
        calc.classList.add('active')
        draw.classList.remove('active')
        elsewhere.classList.remove('active')
      } else if (/draw/.test(firstPath)) {
        home.classList.remove('active')
        calc.classList.remove('active')
        draw.classList.add('active')
        elsewhere.classList.remove('active')
      } else {
        home.classList.remove('active')
        calc.classList.remove('active')
        draw.classList.remove('active')
        elsewhere.classList.add('active')
      }
    }
  })

  return (
    <div class={css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `}>
      <nav class='blue lighten-2'>
          <ul id='nav-mobile'>
            <li element$={home$}><a class='waves-effect waves-light' onClick={() => history.pushState({}, '', '/')}>Home</a></li>
            <li element$={calc$}><a class='waves-effect waves-light' onClick={() => history.pushState({}, '', '/calc')}>Calculator</a></li>
            <li element$={draw$}><a class='waves-effect waves-light' onClick={() => history.pushState({}, '', '/draw')}>Draw</a></li>
            <li element$={else$}><a class='waves-effect waves-light' onClick={() => history.pushState({}, '', '/asdf')}>Elsewhere</a></li>
          </ul>
      </nav>
      <Routes />
    </div>
  )
}
