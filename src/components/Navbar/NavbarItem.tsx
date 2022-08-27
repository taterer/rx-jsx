import { of, takeUntil, withLatestFrom } from 'rxjs'
import { classSync } from '@taterer/rx-jsx'
import { pushHistory } from '../../domain/route/command';
import { firstPathChange$ } from '../../domain/route/query';
import { RouteRegExp } from '../../domain/route';

export default function NavbarItem ({ destruction$, title, path }) {
  const navbarItem$ = of<Element>(
    <li>
      <a class='waves-effect waves-light' href={`/${path}`} onClick={event => {
        if (!event.ctrlKey) {
          pushHistory({ url: `/${path}` })
          event.preventDefault()
        }
      }}>{title}</a>
    </li>
  )

  firstPathChange$
  .pipe(
    withLatestFrom(navbarItem$),
    takeUntil(destruction$)
  )
  .subscribe({
    next: ([firstPath, navbarItem]) => {
      classSync(
        navbarItem,
        'active',
        (RouteRegExp[path] && RouteRegExp[path].test(firstPath)) ||
          // If there is no match for any route regular expressions, set active if the given navbar path item has no corresponding route regular expression
          (!RouteRegExp[path] && !Object.values(RouteRegExp).some(regexp => regexp.test(firstPath)))
      )
    }
  })

  return (
    <div single$={navbarItem$} />
  )
}
