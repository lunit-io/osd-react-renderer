/* eslint no-restricted-globals: 0 */
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  class MaskWorker {
    constructor(workerContext) {
      this.workerContext = workerContext
      this.maskImage = null
      this.offscreenCanvas = null
      this.context = null
    }

    setOffscreenCanvas({ offscreen }) {
      this.offscreenCanvas = offscreen
      this.context = offscreen.getContext('2d')
    }

    onRedraw({ position, zoom, img }) {
      if (this.context) {
        const ctx = this.context
        ctx.clearRect(
          0,
          0,
          this.offscreenCanvas.width,
          this.offscreenCanvas.height
        )
        ctx.fillStyle = 'rgba(0,0,255,0.2)'
        ctx.fillRect(0, 0, 5000, 5000)
        this.maskImage = this.offscreenCanvas.transferToImageBitmap()

        ctx.translate(position.x, position.y)
        ctx.scale(zoom, zoom)
        ctx.drawImage(this.maskImage, 0, 0, img.width, img.height)
        ctx.setTransform(1, 0, 0, 1, 0, 0)
      }
    }
  }

  let handler = new MaskWorker(self)

  self.onmessage = e => {
    switch (e.data.action) {
      case 'offscreen':
        handler.setOffscreenCanvas(e.data)
        break
      case 'redraw':
        handler.onRedraw(e.data)
        break
      default:
        return
    }
  }
}
