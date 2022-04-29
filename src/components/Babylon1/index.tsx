import 'babylonjs-loaders';
import * as BABYLON from 'babylonjs';
import { css } from '@emotion/css'
import { combineLatestWith, filter, take, takeUntil, tap, withLatestFrom } from 'rxjs'
import { scene$, mountScene, plane$, shark$, pointerPick$ } from '../../3d'
import { toElement$, _withAnimationFrame_ } from '../../jsx'
import { newPlayer, player$ } from '../../observables/player';

export default function Babylon1 ({ destruction$ }) {
  const [canvas$] = toElement$(destruction$)

  canvas$
  .pipe(
    takeUntil(destruction$),
    _withAnimationFrame_,
  )
  .subscribe(mountScene)

  player$
  .pipe(
    takeUntil(destruction$)
  )

  // Local player initialization
  player$
  .pipe(
    takeUntil(destruction$),
    filter(player => !!player.local),
    combineLatestWith(scene$, plane$),
  )
  .subscribe(async ([player, scene, file]) => {
    player.addUnit(scene, file, { position: new BABYLON.Vector3(2, 2, 0), scaling: new BABYLON.Vector3(5, 5, 5)})
  })

  // Remote player initialization
  // player$
  // .pipe(
  //   takeUntil(destruction$),
  //   filter(player => !player.local),
  //   combineLatestWith(scene$, plane$),
  // )
  // .subscribe(async ([_, scene, file]) => {
  //   const loaded = await BABYLON.SceneLoader.ImportMeshAsync("", "", file, scene);
  //   loaded.meshes[0].position = new BABYLON.Vector3(2, 2, 0);
  //   loaded.meshes[0].scaling = new BABYLON.Vector3(5, 5, 5);
  // })

  newPlayer({ name: 'Player 1', local: true })
  newPlayer({ name: 'Player 1', local: false })

  pointerPick$.subscribe(mesh => console.log(mesh.pickInfo))

  // pointerUp$
  // .pipe(
  //   takeUntil(destruction$),
  //   combineLatestWith(pointerIsDragging$),
  //   filter((_, isDragging) => !!isDragging),
  //   combineLatestWith(scene$, pointerPickedMesh$),
  //   tap(console.log)
  // )
  // .subscribe(([_, scene, pickedMesh]) => {
  //   var pickResult = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
  //     return mesh.name == "ground1";
  //   });
  //   if (pickResult.pickedMesh.name !== 'ground1') {
  //     pickedMesh.position = new BABYLON.Vector3(pickResult.pickedPoint._x, pickResult.pickedPoint._y, pickedMesh.position._z);
  //   }
  // })

  shark$
  .pipe(
    takeUntil(destruction$),
    combineLatestWith(scene$)
  )
  .subscribe(async ([file, scene]) => {
    const loaded = await BABYLON.SceneLoader.ImportMeshAsync("", "", file, scene);
    loaded.meshes[0].position = new BABYLON.Vector3(-2, 0, 0);
    loaded.meshes[0].scaling = new BABYLON.Vector3(.1, .1, .1);
  })

  return (
    <canvas class={css`
      height: 750px;
      width: 550px;
      `} element$={canvas$} />
  )
}
