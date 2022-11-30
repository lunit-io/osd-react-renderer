import { source, vertexAttributeConfig } from './const'
import { initializeWebGL } from './func'
import { GLConfig } from './types'

const positions = [0, 0, 0, 0.5, 0.7, 0]

function useWebGL() {
  let glConfig: GLConfig | undefined

  function onWebGLOverlayRedraw(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl', { antialias: false })
    if (!gl) {
      console.log('failed to load webgl context')
      return
    }

    if (!glConfig) {
      glConfig = initializeWebGL(gl, source, positions)
    }
    if (!glConfig) return

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

    // draw
    const primitiveType = gl.TRIANGLES
    const offset = 0
    const count = 3
    gl.drawArrays(primitiveType, offset, count)
  }

  return {
    onWebGLOverlayRedraw,
  }
}
export default useWebGL
