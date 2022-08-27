import { combineLatestWith, of, takeUntil } from 'rxjs'
import { classSync } from '@taterer/rx-jsx'
import { pushHistory } from '../../domain/route/command';
import { pathname$ } from '../../domain/route/query';

export default function NavbarItem ({ destruction$, title, path }) {
  const navbarItem$ = of<Element>(
    <li style='width: 100%;'>
      <a
        class='waves-effect waves-light'
        style='width: 100%; text-align: center;'
        href={path}
        onClick={event => {
          if (!event.ctrlKey) {
            pushHistory({ url: path })
            event.preventDefault()
          }
        }}>
          {title}
        </a>
    </li>
  )

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
    <div single$={navbarItem$} />
  )
}
