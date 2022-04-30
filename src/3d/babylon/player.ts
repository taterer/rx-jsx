import {
  EMPTY,
  filter,
  Observable,
  shareReplay,
  Subject,
  takeUntil
} from "rxjs";
import { UnitFactory, unitFactory } from "./unit";

export interface Player extends AddPlayer, UnitFactory {}

interface AddPlayer {
  name: string;
  local: boolean;
  npc?: boolean;
}

interface PlayerFactory {
  player$: Observable<Player>,
  addPlayer: (newPlayer: AddPlayer) => void
}

function playerFactory (destruction$: Observable<any>): PlayerFactory {
  const player$ = new Subject<Player>()
  const addPlayer$ = new Subject<AddPlayer>()
  
  addPlayer$
  .pipe(
    takeUntil(destruction$)
  )
  .subscribe((newPlayer) => {
    const unit = unitFactory(destruction$, newPlayer.name)

    const player: Player = {
      ...unit,
      ...newPlayer
    }
    player$.next(player)
  })

  return {
    player$: player$.asObservable().pipe(shareReplay()),
    addPlayer: i => addPlayer$.next(i)
  }
}

export const { player$, addPlayer } = playerFactory(EMPTY)

export const npcPlayer$ = player$
.pipe(
  filter(player => !!player.local && !!player.npc),
)

export const localPlayer$ = player$
.pipe(
  filter(player => !!player.local && !player.npc),
)

export const remotePlayer$ = player$
.pipe(
  filter(player => !player.local && !!player.npc),
)
