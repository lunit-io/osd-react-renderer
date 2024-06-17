/* eslint no-restricted-globals: 0 */

type Position = {
  x: number
  y: number
}

type Img = {
  width: number
  height: number
}

interface Resize {
  width: number
  height: number
}

interface OnRedraw {
  position: Position
  zoom: number
  img: Img
}

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  class MaskWorker {
    workerContext: Worker
    maskImage: ImageBitmap | null
    offscreenCanvas: OffscreenCanvas | null
    context: OffscreenCanvasRenderingContext2D | null

    constructor(workerContext: Worker) {
      this.workerContext = workerContext
      this.maskImage = null
      this.offscreenCanvas = null
      this.context = null
    }

    setOffscreenCanvas({ offscreen }: { offscreen: OffscreenCanvas }) {
      this.offscreenCanvas = offscreen
      this.context = offscreen.getContext('2d')
    }

    resize({ width, height }: Resize) {
      if (this.offscreenCanvas) {
        this.offscreenCanvas.width = width
        this.offscreenCanvas.height = height
      }
    }

    onRedraw({ position, zoom, img }: OnRedraw) {
      if (this.context && this.offscreenCanvas) {
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

  let handler = new MaskWorker(self as unknown as Worker)

  self.onmessage = e => {
    switch (e.data.action) {
      case 'offscreen':
        handler.setOffscreenCanvas(e.data)
        break
      case 'redraw':
        handler.onRedraw(e.data)
        break
      case 'resize':
        handler.resize(e.data)
        break
      default:
        return
    }
  }
}
