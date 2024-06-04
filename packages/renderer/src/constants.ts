import { SVGNameSpace } from './types'

export const SVG_NAMESPACE: SVGNameSpace = 'http://www.w3.org/2000/svg'
export const SVG_ROOT_ID = 'osd-svg-root'

export const OSDR_DEFAULT_OPTIONS: OpenSeadragon.Options = {
  imageLoaderLimit: 8,
  smoothTileEdgesMinZoom: Infinity,
  showNavigator: true,
  timeout: 60000,
  rotationIncrement: 0,
  navigatorAutoResize: false,
  preserveImageSizeOnResize: true,
  zoomPerScroll: 1.2,
  showZoomControl: false,
  showHomeControl: false,
  showFullPageControl: false,
  showRotationControl: false,
  animationTime: 0.3,
  constrainDuringPan: true,
  visibilityRatio: 0.8,
  loadTilesWithAjax: true, // for Glob tiling
  showNavigationControl: false,
  gestureSettingsMouse: {
    clickToZoom: false,
    dblClickToZoom: true,
  },
  gestureSettingsTouch: {
    flickEnabled: false,
    clickToZoom: false,
    dblClickToZoom: true,
  },
  overlays: [
    {
      px: 0,
      py: 0,
      class: 'drawing',
    },
  ],
}
