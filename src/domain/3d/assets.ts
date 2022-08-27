import 'babylonjs-loaders';
import {
  from,
  map,
  shareReplay,
  switchMap,
} from "rxjs";
import { BASE_URL } from '../../config';
import { withAnimationFrame } from "@taterer/rx-jsx";

const aerobatic_plane$ = from(fetch(`${BASE_URL}/models/aerobatic_plane.glb`))
.pipe(
  switchMap(response => response.arrayBuffer()),
  map(arrayBuffer => new File([arrayBuffer], "aerobatic_plane.glb")),
  withAnimationFrame,
  shareReplay<File>(1)
)

const shark$ = from(fetch(`${BASE_URL}/models/shark.glb`))
.pipe(
  switchMap(response => response.arrayBuffer()),
  map(arrayBuffer => new File([arrayBuffer], "shark.glb")),
  withAnimationFrame,
  shareReplay<File>(1)
)

export function shortFileName (file: File) {
  return file.name.replace(/\.[^.]*$/, '')
}

export function observableFromName (fileName: string) {
  return assets[`${fileName}$`]
}

export const assets = {
  shark$,
  aerobatic_plane$
}

export const assetScaling = {
  aerobatic_plane: new BABYLON.Vector3(5, 5, 5),
  shark: new BABYLON.Vector3(.1, .1, .1),
}

export const assetY = {
  aerobatic_plane: 0,
  shark: 0,
}
