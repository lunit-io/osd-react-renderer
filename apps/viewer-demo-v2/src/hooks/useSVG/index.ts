import { SVGNS } from 'packages/renderer/dist/types'
import data from '../../gridData'

function useSVG() {
  const svgData = data.map(group => {
    return {
      id: group.id,
      color: group.color,
      size: {
        x: group.gridPixelSizeX,
        y: group.gridPixelSizeY,
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

  function initializeSVGSubElements(svgNameSpace: SVGNS): SVGElement[] {
    return svgData.map(gridGroup => {
      const group = document.createElementNS(svgNameSpace, 'g')
      group.setAttribute('fill', gridGroup.color)
      group.setAttribute('opacity', '0.5')

      gridGroup.children.forEach(gridRect => {
        const rect = document.createElementNS(svgNameSpace, 'rect')
        rect.setAttribute('x', (gridRect.x / 100).toString())
        rect.setAttribute('y', (gridRect.y / 100).toString())
        rect.setAttribute('width', '38')
        rect.setAttribute('height', '38')
        group.appendChild(rect)
      })
      return group
    })
  }

  return {
    svgData,
    initializeSVGSubElements,
  }
}
export default useSVG
