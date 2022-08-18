import NavbarItem from './NavbarItem'
import { css } from '@emotion/css'
import { Route } from '../../domain/route'

export default function Navbar ({ destruction$ }) {
  return (
    <div class={css`
        width: 100%;
      `}>
      <div class={css`
        position: fixed;
        z-index: 1;
        width: 100%;
      `}>
        <nav class='blue'>
            <ul id='nav-mobile'>
              <NavbarItem destruction$={destruction$} path={Route.training} title="Home" />
              <NavbarItem destruction$={destruction$} path={Route.mortgage} title="Mortgage" />
              <NavbarItem destruction$={destruction$} path={Route.draw} title="Draw" />
              <NavbarItem destruction$={destruction$} path={Route.babylon} title="Babylon" />
              <NavbarItem destruction$={destruction$} path={'asdf'} title="Else" />
            </ul>
        </nav>
      </div>
      <div class={css`
        height: 64px;
      `}>
      </div>
    </div>
  )
}
