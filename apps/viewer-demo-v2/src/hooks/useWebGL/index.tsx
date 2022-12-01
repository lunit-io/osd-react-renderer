import { source, vertexAttributeConfig } from './const'
import { initializeWebGL } from './func'
import { GLConfig } from './types'

function useWebGL(positions: number[]) {
  let glConfig: GLConfig | undefined

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

    glConfig = initializeWebGL(gl, source, positions)

    if (!glConfig) {
      console.warn('failed to initialize webGL')
      return
    }

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

    // move webGL rendered image to 2d canvas
    ctx.drawImage(gl.canvas, 0, 0, glCanvas.width, glCanvas.height)
  }

  return {
    onWebGLOverlayRedraw,
  }
}
export default useWebGL
