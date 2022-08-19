import { fromEvent, merge } from 'rxjs'
import {
  mergeWith,
  shareReplay,
  map,
  distinctUntilChanged,
  share,
  tap
} from 'rxjs/operators'
import { BASE_URL } from '../../config'
import { pushHistory$, replaceHistory$ } from './command'

export const pathname$ = createPathnameStream().pipe(shareReplay(1))

export const pathnameChange$ = createPathnameStream()

export const _mapToFirstPath_ = map((pathname: string) => pathname.replace(/^\/*([^/]*).*/g, '$1'))

export const firstPathChange$ = pathname$
.pipe(
  _mapToFirstPath_,
  distinctUntilChanged(),
  share()
)

export const _mapToSecondPath_ = map((pathname: string) => pathname.replace(/^\/*[^/]*\/*/g, ''))

export const secondPathChange$ = pathname$
.pipe(
  _mapToSecondPath_,
  distinctUntilChanged(),
  share()
)

export function createPathnameStream () {
  const load$ = fromEvent(window, 'load')
  const popstate$ = fromEvent(window, 'popstate')
  return load$
  .pipe(
    mergeWith(popstate$),
    map((event: any) => event.target.location.pathname.replace(BASE_URL, '').replace(/^\/*\?*\/*/, '')),
    mergeWith(
      merge(pushHistory$, replaceHistory$)
      .pipe(
        map(history => history.url)
      )
    ),
  )
}
