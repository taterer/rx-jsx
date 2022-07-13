import * as BABYLON from 'babylonjs';
import { Vector3 } from 'babylonjs';
import {
  Observable,
} from "rxjs";

function flip (row, column) {
  return row % 2 === 1 ? column % 2 === 1 ? true : false : column % 2 === 1 ? false : true
}

function generateGridSquares (columnCount, rowCount, width = 1, height = 1) {
  const squares: { x: number, y: number, width: number, height: number, inverted: boolean }[] = []
  const widthOffset = (columnCount - 1) * width / 2
  const heightOffset = (rowCount - 1) * height / 2
  new Array(rowCount).fill(0).forEach((_, row) => {
    new Array(columnCount).fill(0).forEach((_, column) => {
      squares.push({
        width,
        height,
        x: column * width - widthOffset,
        y: row * height - heightOffset,
        inverted: flip(row, column)
      })
    })
  })
  return squares
}

export function addPlayingBoard () {
  const ground = BABYLON.MeshBuilder.CreateGround('ground1', { width: 8, height: 8 })
  ground.isVisible = false

  var blackMat = new BABYLON.StandardMaterial("PlaneMat");
  blackMat.diffuseColor = new BABYLON.Color3(0, 0, 0)

  const squares = generateGridSquares(4, 4, 2, 2)
  squares.forEach((square, index) => {
    const squareMesh = BABYLON.MeshBuilder.CreateGround(`square${index}`, { width: square.width, height: square.height })
    squareMesh.position = new Vector3(square.x, 0, square.y)
    if (square.inverted) {
      squareMesh.material = blackMat
    }
  })
}
