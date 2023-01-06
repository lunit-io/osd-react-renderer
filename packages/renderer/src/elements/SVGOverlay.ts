import OpenSeadragon from 'openseadragon'
import '../plugins/OpenSeadragonSVGOverlay'
import { SVGNameSpace, SVGOverlayProps } from '../types'
import Base from './Base'

declare module 'openseadragon' {
  interface SVGOverlay extends OpenSeadragon.Overlay {}

  interface Viewer {
    svgOverlay: (options?: {
      initializeSVGSubElements?: (svgNameSpace: SVGNameSpace) => SVGElement[]
    }) => SVGOverlay
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
    this._overlay = this.viewer.svgOverlay({
      initializeSVGSubElements: props.initializeSVGSubElements,
    })
    this.props = { ...defaultOptions, ...props }
  }
}
export default SVGOverlay
