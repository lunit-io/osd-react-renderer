import OpenSeadragon from 'openseadragon'

export const tiledImageSource = {
  url: 'https://io.api.scope.lunit.io/slides/dzi/metadata/?file=01d0f99c-b4fa-41c1-9059-4c2ee5d4cdf1%2F97e1f14b-d883-409a-83c6-afa97513c146%2FBladder_cancer_01.svs',
  tileUrlBase:
    'https://io.api.scope.lunit.io/slides/images/dzi/01d0f99c-b4fa-41c1-9059-4c2ee5d4cdf1%2F97e1f14b-d883-409a-83c6-afa97513c146%2FBladder_cancer_01.svs',
}

export const commonConfig = {
  zoom: {
    controllerMinZoom: 0.3125,
    controllerMaxZoom: 160,
  },
  mpp: 0.263175,
  micronsPerMeter: 1e6,
  radiusUM: 281.34,
  wheelButton: 1,
  rotation: 0,
}

export const viewerOptions: OpenSeadragon.Options = {
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
