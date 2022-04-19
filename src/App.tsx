import { css } from '@emotion/css'
import Routes from './views/Routes'

export default function App () {
  // const [homeButton$] = toElement$(EMPTY)
  // fromEventElement$(homeButton$, 'click').subscribe({
  //   next: () => history.pushState({}, '', '/')
  // })

  return (
    <div class={css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `}>
      {/* <div class={css`
        padding: 20px;
        width: 100%;
        max-width: 800px;
        align-self: center;
        background-color: white;
      `}> */}
      <nav class="blue lighten-2">
          <ul id="nav-mobile">
            <li><a class='btn waves-effect waves-light blue darken-2' onClick={() => history.pushState({}, '', '/')}>Home</a></li>
            <li><a class='btn waves-effect waves-light blue darken-2' onClick={() => history.pushState({}, '', '/calc')}>Calculator</a></li>
            <li><a class='btn waves-effect waves-light blue darken-2' onClick={() => history.pushState({}, '', '/asdf')}>Elsewhere</a></li>
          </ul>
      </nav>
      <Routes />
    </div>
  )
}
