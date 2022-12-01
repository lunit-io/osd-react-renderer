import { CHUNK_SIZE, source, vertexAttributeConfig } from './const'
import { initializeWebGL } from './func'

function useWebGL(positions: number[]) {
  function* positionChunks(positions: number[], chunkSize: number) {
    for (let i = 0; (i + 1) * chunkSize < positions.length; i++) {
      yield positions.slice(i * chunkSize, (i + 1) * chunkSize)
    }
  }

  function drawWithWebGL(
    gl: WebGLRenderingContext,
    ctx: CanvasRenderingContext2D,
    positions: number[],
    w: number,
    h: number
  ) {
    const glConfig = initializeWebGL(gl, source, positions)

    if (!glConfig) {
      console.warn('failed to initialize webGL')
      return
    }
    performance.mark('webgl-start')
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(glConfig.program)

    // Turn on the attribute
    gl.enableVertexAttribArray(glConfig.positionAttributeLocation)

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, glConfig.positionBuffer)

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const type = gl.FLOAT // the data is 32bit floats
    gl.vertexAttribPointer(
      glConfig.positionAttributeLocation,
      vertexAttributeConfig.size,
      type,
      vertexAttributeConfig.normalize,
      vertexAttributeConfig.stride,
      vertexAttributeConfig.offset
    )

    gl.uniform2f(
      glConfig.resolutionUniformLocation,
      gl.canvas.width,
      gl.canvas.height
    )

    // draw
    const primitiveType = gl.POINTS
    const offset = 0
    const count = positions.length
    gl.drawArrays(primitiveType, offset, count)
    performance.mark('webgl-end')

    performance.mark('ctx-start')
    // move webGL rendered image to 2d canvas
    ctx.drawImage(gl.canvas, 0, 0, w, h)
    performance.mark('ctx-end')
    performance.measure('webgl', 'webgl-start', 'webgl-end')
    performance.getEntriesByName('webgl').forEach(entry => {
      if (entry.duration) {
        console.debug(entry.name, entry.duration)
      }
    })
    performance.measure('ctx', 'ctx-start', 'ctx-end')
    performance.getEntriesByName('ctx').forEach(entry => {
      if (entry.duration) {
        console.debug(entry.name, entry.duration)
      }
    })
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
    // performance.mark("webgl-start")
    ctx.clearRect(0, 0, normalCanvas.width, normalCanvas.height)
    for (const pos of positionChunks(positions, CHUNK_SIZE)) {
      drawWithWebGL(gl, ctx, pos, glCanvas.width, glCanvas.height)
    }
    // drawWithWebGL(gl, ctx, positions.slice(0, CHUNK_SIZE), glCanvas.width, glCanvas.height)
    // performance.mark("webgl-end")
    // performance.measure("webgl", 'webgl-start', 'webgl-end')
    // performance.getEntriesByName("webgl").forEach((entry) => {
    //   if (entry.duration) {
    //     console.debug(entry.name, entry.duration);
    //   }
    // });
    // performance.clearMeasures();
  }

  return {
    onWebGLOverlayRedraw,
  }
}
export default useWebGL
