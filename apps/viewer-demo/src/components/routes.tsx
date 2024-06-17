import Home, { HomeDescription } from '../pages/Home/Home'
import MouseTrackerTest, {
  MouseTrackerDescription,
} from '../pages/MouseTrackerTest/MouseTrackerTest'
import OffscreenCanvasTest, {
  OffscreenCanvasDescription,
} from '../pages/OffscreenCanvasTest/OffscreenCanvasTest'
import SVGOverlayTest, {
  SVGOverlayDescription,
} from '../pages/SVGOverlayTest/SVGOverlayTest'
import ScaleZoom, { ScaleDescription } from '../pages/ScaleZoom/ScaleZoom'
import TooltipOverlayTest, {
  TooltipDescription,
} from '../pages/TooltipOverlayTest/TooltipOverlayTest'
import WebGLOverlayTest, {
  WebGLOverlayDescription,
} from '../pages/WebGLOverlayTest/WebGLOverlayTest'

enum DemoUrls {
  HOME = '/',
  SCALEZOOM = '/scale-zoom',
  MOUSETRACKER = '/mouse-tracker',
  TOOLTIP = '/tooltip-overlay',
  WEBGL = '/webgl-overlay',
  OFFSCREEN = '/offscreen',
  SVG = '/svg-overlay',
}

export const navLinks = [
  { path: DemoUrls.HOME, label: 'HOME' },
  { path: DemoUrls.SCALEZOOM, label: 'SCALEBAR/ZOOM CTRLS' },
  { path: DemoUrls.MOUSETRACKER, label: 'MOUSE TRACKER' },
  { path: DemoUrls.TOOLTIP, label: 'TOOLTIP OVERLAY' },
  { path: DemoUrls.WEBGL, label: 'WEBGL OVERLAY' },
  { path: DemoUrls.OFFSCREEN, label: 'OFFSCREEN OVERLAY' },
  { path: DemoUrls.SVG, label: 'SVG OVERLAY' },
]

export const viewerDemos: Array<{ path: DemoUrls; element: React.ReactNode }> =
  [
    {
      path: DemoUrls.HOME,
      element: <Home />,
    },
    {
      path: DemoUrls.TOOLTIP,
      element: <TooltipOverlayTest />,
    },
    {
      path: DemoUrls.SCALEZOOM,
      element: <ScaleZoom />,
    },
    {
      path: DemoUrls.MOUSETRACKER,
      element: <MouseTrackerTest />,
    },
    {
      path: DemoUrls.OFFSCREEN,
      element: <OffscreenCanvasTest />,
    },
    {
      path: DemoUrls.WEBGL,
      element: <WebGLOverlayTest />,
    },
    {
      path: DemoUrls.SVG,
      element: <SVGOverlayTest />,
    },
  ]

export const descriptions: Array<{ path: DemoUrls; element: React.ReactNode }> =
  [
    {
      path: DemoUrls.HOME,
      element: <HomeDescription />,
    },
    {
      path: DemoUrls.SCALEZOOM,
      element: <ScaleDescription />,
    },
    {
      path: DemoUrls.MOUSETRACKER,
      element: <MouseTrackerDescription />,
    },
    {
      path: DemoUrls.TOOLTIP,
      element: <TooltipDescription />,
    },
    {
      path: DemoUrls.WEBGL,
      element: <WebGLOverlayDescription />,
    },
    {
      path: DemoUrls.OFFSCREEN,
      element: <OffscreenCanvasDescription />,
    },
    {
      path: DemoUrls.SVG,
      element: <SVGOverlayDescription />,
    },
  ]
