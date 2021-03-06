import { takeUntil } from 'rxjs'
import { toElement$ } from '../../jsx'
import Home from '../../views/Home'
import Draw from '../../views/Draw'
import NotFound from '../../views/NotFound'
import Babylon from '../../views/Babylon'
import Mortgage from '../../views/Mortgage'
import { firstPathChange$ } from '../../domain/route/query'
import { RouteRegExp, subscribeHistoryPushReplace } from '../../domain/route'

export default function Router ({ destruction$ }) {
  const [route$, setRoute] = toElement$(destruction$)
  
  subscribeHistoryPushReplace(destruction$)

  firstPathChange$
  .pipe(
    takeUntil(destruction$)
  )
  .subscribe(firstPath => {
    if (RouteRegExp.home.test(firstPath)) {
      setRoute(<Home />)
    } else if (RouteRegExp.mortgage.test(firstPath)) {
      setRoute(<Mortgage destruction$={firstPathChange$} />)
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
