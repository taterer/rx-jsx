import { EMPTY, fromEvent, map, Observable, of, switchMap, takeUntil, withLatestFrom } from 'rxjs';
import { io } from 'socket.io-client';
import { SOCKETS_ENABLED } from '../../config';

const socket$ = SOCKETS_ENABLED === 'false' ? EMPTY : of(io('ws://localhost:3000'));

export const socketConnect$ = socket$
.pipe(
  switchMap(socket =>
    fromEvent(socket, 'connect')
      .pipe(
        map(() => socket)
      )
  )
)

export const socketDraw$ = socketConnect$
.pipe(
  switchMap(socket =>
    fromEvent(socket, 'draw')
  )
)

export function subscribeAndPushToChannel (destruction$, channelName: string, observable$: Observable<any>) {
  return observable$
  .pipe(
    withLatestFrom(socketConnect$),
    takeUntil(destruction$)

  )
  .subscribe(([message, client]) => {
      client.emit(channelName, message)
    }
  )
}
