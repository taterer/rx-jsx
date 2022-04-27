import { fromEvent, map, mergeMap, of, switchMap, takeUntil } from 'rxjs';
import { Server } from 'socket.io';

const socketServer$ = of(new Server(3000, {
  cors: {
    origin: "http://localhost:1234",
    methods: ["GET", "POST"]
  }
}));

const socketConnection$ = socketServer$.pipe(
  switchMap(io =>
    fromEvent<any>(io, 'connection')
    .pipe(
      map(client => ({ io, client }))
    )
  )
)

const socketDisconnect$ = socketConnection$.pipe(
  mergeMap(({ client }) =>
    fromEvent<any>(client, 'disconnect')
    .pipe(
      map(() => client)
    )
  )
)

function listenOnConnect(event: string) {
  return socketConnection$
  .pipe(
    mergeMap(({ io, client }) =>
      fromEvent(client, event)
      .pipe(
        takeUntil(
          fromEvent(client, 'disconnect')
        ),
        map(data => ({ io, client, data }))
      )
    )
  )
}

socketConnection$
.subscribe(client => {
  console.log('client connected')
})

socketDisconnect$
.subscribe(client => {
  console.log('client disconnected')
})

listenOnConnect('draw')
.subscribe({
  next: ({ client, data }) => {
    client.broadcast.emit('draw', data)
  }
})
