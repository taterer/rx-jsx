import { combineLatestWith, map, takeUntil } from 'rxjs'
import { classSync, toElement$ } from '../../jsx'
import { pushHistory } from '../../domain/route/command';
import { pathname$ } from '../../domain/route/query';

export default function NavbarItem ({ destruction$, title, path }) {
  const [navbarItem$] = toElement$(destruction$)

  pathname$
  .pipe(
    combineLatestWith(navbarItem$),
    takeUntil(destruction$)
  )
  .subscribe({
    next: ([pathname, navbarItem]) => {
      classSync(
        navbarItem,
        'active',
        pathname === path
      )
    }
  })

  return (
    <li element$={navbarItem$}>
      <a class='waves-effect waves-light' style="width: 100%; text-align: center;" onClick={() => pushHistory({ url: path })}>{title}</a>
    </li>
  )
}
