import OpenSeadragon from 'openseadragon'
import { hasOwnProperty } from '../utils/object'
import {
  MouseTrackerProps,
  MouseTrackerEventHandlerNames,
  MouseTrackerEventHandlers,
} from '../types'
import Base from './Base'

class MouseTracker extends Base {
  eventHandlers: MouseTrackerEventHandlers

  props: Partial<MouseTrackerProps>

  tracker: OpenSeadragon.MouseTracker

  constructor(viewer: OpenSeadragon.Viewer, props: MouseTrackerProps) {
    super(viewer)
    this.props = props
    this.eventHandlers = MouseTracker.extractEventHandlers(props)
    this.tracker = MouseTracker.createTrackerInstance(
      viewer?.element,
      this.eventHandlers,
      props
    )
  }

  commitUpdate(props: MouseTrackerProps): void {
    this.props = props
    this.eventHandlers = MouseTracker.extractEventHandlers(props)
    // tracker handler can be updated after calling the constructor.
    // TODO: update handler without destroying previous instance
    this.tracker?.destroy()
    this.tracker = MouseTracker.createTrackerInstance(
      this.viewer?.element,
      this.eventHandlers,
      props
    )
  }

  destroy(): void {
    this.tracker?.destroy()
  }

  private static extractEventHandlers(props: Partial<MouseTrackerProps>) {
    return Object.entries(props).reduce<MouseTrackerEventHandlers>(
      (handlers, [name, handler]) => {
        if (handler && hasOwnProperty(MouseTrackerEventHandlerNames, name)) {
          Object.defineProperty(handlers, name, handler)
        }
        return handlers
      },
      {}
    )
  }

  private static createTrackerInstance(
    elem: string | Element,
    handlers: MouseTrackerEventHandlers,
    props: MouseTrackerProps
  ) {
    const {
      startDisabled,
      clickTimeThreshold,
      clickDistThreshold,
      dblClickTimeThreshold,
      dblClickDistThreshold,
      stopDelay,
      userData,
    } = props
    return new OpenSeadragon.MouseTracker({
      element: elem,
      ...handlers,
      startDisabled,
      clickTimeThreshold,
      clickDistThreshold,
      dblClickTimeThreshold,
      dblClickDistThreshold,
      stopDelay,
      userData,
    })
  }
}

export default MouseTracker
