import * as BABYLON from 'babylonjs';
import { combineLatestWith, map, Observable, scan, startWith, Subject, takeUntil, tap } from "rxjs";
import { assetScaling, shortFileName } from '../3d/babylon/assets';

export interface Unit {
  fileName: string
  meshes: BABYLON.AbstractMesh[] | BABYLON.Mesh[]
  playerName: string
}

export interface AddUnit {
  0: { position?: BABYLON.Vector3, scaling?: BABYLON.Vector3 }
  1: File
  2: BABYLON.Scene
}

export interface RemoveUnit {
  0: Unit;
  1: BABYLON.Scene
}

export interface UnitFactory {
  unit$: Observable<Unit>,
  unitArray$: Observable<Unit[]>,
  addUnit: (addUnit: AddUnit) => void,
  removeUnit: (unit: RemoveUnit) => void,
}

export function unitFactory (destruction$: Observable<any>, playerName: string): UnitFactory {
  const unit$ = new Subject<Unit>()
  const addUnit$ = new Subject<AddUnit>()
  const removeUnit$ = new Subject<RemoveUnit>()

  addUnit$
  .pipe(
    takeUntil(destruction$)
  )
  .subscribe(async (incoming) => {
    const options = incoming[0];
    const file = incoming[1];
    const scene = incoming[2];

    const loaded = await BABYLON.SceneLoader.ImportMeshAsync("", "", file, scene);
    if (options.position) {
      loaded.meshes[0].position = options.position;
    }
    if (options.scaling) {
      loaded.meshes[0].scaling = options.scaling;
    } else if (assetScaling[shortFileName(file)]) {
      loaded.meshes[0].scaling = assetScaling[shortFileName(file)]
    }
    unit$.next({ meshes: loaded.meshes, fileName: shortFileName(file), playerName })
  })

  removeUnit$
  .pipe(
    takeUntil(destruction$),
  )
  .subscribe(incoming => {
    const unit = incoming[0]
    const scene = incoming[1]
    scene.removeMesh(unit.meshes[0], true);
  })

  const unitArray$ = unit$
  .pipe(
    _accumulateUnitToArray_(),
    combineLatestWith(
      removeUnit$.pipe(
        map(i => i[0]),
        _accumulateUnitToArray_(),
        startWith([])
      )
    ),
    map(([unitArray, removedUnits]) => unitArray.filter(u => !removedUnits.some(removed => removed.meshes[0].uniqueId === u.meshes[0].uniqueId))),
    startWith([])
  )

  return {
    unit$: unit$.asObservable().pipe(takeUntil(destruction$)),
    unitArray$,
    addUnit: i => addUnit$.next(i),
    removeUnit: i => removeUnit$.next(i)
  }
}

function _accumulateUnitToArray_ () {
  return scan((arr: Unit[], unit: Unit) => {
    if (!arr.some(u => u.meshes[0].uniqueId === unit.meshes[0].uniqueId)) {
      arr.push(unit)
    }
    return arr
  }, [])
}

export function _closestUnit_ () {
  return map(([pointerInfo, unitArray]: [BABYLON.PointerInfo, Unit[]]) => unitArray.reduce(({ distance, unit }, current): any => {
    const newDistance = BABYLON.Vector3.DistanceSquared(current.meshes[0].position || BABYLON.Vector3.Zero(), pointerInfo.pickInfo.pickedPoint || BABYLON.Vector3.Zero())
    if (newDistance < distance) {
      return { distance: newDistance, unit: current, pickedPoint: pointerInfo.pickInfo.pickedPoint }
    }
    return { distance, unit, pickedPoint: pointerInfo.pickInfo.pickedPoint }
  }, { distance: Infinity, unit: undefined, pickedPoint: pointerInfo.pickInfo.pickedPoint }))
}
