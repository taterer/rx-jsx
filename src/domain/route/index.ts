import { takeUntil } from "rxjs";
import { BASE_URL } from "../../config";
import { pushHistory$, replaceHistory$ } from "./command";

export enum Route {
  home = '',
  mortgage = 'mortgage',
  draw = 'draw',
  babylon = 'babylon',
  training = 'training',
}

export function subscribeHistoryPushReplace (destruction$) {
  pushHistory$
  .pipe(
    takeUntil(destruction$)
  )
  .subscribe(pushHistory => {
    history.pushState({}, '', `${BASE_URL}${pushHistory.url}`)
  })
  replaceHistory$
  .pipe(
    takeUntil(destruction$)
  )
  .subscribe(replaceHistory => {
    history.replaceState({}, '', `${BASE_URL}${replaceHistory.url}`)
  })
}

export const RouteRegExp = {
  '': /^$/,
  home: /^$/,
  mortgage: /^mortgage$/,
  draw: /^draw$/,
  babylon: /^babylon$/,
  training: /^training$/,
}
