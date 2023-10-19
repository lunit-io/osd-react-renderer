import OpenSeadragon from 'openseadragon'
import '../plugins/OpenSeadragonWebGLOverlay'
import { WebGLOverlayProps } from '../types'
import Base from './Base'

// This WebGLOverlay is only a canvas overlay, with a webgl context. Everything else is the same.

declare module 'openseadragon' {
  // The type signature of the Class
  interface WebGLOverlay extends OpenSeadragon.Overlay {
    forceRedraw(): void
    reset(): void
    canvas(): HTMLCanvasElement
    glCanvas(): HTMLCanvasElement
    contextGL(): WebGL2RenderingContext
    context2D(): CanvasRenderingContext2D
    onRedraw?: (x: number, y: number, zoom: number) => void
    addHandlers(): void
  }

  // The type Viewer has attached to it
  type webGLOverlay = (options?: {
    onRedraw?: (x: number, y: number, zoom: number) => void
    overlayID?: string
  }) => WebGLOverlay

  interface Viewer {
    newWebGLOverlay: (options?: {
      onRedraw?: (x: number, y: number, zoom: number) => void
      overlayID?: string
    }) => WebGLOverlay
    webGLOverlays: Record<string, WebGLOverlay>
    webGLOverlayExists: () => boolean
  }
}

const defaultOptions: WebGLOverlayProps = {
  onRedraw: (_, __) => {},
  overlayID: 'webgl-overlay',
}

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

    // Final 'webgl-overlay' exists to resolve ts string | undefined error
    const overlayID =
      props.overlayID || defaultOptions.overlayID || 'webgl-overlay'

    const newOverlay = this.viewer.newWebGLOverlay({
      onRedraw: (_, __) => {},
      overlayID,
    })
    if (typeof this.viewer.webGLOverlays === 'undefined') {
      this.viewer.webGLOverlays = {}
    }

    this.viewer.webGLOverlays[overlayID] = newOverlay
    this._overlay = newOverlay
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
    this.overlay.onRedraw = (x: number, y: number, zoom: number) => {
      onRedraw?.(glCanvas, canvas, viewer, { x, y, zoom })
    }
    this.overlay.forceRedraw()
  }
}
export default WebGLOverlay
