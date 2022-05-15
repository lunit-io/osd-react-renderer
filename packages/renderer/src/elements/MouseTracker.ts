import OpenSeadragon from 'openseadragon'
import { hasOwnProperty } from '../utils/object'
import { MouseTrackerProps, MouseTrackerEventHandlers } from '../types'
import Base from './Base'

type MouseTrackerEventOptions = {
  [key in MouseTrackerEventHandlers]?: OpenSeadragon.EventHandler<
    /* eslint-disable @typescript-eslint/no-explicit-any */
    OpenSeadragon.OSDEvent<any>
  >
}

class MouseTracker extends Base {
  eventHandlers: MouseTrackerEventOptions

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
    this.tracker?.destroy()
    this.tracker = MouseTracker.createTrackerInstance(
      this.viewer?.element,
      this.eventHandlers,
      props
    )
  }

  private static extractEventHandlers(props: MouseTrackerProps) {
    return Object.keys(props).reduce<MouseTrackerEventOptions>(
      (handlers, key) => {
        if (hasOwnProperty(MouseTrackerEventHandlers, key)) {
          handlers[MouseTrackerEventHandlers[key]] = props[key]
        }
        return handlers
      },
      {}
    )
  }

  private static createTrackerInstance(
    elem: string | Element,
    handler: MouseTrackerEventOptions,
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
      ...handler,
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
