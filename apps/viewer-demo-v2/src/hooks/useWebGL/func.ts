import { FragmentShader, VertexShader } from './types'

export function createShader(
  gl: WebGL2RenderingContext,
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
  } else {
    console.groupCollapsed(
      type === 35633 ? 'Vertex Shader Error' : 'Fragment Shader Error'
    )
    console.warn('Failed to compile')
    console.warn(source)
    console.groupEnd()
    gl.deleteShader(shader)
  }
}

export function createProgram(
  gl: WebGL2RenderingContext,
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
  gl.deleteProgram(program)
}

export function setProgram(
  gl: WebGL2RenderingContext,
  source: { vertex: string; fragment: string }
) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, source.vertex)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, source.fragment)
  if (!vertexShader || !fragmentShader) return
  return createProgram(gl, vertexShader, fragmentShader)
}

export function initializeWebGL(
  gl: WebGL2RenderingContext,
  source: { vertex: string; fragment: string },
  vertexData: number[]
) {
  const program = setProgram(gl, source)

  if (!program) {
    console.warn('failed to build program')
    return
  }

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    'u_resolution'
  )
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.DYNAMIC_DRAW)

  return {
    program,
    positionAttributeLocation,
    resolutionUniformLocation,
    positionBuffer,
  }
}

export function coordsToPolygons(
  x: number,
  y: number,
  polySize: number
): number[] {
  return [
    x - polySize / 2,
    y - polySize / 2, // (0,0)
    x - polySize / 2,
    y + polySize / 2, // (0,1)
    x + polySize / 2,
    y - polySize / 2, // (1,0)

    x - polySize / 2,
    y + polySize / 2, // (0,1)
    x + polySize / 2,
    y - polySize / 2, // (1,0)
    x + polySize / 2,
    y + polySize / 2, // (1,1)
  ]
}

export function makePolygonArray(coords: number[], polySize: number): number[] {
  const vertices: number[] = []
  // const elements: number[] = []
  for (let i = 0; i < coords.length; i += 2) {
    coordsToPolygons(coords[i], coords[i + 1], polySize).forEach(poly => {
      vertices.push(poly)
    })
  }
  return vertices
}

export function generateTexCoords(length: number) {
  const out: number[] = []
  for (let i = 0; i < length / 12; i++) {
    out.push(
      0,
      0,
      1,
      0,
      0,
      1,

      0,
      1,
      1,
      1,
      1,
      0
    )
  }
  return out
}
