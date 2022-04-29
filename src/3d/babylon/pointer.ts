import * as BABYLON from 'babylonjs';
import {
  EMPTY,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
} from "rxjs";
import { scene$ } from './scene';

function pointerFactory (destruction$: Observable<any>, scene$: Observable<BABYLON.Scene>) {
  const pointer$ = new Subject<BABYLON.PointerInfo>()

  scene$
  .pipe(
    takeUntil(destruction$),
  ).subscribe(scene => {
    scene.onPointerObservable.add((pointerInfo) => {
      pointer$.next(pointerInfo)
    });
  })

  return pointer$.asObservable()
}

export const pointer$ = pointerFactory(EMPTY, scene$)

export const pointerUp$ = pointer$
.pipe(
  filter(pointerInfo => pointerInfo.type === BABYLON.PointerEventTypes.POINTERUP)
)

export const pointerDown$ = pointer$
.pipe(
  filter(pointerInfo => pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN)
)

export const pointerIsDragging$ = pointer$
.pipe(
  filter(pointerInfo => pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN || pointerInfo.type === BABYLON.PointerEventTypes.POINTERUP),
  map(pointerInfo => {
    if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) return { pointerInfo, isDragging: true }
    if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERUP) return { pointerInfo, isDragging: false }
  }),
)

export const pointerMove$ = pointer$
.pipe(
  filter(pointerInfo => pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE)
)

export const pointerPick$ = pointer$
.pipe(
  filter(pointerInfo => pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK)
)
