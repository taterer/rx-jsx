# tater-stream
Base example for using JSX with RxJS without React

With a basic router implementation


## Getting started
Install dependencies with `yarn`

Start the app with `yarn start`

For collaborative drawing using sockets, also start the server with `yarn start:server`

## Why?
I thought it would be interesting to try using JSX without React, and try to base the application on streams, rather than objects. Though JSX is still a little objecty. The intention for the paradigm is to essentially not use state, but operate functionaly, and derive state at any point that it's needed, sharing pipelines if multiple components rely on similar things.






Helper code
Factory template:
```
import { EMPTY, Observable, Subject } from "rxjs";

function playerFactory (destruction$: Observable<any>) {
  const player$ = new Subject()
    
  return player$.asObservable()
}

export const player$ = playerFactory(EMPTY)
```
