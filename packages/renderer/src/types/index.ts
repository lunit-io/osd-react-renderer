/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-explicit-any, no-shadow, import/no-unresolved */
import OpenSeadragon from 'openseadragon'
import OpenSeadragonV2 from 'openseadragonV2'
import React, { ReactNode } from 'react'

export const MouseTrackerEventHandlerNames = {
  onPreProcessEvent: 'preProcessEventHandler',
  onContextMenu: 'contextMenuHandler',
  onEnter: 'enterHandler',
  /**
   * @deprecated use onLeave instead
   */
  onExit: 'exitHandler',
  onLeave: 'leaveHandler',
  onOver: 'overHandler',
  onOut: 'outHandler',
  onPress: 'pressHandler',
  onNonPrimaryPress: 'nonPrimaryPressHandler',
  onRelease: 'releaseHandler',
  onNonPrimaryRelease: 'nonPrimaryReleaseHandler',
  onMove: 'moveHandler',
  onScroll: 'scrollHandler',
  onClick: 'clickHandler',
  onDblClick: 'dblClickHandler',
  onDrag: 'dragHandler',
  onDragEnd: 'dragEndHandler',
  onPinch: 'pinchHandler',
  onKeyDown: 'keyDownHandler',
  onKeyUp: 'keyUpHandler',
  onKey: 'keyHandler',
  onFocus: 'focusHandler',
  onBlur: 'blurHandler',
} as const

export type MouseTrackerEventHandlerNames = {
  -readonly [N in keyof typeof MouseTrackerEventHandlerNames]: typeof MouseTrackerEventHandlerNames[N]
}

export const ViewerEventHandlerNames = {
  onAddItemFailed: 'add-item-failed',
  onAddOverlay: 'add-overlay',
  onAnimation: 'animation',
  onAnimationFinish: 'animation-finish',
  onAnimationStart: 'animation-start',
  onCanvasClick: 'canvas-click',
  onCanvasContextMenu: 'canvas-contextmenu',
  onCanvasDoubleClick: 'canvas-double-click',
  onCanvasDrag: 'canvas-drag',
  onCanvasDragEnd: 'canvas-drag-end',
  onCanvasEnter: 'canvas-enter',
  onCanvasExit: 'canvas-exit',
  onCanvasKey: 'canvas-key',
  onCanvasNonprimaryPress: 'canvas-nonprimary-press',
  onCanvasNonprimaryRelease: 'canvas-nonprimary-release',
  onCanvasPinch: 'canvas-pinch',
  onCanvasPress: 'canvas-press',
  onCanvasRelease: 'canvas-release',
  onCanvasScroll: 'canvas-scroll',
  onClearOverlay: 'clear-overlay',
  onClose: 'close',
  onConstrain: 'constrain',
  onContainerEnter: 'container-enter',
  onContainerExit: 'container-exit',
  onControlsEnabled: 'controls-enabled',
  onFlip: 'flip',
  onFullPage: 'full-page',
  onFullScreen: 'full-screen',
  onHome: 'home',
  onMouseEnabled: 'mouse-enabled',
  onNavigatorClick: 'navigator-click',
  onNavigatorDrag: 'navigator-drag',
  onNavigatorScroll: 'navigator-scroll',
  onOpen: 'open',
  onOpenFailed: 'open-failed',
  onPage: 'page',
  onPan: 'pan',
  onPreFullPage: 'pre-full-page',
  onPreFullScreen: 'pre-full-screen',
  onRemoveOverlay: 'remove-overlay',
  onResetSize: 'reset-size',
  onResize: 'resize',
  onRotate: 'rotate',
  onTileDrawing: 'tile-drawing',
  onTileDrawn: 'tile-drawn',
  onTileLoadFailed: 'tile-load-failed',
  onTileLoaded: 'tile-loaded',
  onTileUnloaded: 'tile-unloaded',
  onUpdateLevel: 'update-level',
  onUpdateOverlay: 'update-overlay',
  onUpdateTile: 'update-tile',
  onUpdateViewport: 'update-viewport',
  onViewportChange: 'viewport-change',
  onVisible: 'visible',
  onZoom: 'zoom',
} as const

export type ViewerEventHandlerNames = {
  -readonly [N in keyof typeof ViewerEventHandlerNames]: typeof ViewerEventHandlerNames[N]
}

