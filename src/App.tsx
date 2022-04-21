import { EMPTY } from 'rxjs'
import { css } from '@emotion/css'
import Navbar from './components/Navbar'
import Calculator from './views/Calculator'
import Draw from './views/Draw'
import Home from './views/Home'
import NotFound from './views/NotFound'
import { toElement$ } from './jsx'
import { firstPathChange$ } from './streams/location'
import { RouteRegExp } from './utils/routes'

export default function App () {
  const [route$, setRoute] = toElement$(EMPTY)
  
  firstPathChange$.subscribe({
    next: firstPath => {
      if (RouteRegExp.home.test(firstPath)) {
        setRoute(<Home />)
      } else if (RouteRegExp.calc.test(firstPath)) {
        setRoute(<Calculator destruction$={firstPathChange$} />)
      } else if (RouteRegExp.draw.test(firstPath)) {
        setRoute(<Draw destruction$={firstPathChange$} />)
      } else {
        setRoute(<NotFound />)
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
      <Navbar />
      <div class={css`
        width: 100%;
        max-width: 800px;
      `}>
        <div element$={route$} />
      </div>
    </div>
  )
}
