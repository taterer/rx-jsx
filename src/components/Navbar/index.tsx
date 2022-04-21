import './index.scss'
import { EMPTY } from 'rxjs';
import { MDCTabBar } from '@material/tab-bar';
import { toElement$ } from '../../jsx'
import NavbarItem from '../NavbarItem';
import { Route } from '../../utils/routes';

export default function Navbar () {
  const [tab$] = toElement$(EMPTY)

  tab$.subscribe({
    next: tab => new MDCTabBar(tab)
  })

  return (
    <div class="mdc-tab-bar" role="tablist" element$={tab$}>
      <div class="mdc-tab-scroller">
        <div class="mdc-tab-scroller__scroll-area">
          <div class="mdc-tab-scroller__scroll-content">
            <NavbarItem destruction$={EMPTY} path={Route.home} title="Home" />
            <NavbarItem destruction$={EMPTY} path={Route.calc} title="Calc" />
            <NavbarItem destruction$={EMPTY} path={Route.draw} title="Draw" />
            <NavbarItem destruction$={EMPTY} path={'asdf'} title="Else" />
          </div>
        </div>
      </div>
    </div>
  )
}
