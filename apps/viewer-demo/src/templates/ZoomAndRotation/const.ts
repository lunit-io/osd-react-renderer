export const SOURCE = `\
<OSDViewer>
  <viewport
    zoom={viewportZoom}
    refPoint={refPoint}
    rotation={rotation}
    onOpen={handleViewportOpen}
    onResize={handleViewportResize}
    onRotate={handleViewportRotate}
    onZoom={handleViewportZoom}
    maxZoomLevel={DEFAULT_CONTROLLER_MAX_ZOOM * scaleFactor}
    minZoomLevel={DEFAULT_CONTROLLER_MIN_ZOOM * scaleFactor}
  />
</OSDViewer>
`
export const FULL_SOURCE = `\
import React from 'react'
import { OSDViewer } from '@lunit/osd-react-renderer'

export default function TiledImage(): JSX.Element {
  return (
    <OSDViewer options={{ /* need to code.. */ }}>
      <viewport
        zoom={viewportZoom}
        refPoint={refPoint}
        rotation={rotation}
        onOpen={handleViewportOpen}
        onResize={handleViewportResize}
        onRotate={handleViewportRotate}
        onZoom={handleViewportZoom}
        maxZoomLevel={DEFAULT_CONTROLLER_MAX_ZOOM * scaleFactor}
        minZoomLevel={DEFAULT_CONTROLLER_MIN_ZOOM * scaleFactor}
      />
      <tiledImage url="https://image-pdl1.api.opt.scope.lunit.io/slides/images/dzi/41f49f4c-8dcd-4e85-9e7d-c3715f391d6f/3/122145f9-7f68-4f85-82f7-5b30364c2323/D_202103_Lunit_NSCLC_011_IHC_22C3.svs" />
    </OSDViewer>
  )
}
`