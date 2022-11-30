import { source, vertexAttributeConfig } from './const'
import { initializeWebGL } from './func'
import { GLConfig } from './types'

// const positions = [
//   20, 20,
//   20, 100,
//   150, 20,
//   400, 800,
//   90, 12,
//   123, 4543,
// ]

function makeRandomCoords(amt: number, hClip: number, wClip: number) {
  const out = []
  for (let i = 0; i < amt; i++) {
    out.push(Math.floor(Math.random() * wClip))
    out.push(Math.floor(Math.random() * hClip))
  }
  return out
}

function useWebGL() {
  let glConfig: GLConfig | undefined

  function onWebGLOverlayRedraw(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl', { antialias: false })
    if (!gl) {
      console.log('failed to load webgl context')
      return
    }

    const pos = makeRandomCoords(1000, gl.canvas.height, gl.canvas.width)

    glConfig = initializeWebGL(gl, source, pos)

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
    const count = pos.length
    gl.drawArrays(primitiveType, offset, count)
  }

  return {
    onWebGLOverlayRedraw,
  }
}
export default useWebGL
