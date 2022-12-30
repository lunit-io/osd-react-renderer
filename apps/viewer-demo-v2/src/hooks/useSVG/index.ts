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

  return {
    svgData,
  }
}
export default useSVG
