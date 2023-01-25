import { useEffect, useRef, useState } from 'react'
import { SVG_NAMESPACE, SVG_ROOT_ID } from '@lunit/osd-react-renderer'
import data from '../../gridData'

const offset = {
  x: 0,
  y: 0,
  scale: 100000,
}

function useSVG() {
  const [visible, setVisible] = useState([true, true, true])
  const [allVisible, setAllVisible] = useState(true)
  const svgWasInitializedRef = useRef(false)

  const svgData = data.map(group => {
    const size = {
      x: Math.ceil(group.gridPixelSizeX),
      y: Math.ceil(group.gridPixelSizeY),
    }
    return {
      id: group.id,
      color: group.color,
      size,
      children: group.gridResults.map(child => {
        return {
          x: child.minX / size.x,
          y: child.minY / size.y,
          w: child.width,
          h: child.height,
        }
      }),
    }
  })

  // function initializeSVGSubElements(svgNameSpace: SVGNameSpace): SVGElement[] {
  //   return
  // }

  useEffect(() => {
    if (!!svgData && !svgWasInitializedRef.current) {
      svgData.forEach(gridGroup => {
        const group = document.createElementNS(SVG_NAMESPACE, 'g')
        group.setAttribute('id', gridGroup.id)
        group.setAttribute('fill', gridGroup.color)
        group.setAttribute('opacity', '0.5')

        gridGroup.children.forEach(childRect => {
          const rect = document.createElementNS(SVG_NAMESPACE, 'rect')

          rect.setAttribute(
            'x',
            (
              (childRect.x * gridGroup.size.x) / offset.scale +
              offset.x
            ).toString()
          )
          rect.setAttribute(
            'y',
            (
              (childRect.y * gridGroup.size.y) / offset.scale +
              offset.y
            ).toString()
          )
          rect.setAttribute(
            'width',
            ((childRect.w * gridGroup.size.x) / offset.scale).toString()
          )
          rect.setAttribute(
            'height',
            ((childRect.h * gridGroup.size.y) / offset.scale).toString()
          )
          group.appendChild(rect)
        })
        const svgRoot = document.getElementById(SVG_ROOT_ID)
        if (svgRoot) {
          svgRoot.appendChild(group)
        }
      })
      svgWasInitializedRef.current = true
    }
  }, [svgData])

  // Hide svg sub-elements handler
  useEffect(() => {
    svgData.forEach((g, index) => {
      if (!allVisible) {
        document.getElementById(g.id)?.setAttribute('opacity', '0')
        return
      }
      if (visible[index]) {
        document.getElementById(g.id)?.setAttribute('opacity', '0.5')
      } else {
        document.getElementById(g.id)?.setAttribute('opacity', '0')
      }
    })
  }, [allVisible, visible, svgData])

  function updateSVGSubElements() {}
  function setSVGSubVisibility(index: number) {
    setVisible(
      visible.map((v, i) => {
        if (i === index) {
          return !v
        }
        return v
      })
    )
  }

  function setSVGAllVisible() {
    setAllVisible(!allVisible)
  }

  return {
    svgData,
    setSVGAllVisible,
    setSVGSubVisibility,
    updateSVGSubElements,
  }
}
export default useSVG
