import { EMPTY, Observable, shareReplay, Subject } from "rxjs";
import { AddUnit, Unit, unitFactory } from "./unit";

interface NewPlayer {
  name: string;
  local: boolean;
}

interface Player extends NewPlayer {
  unit$: Observable<Unit>;
  addUnit: AddUnit;
}

function playerFactory (destruction$: Observable<any>): [Observable<Player>, (newPlayer: NewPlayer) => void] {
  const player$ = new Subject<Player>()

  return [player$.asObservable().pipe(shareReplay()), (newPlayer) => {
    const [unit$, addUnit] = unitFactory(EMPTY)

    const player: Player = {
      name: newPlayer.name,
      local: newPlayer.local,
      unit$,
      addUnit
    }
    player$.next(player)
  }]
}

export const [player$, newPlayer] = playerFactory(EMPTY)
