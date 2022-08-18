import { css } from '@emotion/css'
import { EMPTY } from 'rxjs'
import Navbar from './components/Navbar'
import Router from './components/Router'

export default function App () {
  return (
    <div class={css`
      display: flex;
      flex-direction: column;
      justify-content: left;
      align-items: center;
      height: 100%;
      width: 100%;
    `}>
      <Navbar destruction$={EMPTY} />
      <Router destruction$={EMPTY} />
    </div>
  )
}
