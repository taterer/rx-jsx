import { fromEvent, mergeWith, shareReplay, startWith } from 'rxjs'

export const scroll$ = createScrollStream()

export function createScrollStream () {
  return fromEvent(window as any, 'scroll')
  .pipe(
    shareReplay(1)
  )
}

export const viewport$ = createViewportStream()

export function createViewportStream () {
  return fromEvent(window as any, 'resize')
  .pipe(
    mergeWith(scroll$),
    shareReplay(1),
    startWith(1)
  )
}
