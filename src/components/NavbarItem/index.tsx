import { takeUntil, withLatestFrom } from 'rxjs'
import { firstPathChange$ } from '../../observables/location'
import { toElement$ } from '../../jsx'
import { RouteRegExp } from '../../utils/route';

export default function NavbarItem ({ destruction$, title, path }) {
  const [navbarItem$] = toElement$(destruction$)

  firstPathChange$
  .pipe(
    withLatestFrom(navbarItem$),
    takeUntil(destruction$)
  )
  .subscribe({
    next: ([firstPath, navbarItem]) => {
      if (RouteRegExp[path] && RouteRegExp[path].test(firstPath)) {
        return navbarItem.classList.add('active')
      } else if (!RouteRegExp[path]) {
        if (!Object.values(RouteRegExp).some(regexp => regexp.test(firstPath))) {
          return navbarItem.classList.add('active')
        }
      }
      navbarItem.classList.remove('active')
    }
  })

  return (
    <li element$={navbarItem$}>
      <a class='waves-effect waves-light' onClick={() => history.pushState({}, '', `/${path}`)}>{title}</a>
    </li>
  )
}
