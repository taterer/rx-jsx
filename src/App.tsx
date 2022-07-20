import { css } from '@emotion/css'
import { EMPTY, Observable } from 'rxjs'
import { share, map, shareReplay } from 'rxjs/operators'
// import Navbar from './components/Navbar'
import Router from './components/Router'
import { create } from "rxjs-spy";

const spy = create();
export const spy$ = new Observable<string>(function (subscriber) {
    spy.log({ log: i => subscriber.next(i) })
  })
  .pipe(
    map(i => {
      const [line1, line2] = i.split('; ')
      const [_tag, tag] = line1.split(' = ')
      const [_notitication, notitication] = line2.split(' = ')
      return { tag, notitication }
    }),
    share()
  )

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
      {/* <Navbar destruction$={EMPTY} /> */}
      <Router destruction$={EMPTY} />
    </div>
  )
}
