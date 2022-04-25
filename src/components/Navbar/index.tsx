import NavbarItem from '../NavbarItem'
import { Route } from '../../utils/route'

export default function Navbar ({ destruction$ }) {
  return (
    <nav class='blue lighten-2'>
        <ul id='nav-mobile'>
          <NavbarItem destruction$={destruction$} path={Route.home} title="Home" />
          <NavbarItem destruction$={destruction$} path={Route.calc} title="Calc" />
          <NavbarItem destruction$={destruction$} path={Route.draw} title="Draw" />
          <NavbarItem destruction$={destruction$} path={'asdf'} title="Else" />
        </ul>
    </nav>
  )
}
