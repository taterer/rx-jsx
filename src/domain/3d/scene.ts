import * as BABYLON from 'babylonjs';
import { EMPTY, Observable, Subject, takeUntil } from 'rxjs';
import { viewport$ } from '../viewport/query';

export const [scene$, mountScene] = sceneFactory(EMPTY)

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

function createScene (canvas: HTMLCanvasElement): { engine: BABYLON.Engine, scene: BABYLON.Scene } {
  var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

  // CreateScene function that creates and return the scene
  // Create a basic BJS Scene object
  var scene = new BABYLON.Scene(engine);

  // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
  var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 12, -12), scene);

  // Target the camera to scene origin
  camera.setTarget(new BABYLON.Vector3(0, 0, -2));

  // Attach the camera to the canvas
  // camera.attachControl(canvas, false);

  // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
  var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

  // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
  // var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE);

  // Move the sphere upward 1/2 of its height
  // sphere.position.y = 1;
  
  // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
  // var ground = BABYLON.Mesh.CreateGround('ground1', 8, 8, 2, scene, false);
  BABYLON.MeshBuilder.CreateGround('ground1', { width: 8, height: 12, subdivisions: 2 })

  // Return the created scene
  return { engine, scene };
}
