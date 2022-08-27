import { map, takeUntil } from 'rxjs'
import Draw from '../../views/Draw'
import NotFound from '../../views/NotFound'
import Babylon from '../../views/Babylon'
import Mortgage from '../../views/Mortgage'
import { firstPathChange$ } from '../../domain/route/query'
import { RouteRegExp, subscribeHistoryPushReplace } from '../../domain/route'
import Training from '../../views/Training'
import { css } from '@emotion/css'

export default function Router ({ destruction$ }) {
  subscribeHistoryPushReplace(destruction$)

  const route$ = firstPathChange$
  .pipe(
    takeUntil(destruction$),
    map(firstPath => {
      if (RouteRegExp.home.test(firstPath)) {
        return <Training destruction$={firstPathChange$} />
      } else if (RouteRegExp.mortgage.test(firstPath)) {
        return <Mortgage destruction$={firstPathChange$} />
      } else if (RouteRegExp.draw.test(firstPath)) {
        return <Draw destruction$={firstPathChange$} />
      } else if (RouteRegExp.babylon.test(firstPath)) {
        return <Babylon destruction$={firstPathChange$} />
      } else if (RouteRegExp.training.test(firstPath)) {
        return <Training destruction$={firstPathChange$} />
      } else {
        return <NotFound />
      }
    })
  )

  return (
    <div class={css`
      display: flex;
      width: 100%;
      justify-content: center;
    `} single$={route$} />
  )
}
