type VertexShader = WebGL2RenderingContext['VERTEX_SHADER']
type FragmentShader = WebGL2RenderingContext['FRAGMENT_SHADER']

const vertexShaderSource = `
  // an attribute will receive data from a buffer
  attribute vec4 a_position;

  // all shaders have a main function
  void main() {

    // gl_Position is a special constiable a vertex shader
    // is responsible for setting
    gl_Position = a_position;
  }
  `

const fragmentShaderSource = `
  // fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default
  precision mediump float;

  void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor = vec4(1, 0, 0.5, 1); // return reddish-purple
  }
  `
const positions = [0, 0, 0, 0.5, 0.7, 0]

function createShader(
  gl: WebGLRenderingContext,
  type: VertexShader | FragmentShader,
  source: string
) {
  const shader = gl.createShader(type)
  if (!shader) {
    console.error('Failed to create shader')
    return
  }
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }

  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram()
  if (!program) {
    console.error('Failed to create program')
    return
  }

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }
  console.log(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}

function useWebGL() {
  let program: WebGLProgram

  function setProgram(gl: WebGLRenderingContext) {
    let result: WebGLProgram | undefined = undefined
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    )
    if (!vertexShader || !fragmentShader) return
    result = createProgram(gl, vertexShader, fragmentShader)
    if (result) {
      return result
    }
    return
  }

  function onWebGLOverlayRedraw(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl', { antialias: false })
    if (!gl) {
      console.log('failed to load webgl context')
      return
    }
    if (!program) {
      const out = setProgram(gl)
      if (out) {
        program = out
      }
      return
    }

    const positionAttributeLocation = gl.getAttribLocation(
      program,
      'a_position'
    )
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation)

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 2 // 2 components per iteration
    const type = gl.FLOAT // the data is 32bit floats
    const normalize = false // don't normalize the data
    const stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0 // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    )

    // draw
    const primitiveType = gl.TRIANGLES
    // const offset = 0;
    const count = 3
    gl.drawArrays(primitiveType, offset, count)
  }

  return {
    onWebGLOverlayRedraw,
  }
}
export default useWebGL
