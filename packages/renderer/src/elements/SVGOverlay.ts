import OpenSeadragon from 'openseadragon'
import '../plugins/OpenSeadragonSVGOverlay'
import { SVGOverlayProps } from '../types'
// import { SVGOverlayProps } from '../types'
import Base from './Base'

declare module 'openseadragon' {
  interface SVGOverlay extends OpenSeadragon.Overlay {
    forceRedraw(): void
    reset(): void
    canvas(): HTMLCanvasElement
    onRedraw?: () => void
  }

  interface Viewer {
    svgOverlay: () => CanvasOverlay
    svgOverlayExists: () => boolean
  }
}

const defaultOptions: SVGOverlayProps = {}

class SVGOverlay extends Base {
  props: SVGOverlayProps

  _overlay: OpenSeadragon.SVGOverlay

  set overlay(o: OpenSeadragon.SVGOverlay) {
    this._overlay = o
  }

  get overlay(): OpenSeadragon.SVGOverlay {
    return this._overlay
  }

  set parent(p: Base | null) {
    this._parent = p
  }

  constructor(viewer: OpenSeadragon.Viewer, props: SVGOverlayProps) {
    super(viewer)
    this._overlay = this.viewer.canvasOverlay()
    this.props = { ...defaultOptions, ...props }
  }

  // commitUpdate(props: SVGOverlayProps): void {

  //   this.props = { ...defaultOptions, ...props }

  // }

  // private _setOnRedraw(): void {
  //   const {
  //     viewer,
  //     props: {},
  //   } = this
  //   const canvas = this.overlay.canvas()
  //   this.overlay.onRedraw = () => {
  //     onRedraw?.(canvas, viewer)
  //   }
  //   this.overlay.forceRedraw()
  // }
}
export default SVGOverlay
