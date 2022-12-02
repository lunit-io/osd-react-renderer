import { source, vertexAttributeConfig } from './const'
import { setProgram } from './func'

interface Tile {
  h: number
  w: number
  y: number
  x: number
  data: number[]
}

function useWebGL(tiles: Tile[]) {
  // function* positionChunks(positions: number[], chunkSize: number) {
  //   for (let i = 0; (i + 1) * chunkSize < positions.length; i++) {
  //     yield positions.slice(i * chunkSize, (i + 1) * chunkSize)
  //   }
  // }

  let program: WebGLProgram | undefined

  function drawWithWebGL(
    gl: WebGLRenderingContext,
    ctx: CanvasRenderingContext2D,
    positions: number[],
    w: number,
    h: number,
    x: number = 0,
    y: number = 0
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
    const positionBuffer = gl.createBuffer()
    const floatPos = new Float32Array(positions)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, floatPos, gl.DYNAMIC_DRAW)

    performance.mark('webgl-start')
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
    // performance.mark('webgl-end')

    // performance.mark('ctx-start')
    // move webGL rendered image to 2d canvas
    ctx.drawImage(gl.canvas, x, y, w, h)
    // performance.mark('ctx-end')
    // performance.measure('webgl', 'webgl-start', 'webgl-end')
    // performance.getEntriesByName('webgl').forEach(entry => {
    //   if (entry.duration) {
    //     console.debug(entry.name, entry.duration)
    //   }
    // })
    // performance.measure('ctx', 'ctx-start', 'ctx-end')
    // performance.getEntriesByName('ctx').forEach(entry => {
    // if (entry.duration) {
    //   console.debug(entry.name, entry.duration)
    // }
    // })
    performance.clearMeasures()
  }

  function onWebGLOverlayRedraw(
    glCanvas: HTMLCanvasElement,
    normalCanvas: HTMLCanvasElement
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
    // ctx.clearRect(0, 0, normalCanvas.width, normalCanvas.height)
    for (const tile of tiles) {
      drawWithWebGL(gl, ctx, tile.data, tile.w, tile.h, tile.x, tile.y)
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
