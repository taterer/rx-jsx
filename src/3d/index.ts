import * as BABYLON from 'babylonjs';
import {
  EMPTY,
  from,
  map,
  Observable,
  shareReplay,
  Subject,
  switchMap,
  takeUntil
} from "rxjs";
import { _withAnimationFrame_ } from '../jsx';
import { viewport$ } from "../observables/viewport";
import { createScene } from "./babylon/scene";

export const [scene$, mountScene] = sceneFactory(EMPTY)

export const assetsManager$ = scene$
.pipe(
  map(scene => {
      var assetsManager = new BABYLON.AssetsManager(scene);
      assetsManager.load();
  })
)

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
export function sceneFactory (destruction$: Observable<any>): [Observable<BABYLON.Scene>, (canvas: HTMLCanvasElement) => void] {
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
