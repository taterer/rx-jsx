import * as BABYLON from 'babylonjs';
import { EMPTY, Observable, shareReplay, Subject, takeUntil } from "rxjs";

export interface Unit {
  mesh: BABYLON.AbstractMesh | BABYLON.Mesh;
}

export interface AddUnit {
  (scene: BABYLON.Scene, unit: File, options: { position, scaling }): void;
}

export function unitFactory (destruction$: Observable<any>): [Observable<Unit>, AddUnit] {
  const unit$ = new Subject<Unit>()
  return [
    unit$.asObservable().pipe(takeUntil(destruction$)),
    async (scene, file, { position, scaling }) => {
      const loaded = await BABYLON.SceneLoader.ImportMeshAsync("", "", file, scene);
      if (position) {
        loaded.meshes[0].position = position;
      }
      if (scaling) {
        loaded.meshes[0].scaling = scaling;
      }
      unit$.next({ mesh: loaded.meshes[0] })
    }
  ]
}
