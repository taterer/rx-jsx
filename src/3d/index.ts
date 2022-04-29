import * as BABYLON from 'babylonjs';
import {
  EMPTY,
  filter,
  from,
  map,
  Observable,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
} from "rxjs";
import { _withAnimationFrame_ } from '../jsx';
import { viewport$ } from "../observables/viewport";
import { createScene } from "./babylon/scene";

export const [scene$, mountScene] = sceneFactory(EMPTY)

export const plane$ = from(fetch('/models/aerobatic_plane.glb'))
.pipe(
  switchMap(response => response.arrayBuffer()),
  map(arrayBuffer => new File([arrayBuffer], "aerobatic_plane.glb")),
  _withAnimationFrame_,
  shareReplay(1)
)

export const shark$ = from(fetch('/models/shark.glb'))
.pipe(
  switchMap(response => response.arrayBuffer()),
  map(arrayBuffer => new File([arrayBuffer], "shark.glb")),
  _withAnimationFrame_,
  shareReplay(1)
)

// Must be mounted to be useful
function sceneFactory (destruction$: Observable<any>): [Observable<BABYLON.Scene>, (canvas: HTMLCanvasElement) => void] {
  const scene$ = new Subject<BABYLON.Scene>()

  return [
    scene$.asObservable(),
    (canvas: HTMLCanvasElement) => {
      const { engine, scene } = createScene(canvas)

      scene$.next(scene)

      engine.runRenderLoop(function () {
        scene.render();
      });

      viewport$.pipe(
        takeUntil(destruction$)
      ).subscribe(() => engine.resize())
    }
  ]
}

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

export const _closestMesh_ = map(([pointerInfo, meshArray]: [BABYLON.PointerInfo, BABYLON.Mesh[]]) => meshArray.reduce(({ distance, mesh }, current): any => {
  const newDistance = BABYLON.Vector3.DistanceSquared(current.position, pointerInfo.pickInfo.pickedPoint)
  if (newDistance < distance) {
    return { distance: newDistance, mesh: current }
  }
  return { distance, mesh }
}, { distance: Infinity, mesh: undefined }))

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
    if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) return true
    if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERUP) return false
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