export type MouseTrackerEventHandlerMap = {
  /** @todo OpenSeadragon.MouseTrackerOptions의 *Handler 타입이 정상화되면 아래 주석으로 코드 대체 */
  // [N in keyof MouseTrackerEventHandlerNames]: NonNullable<OpenSeadragon.MouseTrackerOptions[MouseTrackerEventHandlerNames[N]]>
  [N in keyof MouseTrackerEventHandlerNames]: OpenSeadragon.EventHandler<
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [P in string]: any
    } & Parameters<
      NonNullable<
        OpenSeadragon.MouseTrackerOptions[MouseTrackerEventHandlerNames[N]]
      >
    >[0]
  >
}

export type ViewerEventHandlerMap = {
  [N in keyof ViewerEventHandlerNames]: OpenSeadragon.EventHandler<
    OpenSeadragon.ViewerEventMap[ViewerEventHandlerNames[N]]
  >
}

export interface MouseTrackerEventHandlers
  extends Partial<MouseTrackerEventHandlerMap>,
    NodeProps {}

export interface ViewportEventHandlers
  extends Partial<ViewerEventHandlerMap>,
    NodeProps {}

export interface BaseProps {
  [key: string]: any
}

interface NodeProps {
  ref?: React.Ref<React.ReactNode>
  key?: React.Key
}

export interface OSDViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode | undefined
  options?: OpenSeadragon.Options
}

export interface DZIMetaData {
  width: number
  height: number
  tileSize: number
  tileOverlap: number
  maxLevel: number
  minLevel: number
}

type ByteRange = string

export type TileMap = {
  [key: string]: ByteRange
}

export interface OSDViewerRef {
  container: HTMLDivElement
  viewer: OpenSeadragon.Viewer
}

export interface TiledImageProps extends NodeProps {
  url?: string
  tileUrlBase?: string
  tileSource?: OpenSeadragon.TileSource
  maxRetry?: number
  retryInterval?: number
}

export interface MouseTrackerProps extends MouseTrackerEventHandlers {
  element?:
    | ((viewer: OpenSeadragon.Viewer) => string | HTMLElement)
    | string
    | HTMLElement
  startDisabled?: boolean | undefined
  clickTimeThreshold?: number | undefined
  clickDistThreshold?: number | undefined
  dblClickTimeThreshold?: number | undefined
  dblClickDistThreshold?: number | undefined
  stopDelay?: number | undefined
  userData?: any | undefined
}

export interface ViewportProps extends ViewerProps {
  defaultZoomLevel?: number
  maxZoomLevel?: number
  minZoomLevel?: number
}

export interface ViewerProps extends ViewportEventHandlers {
  zoom: number
  rotation: number
  refPoint?: OpenSeadragon.Point
}

export enum ScalebarLocation {
  NONE,
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_RIGHT,
  BOTTOM_LEFT,
}

export interface ScalebarProps extends NodeProps {
  pixelsPerMeter: number
  xOffset?: number
  yOffset?: number
  barThickness?: number
  color?: string
  fontColor?: string
  backgroundColor?: string
  location?: ScalebarLocation
  stayInsideImage?: boolean
}

export interface CanvasOverlayProps extends NodeProps {
  onRedraw?: (
    overlayCanvasEl: HTMLCanvasElement,
    viewer: OpenSeadragon.Viewer | OpenSeadragonV2.Viewer
  ) => void
}
export interface OffscreenOverlayProps extends NodeProps {
  worker: Worker | undefined
}

export interface TooltipOverlayProps extends NodeProps {
  onRedraw?: (event: {
    overlayCanvasEl: HTMLCanvasElement
    viewer: OpenSeadragon.Viewer
    tooltipCoord?: OpenSeadragon.Point
    originalEvent?: MouseEvent
  }) => void
  redrawOnViewportChange?: boolean
}

export interface SVGOverlayProps extends NodeProps {}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      tiledImage: TiledImageProps
      mouseTracker: MouseTrackerProps
      viewport: ViewportProps
      scalebar: ScalebarProps
      canvasOverlay: CanvasOverlayProps
      offscreenOverlay: OffscreenOverlayProps
      tooltipOverlay: TooltipOverlayProps
    }
  }
}
