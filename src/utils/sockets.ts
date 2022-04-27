import { fromEvent, map, of, switchMap, withLatestFrom } from 'rxjs';
import { io } from 'socket.io-client';

const socket$ = of(io('ws://localhost:3000'));

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

export const _withSocketConnection_ = withLatestFrom(socketConnect$)

export function subscribeServer (name: string) {
  return {
    next: ([message, client]) => {
      client.emit(name, message)
    }
  }
}
