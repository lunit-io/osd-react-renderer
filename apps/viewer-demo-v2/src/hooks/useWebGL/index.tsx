import { source, vertexAttributeConfig } from './const'
import { makePolygonArray, setProgram } from './func'

interface Tile {
  h: number
  w: number
  y: number
  x: number
  data: number[]
}

interface Origin {
  x: number
  y: number
  zoom: number
}
// function clamp(min: number, val: number, max: number) {
//   if (val < min) return min
//   if (val > max) return max
//   return val
// }

function useWebGL(tiles: Tile[]) {
  let program: WebGLProgram | undefined

  function drawWithWebGL(
    gl: WebGLRenderingContext,
    ctx: CanvasRenderingContext2D,
    positions: number[],
    w: number,
    h: number,
    x: number,
    y: number,
    origin: Origin = { x: 0, y: 0, zoom: 1 }
  ) {
    if (!program) program = setProgram(gl, source)
    if (!program) {
      console.warn('failed to set webGL program')
      return
    }

    const positionAttributeLocation = gl.getAttribLocation(
      program,
      'a_position'
    )
    const resolutionUniformLocation = gl.getUniformLocation(
      program,
      'u_resolution'
    )

    const vertices = makePolygonArray(positions, 10 / origin.zoom)
    const positionBuffer = gl.createBuffer()
    const floatPos = new Float32Array(vertices)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, floatPos, gl.DYNAMIC_DRAW)

    gl.canvas.width = Math.floor(w * origin.zoom)
    gl.canvas.height = Math.floor(h * origin.zoom)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation)

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const type = gl.FLOAT // the data is 32bit floats
    gl.vertexAttribPointer(
      positionAttributeLocation,
      vertexAttributeConfig.size,
      type,
      vertexAttributeConfig.normalize,
      vertexAttributeConfig.stride,
      vertexAttributeConfig.offset
    )

    gl.uniform2f(resolutionUniformLocation, w, h)

    // draw
    const primitiveType = gl.POINTS
    const offset = 0
    const count = floatPos.length / 2
    gl.drawArrays(primitiveType, offset, count)

    // move webGL rendered image to 2d canvas
    ctx.drawImage(
      gl.canvas,
      origin.x + x * origin.zoom,
      origin.y + y * origin.zoom,
      w * origin.zoom,
      h * origin.zoom
    )
  }

  function onWebGLOverlayRedraw(
    glCanvas: HTMLCanvasElement,
    normalCanvas: HTMLCanvasElement,
    _: OpenSeadragon.Viewer,
    origin: { x: number; y: number; zoom: number }
  ) {
    const gl = glCanvas.getContext('webgl', { antialias: false })
    const ctx = normalCanvas.getContext('2d')
    if (!gl) {
      console.log('failed to load webgl context')
      return
    }
    if (!ctx) {
      console.log('failed to load 2d context')
      return
    }
    performance.mark('webgl-start')
    for (const tile of tiles) {
      drawWithWebGL(gl, ctx, tile.data, tile.w, tile.h, tile.x, tile.y, origin)
    }
    performance.mark('webgl-end')
    performance.measure('webgl', 'webgl-start', 'webgl-end')
    performance.getEntriesByName('webgl').forEach(entry => {
      if (entry.duration) {
        console.debug(entry.name, entry.duration)
      }
    })
    performance.clearMeasures()
  }

  return {
    onWebGLOverlayRedraw,
  }
}
export default useWebGL
