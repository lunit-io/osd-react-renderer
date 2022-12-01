import OpenSeadragon from 'openseadragon'
import '../plugins/OpenSeadragonWebGLOverlay'
import { WebGLOverlayProps } from '../types'
import Base from './Base'

// This WebGLOverlay is only a canvas overlay, with a webgl context. Everything else is the same.

declare module 'openseadragon' {
  interface WebGLOverlay extends OpenSeadragon.Overlay {
    forceRedraw(): void
    reset(): void
    canvas(): HTMLCanvasElement
    glCanvas(): HTMLCanvasElement
    contextGL(): WebGL2RenderingContext
    context2D(): CanvasRenderingContext2D
    onRedraw?: () => void
  }

  interface Viewer {
    webGLOverlay: (options?: { onRedraw?: () => void }) => WebGLOverlay
    webGLOverlayExists: () => boolean
  }
}

const defaultOptions: WebGLOverlayProps = { onRedraw: () => {} }

class WebGLOverlay extends Base {
  props: WebGLOverlayProps

  _overlay: OpenSeadragon.WebGLOverlay

  set overlay(o: OpenSeadragon.WebGLOverlay) {
    this._overlay = o
  }

  get overlay(): OpenSeadragon.WebGLOverlay {
    return this._overlay
  }

  set parent(p: Base | null) {
    this._parent = p
    this._setOnRedraw()
  }

  constructor(viewer: OpenSeadragon.Viewer, props: WebGLOverlayProps) {
    super(viewer)
    this._overlay = this.viewer.webGLOverlay({
      onRedraw: () => {},
    })
    this.props = { ...defaultOptions, ...props }
  }

  commitUpdate(props: WebGLOverlayProps): void {
    const oldRedraw = this.props.onRedraw
    this.props = { ...defaultOptions, ...props }
    if (oldRedraw !== props.onRedraw) {
      this._setOnRedraw()
    }
  }

  private _setOnRedraw(): void {
    const {
      viewer,
      props: { onRedraw },
    } = this
    const canvas = this.overlay.canvas()
    const glCanvas = this.overlay.glCanvas()
    this.overlay.onRedraw = () => {
      onRedraw?.(glCanvas, canvas, viewer)
    }
    this.overlay.forceRedraw()
  }
}
export default WebGLOverlay
