import React from 'react'
import OSDViewer from '../../components/OSDViewer'
import Code from '../../components/Code'
import Description from '../../components/Description'
import Section from '../../components/Section'
import { FULL_SOURCE, SOURCE } from './const'
import { CODE_SANDBOX } from '../const'

const VIEWER_OPTIONS = {
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

export default function CreatingTiles(): JSX.Element {
  return (
    <Section>
      <Description>
        <OSDViewer options={VIEWER_OPTIONS}>
          <tiledImage url="https://api.pdl1.demo.scope.lunit.io/slides/images/dzi/c76175c1-dd83-4e94-8d54-978903c753ec/16/76a4a313-3865-4232-ba26-449a664204f4/Lung_cancer_14-TPS_50-100.svs" />
        </OSDViewer>
      </Description>
      <Code
        source={SOURCE}
        fullSource={FULL_SOURCE}
        codesandboxUrl={CODE_SANDBOX.creatingTiles}
      />
    </Section>
  )
}
