import 'babylonjs-loaders';
import * as BABYLON from 'babylonjs';
import { css } from '@emotion/css'
import { takeUntil, withLatestFrom } from 'rxjs'
import { scene$, mountScene, plane$, shark$ } from '../../3d'
import { toElement$, _withAnimationFrame_ } from '../../jsx'

export default function Babylon1 ({ destruction$ }) {
  const [canvas$] = toElement$(destruction$)

  canvas$
  .pipe(
    takeUntil(destruction$),
    _withAnimationFrame_,
  )
  .subscribe(mountScene)

  plane$
  .pipe(
    takeUntil(destruction$),
    withLatestFrom(scene$)
  )
  .subscribe(async ([file, scene]) => {
    const loaded = await BABYLON.SceneLoader.ImportMeshAsync("", "", file, scene);
    loaded.meshes[0].position = new BABYLON.Vector3(2, 0, 0);
    loaded.meshes[0].scaling = new BABYLON.Vector3(5, 5, 5);
  })

  shark$
  .pipe(
    takeUntil(destruction$),
    withLatestFrom(scene$)
  )
  .subscribe(async ([file, scene]) => {
    const loaded = await BABYLON.SceneLoader.ImportMeshAsync("", "", file, scene);
    loaded.meshes[0].position = new BABYLON.Vector3(-2, 0, 0);
    loaded.meshes[0].scaling = new BABYLON.Vector3(.1, .1, .1);
  })

  return (
    <canvas class={css`
      height: 750px;
      width: 750px;
      `} element$={canvas$} />
  )
}
