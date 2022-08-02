import OpenSeadragon from 'openseadragon'
import '../plugins/OpenSeadragonOffscreenOverlay'
import { OffscreenOverlayProps } from '../types'
import Base from './Base'

declare module 'openseadragon' {
  interface OffscreenOverlay extends OpenSeadragon.Overlay {
    forceRedraw(): void
    context2d(): void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    offscreen(): any
    worker?: Worker
  }

  interface OffscreenOverlayOptions {
    worker?: Worker
  }

  interface Viewer {
    offscreenOverlay: (options?: OffscreenOverlayOptions) => OffscreenOverlay
    offscreenOverlayExists: () => boolean
  }
}

const defaultOptions: OffscreenOverlayProps = {
  worker: undefined,
}

class OffscreenOverlay extends Base {
  props: OffscreenOverlayProps

  _overlay: OpenSeadragon.OffscreenOverlay

  set overlay(o: OpenSeadragon.OffscreenOverlay) {
    this._overlay = o
  }

  get overlay(): OpenSeadragon.OffscreenOverlay {
    return this._overlay
  }

  set parent(p: Base | null) {
    this._parent = p
    this._setWorker()
  }

  constructor(viewer: OpenSeadragon.Viewer, props: OffscreenOverlayProps) {
    super(viewer)
    this._overlay = this.viewer.offscreenOverlay({
      worker: undefined,
    })
    this.props = { ...defaultOptions, ...props }
  }

  commitUpdate(props: OffscreenOverlayProps): void {
    const oldWorker = this.props.worker
    this.props = { ...defaultOptions, ...props }
    if (oldWorker !== props.worker) {
      this._setWorker()
    }
  }

  private _setWorker(): void {
    const {
      props: { worker },
    } = this
    this.overlay.worker = worker
    if (this.overlay.worker) {
      const offscreen = this.overlay.offscreen()
      offscreen.height = this.viewer.container.clientHeight
      offscreen.width = this.viewer.container.clientWidth
      this.overlay.worker.postMessage(
        {
          action: 'offscreen',
          offscreen,
        },
        [offscreen]
      )
      this.overlay.forceRedraw()
    }
  }
}

export default OffscreenOverlay
