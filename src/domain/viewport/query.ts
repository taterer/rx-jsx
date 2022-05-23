import { fromEvent, shareReplay, startWith } from 'rxjs'

export const scroll$ = fromEvent(window as any, 'scroll')
.pipe(
  shareReplay(1)
)

export const viewport$ = fromEvent(window as any, 'resize')
.pipe(
  startWith(undefined),
  shareReplay(1)
)
