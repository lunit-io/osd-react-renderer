import { SVGNameSpace } from 'packages/renderer/dist/types'
import { useEffect, useState } from 'react'
import data from '../../gridData'

const offset = {
  x: 0,
  y: 0,
  scale: 100000,
}

function useSVG() {
  const [visible, setVisible] = useState([true, true, true])
  const [allVisible, setAllVisible] = useState(true)

  const svgData = data.map(group => {
    console.log(group)
    return {
      id: group.id,
      color: group.color,
      size: {
        x: parseFloat(group.gridPixelSizeX.toPrecision(4)),
        y: parseFloat(group.gridPixelSizeY.toPrecision(4)),
      },
      children: group.gridResults.map(child => {
        return {
          x: child.minX,
          y: child.minY,
          w: child.width,
          h: child.height,
        }
      }),
    }
  })

  function initializeSVGSubElements(svgNameSpace: SVGNameSpace): SVGElement[] {
    return svgData.map(gridGroup => {
      const group = document.createElementNS(svgNameSpace, 'g')
      group.setAttribute('id', gridGroup.id)
      group.setAttribute('fill', gridGroup.color)
      group.setAttribute('opacity', '0.5')

      gridGroup.children.forEach(gridRect => {
        console.log(((gridGroup.size.x / offset.scale) * gridRect.w).toString())
        const rect = document.createElementNS(svgNameSpace, 'rect')
        rect.setAttribute(
          'x',
          (gridRect.x / offset.scale + offset.x).toString()
        )
        rect.setAttribute(
          'y',
          (gridRect.y / offset.scale + offset.y).toString()
        )
        rect.setAttribute(
          'width',
          ((gridGroup.size.x / offset.scale) * gridRect.w).toString()
        )
        rect.setAttribute(
          'height',
          ((gridGroup.size.y / offset.scale) * gridRect.h).toString()
        )
        group.appendChild(rect)
      })
      return group
    })
  }

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

  function updateSVGSubElements() {
    // shouldUpdateRef.current = true
  }
  function setSVGSubVisibility(index: number) {
    console.log('fired', index)
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
    initializeSVGSubElements,
    updateSVGSubElements,
  }
}
export default useSVG
