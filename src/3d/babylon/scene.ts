import * as BABYLON from 'babylonjs';

export function createScene (canvas: HTMLCanvasElement): { engine: BABYLON.Engine, scene: BABYLON.Scene } {
  var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

  // CreateScene function that creates and return the scene
  // Create a basic BJS Scene object
  var scene = new BABYLON.Scene(engine);

  // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
  var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 11, -15), scene);

  // Target the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // Attach the camera to the canvas
  // camera.attachControl(canvas, false);

  // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
  var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

  // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
  // var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE);

  // Move the sphere upward 1/2 of its height
  // sphere.position.y = 1;
  
  // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
  var ground = BABYLON.Mesh.CreateGround('ground1', 8, 8, 2, scene, false);

  // Return the created scene
  return { engine, scene };
}
