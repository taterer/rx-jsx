import { takeUntil, withLatestFrom } from 'rxjs';
import { toElement$ } from '../../jsx';
import { firstPathChange$ } from '../../streams/location';
import { RouteRegExp } from '../../utils/routes';

export default function NavbarItem ({ destruction$, title, path }) {
  const [navbarItem$] = toElement$(destruction$)

  firstPathChange$.pipe(
    withLatestFrom(navbarItem$),
    takeUntil(destruction$)
  ).subscribe({
    next: ([firstPath, navbarItem]) => {
      if (RouteRegExp[path] && RouteRegExp[path].test(firstPath)) {
        return navbarItem.classList.add('mdc-tab-indicator--active')
      } else if (!RouteRegExp[path]) {
        if (!Object.values(RouteRegExp).some(regexp => regexp.test(firstPath))) {
          return navbarItem.classList.add('mdc-tab-indicator--active')
        }
      }
      navbarItem.classList.remove('mdc-tab-indicator--active')
    }
  })

  return (
    <button class="mdc-tab" role="tab" aria-selected="true" tabindex="0" onClick={() => history.pushState({}, '', `/${path}`)}>
      <span class="mdc-tab__content">
        <span class="mdc-tab__text-label">{title}</span>
      </span>
      <span element$={navbarItem$} class="mdc-tab-indicator">
        <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
      </span>
      <span class="mdc-tab__ripple"></span>
    </button>
  )
}
