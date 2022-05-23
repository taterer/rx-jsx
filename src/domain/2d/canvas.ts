export function draw (canvasContext, stroke, strokeStyle = '#000000') {
  if (stroke.begin) {
    canvasContext.beginPath()
    canvasContext.moveTo(stroke.x, stroke.y)
    canvasContext.strokeStyle = strokeStyle
    canvasContext.lineWidth = 2
    canvasContext.lineCap = 'round'
  }
  if (stroke.stroke) {
    canvasContext.lineTo(stroke.x, stroke.y)
    canvasContext.stroke()
  }
  if (stroke.close) {
    canvasContext.closePath()
  }
}
