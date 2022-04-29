import { css, cx } from '@emotion/css'
import { EMPTY } from 'rxjs'
import Navbar from './components/Navbar'
import Router from './components/Router'

export default function App () {

  return (
    <div class={css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `}>
      <Navbar destruction$={EMPTY} />
      <div class={cx('card-panel', css`
        width: 100%;
        max-width: 800px;
        
        @media (max-width: 600px) {
          padding: 10px 0px;
        }
      `)}>
        <Router destruction$={EMPTY} />
      </div>
    </div>
  )
}
