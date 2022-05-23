import { takeUntil, withLatestFrom } from 'rxjs'
import { classSync, toElement$ } from '../../jsx'
import { pushHistory } from '../../domain/route/command';
import { firstPathChange$ } from '../../domain/route/query';
import { RouteRegExp } from '../../domain/route';

export default function NavbarItem ({ destruction$, title, path }) {
  const [navbarItem$] = toElement$(destruction$)

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
    <li element$={navbarItem$}>
      <a class='waves-effect waves-light' onClick={() => pushHistory({ url: `/${path}` })}>{title}</a>
    </li>
  )
}
