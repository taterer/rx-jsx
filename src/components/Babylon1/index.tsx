import * as BABYLON from 'babylonjs';
import { css } from '@emotion/css'
import { combineLatestWith, filter, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs'
import { toElement$, _withAnimationFrame_ } from '../../jsx'
import { localPlayer$, player$, addPlayer, npcPlayer$, Player } from '../../observables/player';
import { pointerDown$, pointerIsDragging$ } from '../../3d/babylon/pointer';
import { mountScene, scene$ } from '../../3d/babylon/scene';
import { assets, observableFromName } from '../../3d/babylon/assets';
import { Unit, _closestUnit_ } from '../../observables/unit';
import { monitor } from '../../observables/monitor';

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
  localPlayer$
  .pipe(
    takeUntil(destruction$),
    combineLatestWith(scene$, assets.aerobatic_plane$),
  )
  .subscribe(async ([player, scene, plane]) => {
    player.addUnit([{ position: new BABYLON.Vector3(2, 2, 0) }, plane, scene])
  })

  localPlayer$
  .pipe(
    takeUntil(destruction$),
    combineLatestWith(scene$, assets.shark$),
  )
  .subscribe(([player, scene, shark]) => {
    player.addUnit([{ position: new BABYLON.Vector3(-2, 0, 0) }, shark, scene])
  })

  // localPlayerUnitArray$
  // .pipe(
  //   takeUntil(destruction$),
  //   combineLatestWith(scene$, shark$),
  // )
  // .subscribe(async ([player, scene, shark]) => {
  //   player.addUnit(scene, shark, { position: new BABYLON.Vector3(-2, 0, 0), scaling: new BABYLON.Vector3(.1, .1, .1)})
  // })

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

  const localPlayerUnitArray$ = localPlayer$
  .pipe(
    switchMap(player => player.unitArray$),
  )

  const gayaUnitArray$ = npcPlayer$
  .pipe(
    switchMap(player => player.unitArray$),
    tap(console.log)
  )

  const closestUnit$ = pointerDown$
  .pipe(
    takeUntil(destruction$),
    combineLatestWith(localPlayerUnitArray$),
    _closestUnit_,
    map(i => i.unit as Unit)
  )

  const closestUnitAsset$ = closestUnit$
  .pipe(
    filter(closestUnit => observableFromName(closestUnit.fileName)),
    switchMap<any, [File]>(closestUnit => observableFromName(closestUnit.fileName))
  )

  monitor([localPlayerUnitArray$, gayaUnitArray$])

  pointerIsDragging$
  .pipe(
    takeUntil(destruction$),
    withLatestFrom(npcPlayer$, scene$, closestUnitAsset$, gayaUnitArray$),
  )
  .subscribe(([dragging, player, scene, asset, gayaUnits]: [any, Player, any, any, any]) => {
    if (dragging.isDragging) {
      player.addUnit([{ position: dragging.pointerInfo.pickInfo.pickedPoint }, asset, scene])
    } else {
      gayaUnits.forEach(unit => player.removeUnit([unit, scene]))
    }
  })

  addPlayer({ name: 'Gaya', local: true, npc: true })
  addPlayer({ name: 'Player 1', local: true })
  // addPlayer({ name: 'Player 2', local: false })

  // pointerPick$.subscribe(mesh => console.log(mesh.pickInfo))

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

  return (
    <canvas class={css`
      height: 750px;
      width: 550px;
      `} element$={canvas$} />
  )
}
