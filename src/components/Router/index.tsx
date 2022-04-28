import { toElement$ } from '../../jsx'
import { firstPathChange$ } from '../../observables/location'
import { RouteRegExp } from '../../utils/route'
import Home from '../../views/Home'
import Calculator from '../../views/Calculator'
import Draw from '../../views/Draw'
import NotFound from '../../views/NotFound'
import Babylon from '../../views/Babylon'

export default function Router ({ destruction$ }) {
  const [route$, setRoute] = toElement$(destruction$)
  
  firstPathChange$
  .subscribe(firstPath => {
    if (RouteRegExp.home.test(firstPath)) {
      setRoute(<Home />)
    } else if (RouteRegExp.calc.test(firstPath)) {
      setRoute(<Calculator destruction$={firstPathChange$} />)
    } else if (RouteRegExp.draw.test(firstPath)) {
      setRoute(<Draw destruction$={firstPathChange$} />)
    } else if (RouteRegExp.babylon.test(firstPath)) {
      setRoute(<Babylon destruction$={firstPathChange$} />)
    } else {
      setRoute(<NotFound />)
    }
  })

  return (
    <div element$={route$} />
  )
}
