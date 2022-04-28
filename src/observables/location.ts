import { fromEvent, Observable } from 'rxjs'
import { mergeWith, shareReplay, map, distinctUntilChanged, share } from 'rxjs/operators'

export const pathname$ = createPathnameStream()

export const _mapToFirstPath_ = map((pathname: string) => pathname.replace(/^\/*([^/]*).*/g, '$1'))

export const firstPathChange$ = pathname$
.pipe(
  _mapToFirstPath_,
  distinctUntilChanged(),
  share()
)

export const _mapToSecondPath_ = map((pathname: string) => pathname.replace(/^\/*[^/]*/g, ''))

export const secondPathChange$ = pathname$
.pipe(
  _mapToSecondPath_,
  distinctUntilChanged(),
  share()
)

export function createPathnameStream () {
  const load$ = fromEvent(window, 'load')
  const popstate$ = fromEvent(window, 'popstate')
  const cleanLoadAndPopstate$ = load$
  .pipe(
    mergeWith(popstate$),
    map((event: any) => event.target.location.pathname)
  )
  return new Observable(obs => {
    // Inject observable callback into browser functions
    (function (history) {
      var pushState = history.pushState;
      history.pushState = function () {
        obs.next(arguments[2])
        return pushState.apply(history, arguments);
      }
      var replaceState = history.replaceState;
      history.replaceState = function () {
        obs.next(arguments[2])
        return replaceState.apply(history, arguments);
      }
    })(window.history)
  })
  .pipe(
    mergeWith(cleanLoadAndPopstate$),
    shareReplay(1) /* ensures it only replaces the browser functions once,
    and provides the latest state to new subscribers */
  )
}
