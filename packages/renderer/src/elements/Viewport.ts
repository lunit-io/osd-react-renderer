import OpenSeadragon from 'openseadragon'
import Base from './Base'
import {
  ViewerEventHandlerNames,
  ViewportEventHandlers,
  ViewportProps,
} from '../types'
import { hasOwnProperty } from '../utils/object'

const DEFAULT_MIN_ZOOM = 0.3125
const DEFAULT_MAX_ZOOM = 160

declare module 'openseadragon' {
  interface Viewport {
    maxZoomLevel: number
    minZoomLevel: number
  }
}

const defaultViewportOptions: Partial<ViewportProps> = {
  maxZoomLevel: DEFAULT_MAX_ZOOM,
  minZoomLevel: DEFAULT_MIN_ZOOM,
}

class Viewport extends Base {
  eventHandlers: ViewportEventHandlers

  options: Partial<ViewportProps> = defaultViewportOptions

  constructor(viewer: OpenSeadragon.Viewer, props: ViewportProps) {
    super(viewer)

    this.options = { ...defaultViewportOptions, ...props }
    this.eventHandlers = Viewport.extractEventHandlers(props)
    this.viewer.viewport.zoomTo(props.zoom, props.refPoint)
    this.viewer.viewport.setRotation(props.rotation)
    this.viewer.viewport.maxZoomLevel = props.maxZoomLevel || DEFAULT_MAX_ZOOM
    this.viewer.viewport.minZoomLevel = props.minZoomLevel || DEFAULT_MIN_ZOOM
  }

  commitUpdate(props: ViewportProps): void {
    this.updateEventHandler('remove')
    // if (this.options.zoom !== props.zoom) {
    this.viewer.viewport.zoomTo(props.zoom, props.refPoint)
    // }
    if (this.options.rotation !== props.rotation) {
      this.viewer.viewport.setRotation(props.rotation)
    }
    this.options = { ...defaultViewportOptions, ...props }
    this.eventHandlers = Viewport.extractEventHandlers(props)
    this.updateEventHandler('add')
  }

  private static extractEventHandlers(props: Partial<ViewportProps>) {
    return Object.entries(props).reduce<ViewportEventHandlers>(
      (handlers, [name, handler]) => {
        if (handler && hasOwnProperty(ViewerEventHandlerNames, name)) {
          Object.defineProperty(handlers, name, {
            value: handler,
            enumerable: true,
          })
        }
        return handlers
      },
      {} as ViewportEventHandlers
    )
  }

  private updateEventHandler(update: 'add' | 'remove') {
    const parent = this._parent
    if (!parent) {
      return
    }
    const checkEventHandler = update === 'add' ? 'addHandler' : 'removeHandler'
    Object.entries(this.eventHandlers).forEach(([name, handler]) => {
      if (handler && hasOwnProperty(ViewerEventHandlerNames, name)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        parent.viewer[checkEventHandler](ViewerEventHandlerNames[name], handler)
      }
    })
  }

  set parent(p: Base | null) {
    this._parent = p
    this.updateEventHandler(p ? 'add' : 'remove')
  }
}

export default Viewport
