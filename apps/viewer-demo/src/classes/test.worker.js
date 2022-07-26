/* eslint no-restricted-globals: 0 */
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  class MaskWorker {
    constructor(workerContext) {
      this.workerContext = workerContext
      this.maskImage = null
      this.offscreenCanvas = null
      this.context = null
      this.isPrepared = false
    }

    setOffscreenCanvas({ canvas }) {
      this.offscreenCanvas = canvas
      this.context = canvas.getContext('2d')
    }

    prepare({ result }) {
      if (this.context) {
        this.isPrepared = true
        this.context.fillStyle = 'rgba(0,0,255,0.2)'
        this.context.fillRect(0, 0, 5000, 5000)
        this.maskImage = this.offscreenCanvas.transferToImageBitmap()
      }
    }

    redraw({ position, zoom, imgWidth, imgHeight }) {
      if (this.context && this.isPrepared) {
        this.context.clearRect(
          0,
          0,
          this.offscreenCanvas.width,
          this.offscreenCanvas.height
        )
        this.context.translate(position.x, position.y)
        this.context.scale(zoom, zoom)
        this.context.drawImage(this.maskImage, 0, 0, imgWidth, imgHeight)
        this.context.setTransform(1, 0, 0, 1, 0, 0)
      }
    }
  }

  let handler = new MaskWorker(self)

  self.onmessage = e => {
    switch (e.data.action) {
      case 'canvas':
        handler.setOffscreenCanvas(e.data)
        break
      case 'prepare':
        handler.prepare(e.data)
        break
      case 'redraw':
        handler.redraw(e.data)
        break
      default:
        return
    }
  }
}
