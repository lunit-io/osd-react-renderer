export const DEFAULT_CONTROLLER_MIN_ZOOM: number = 0.3125
export const DEFAULT_CONTROLLER_MAX_ZOOM: number = 160
export const DEMO_MPP = 0.263175
export const MICRONS_PER_METER = 1e6
export const RADIUS_UM = 281.34
export const VIEWER_OPTIONS = {
  imageLoaderLimit: 8,
  smoothTileEdgesMinZoom: Infinity,
  showNavigator: true,
  showNavigationControl: false,
  timeout: 60000,
  navigatorAutoResize: false,
  preserveImageSizeOnResize: true,
  showRotationControl: true,
  zoomPerScroll: 1.3,
  animationTime: 0.3,
  gestureSettingsMouse: {
    clickToZoom: false,
    dblClickToZoom: false,
  },
  gestureSettingsTouch: {
    flickEnabled: false,
    clickToZoom: false,
    dblClickToZoom: false,
  },
}
export const WHEEL_BUTTON = 1

export const tiledImageSource = {
  url: 'https://io.api.scope.lunit.io/slides/dzi/metadata/?file=01d0f99c-b4fa-41c1-9059-4c2ee5d4cdf1%2F97e1f14b-d883-409a-83c6-afa97513c146%2FBladder_cancer_01.svs',
  tileUrlBase:
    'https://io.api.scope.lunit.io/slides/images/dzi/01d0f99c-b4fa-41c1-9059-4c2ee5d4cdf1%2F97e1f14b-d883-409a-83c6-afa97513c146%2FBladder_cancer_01.svs',
}
