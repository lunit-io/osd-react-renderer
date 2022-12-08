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

export function hexToRgbVector(hexColor: string) {
  let hex = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return { r: r / 255, g: g / 255, b: b / 255, a: 1.0 }
}

export function makeRandomCoords(amt: number, hClip: number, wClip: number) {
  const out = []
  for (let i = 0; i < amt; i++) {
    out.push(Math.floor(Math.random() * wClip))
    out.push(Math.floor(Math.random() * hClip))
  }
  return out
}

export function makeColouredTiles(
  coordCount: number,
  hSize: number,
  wSize: number
) {
  return [
    {
      h: hSize,
      w: wSize,
      y: 0,
      x: 0,
      color: '#00BD9D',
      data: makeRandomCoords((coordCount / 10) * 7, hSize, wSize),
    },
    {
      h: hSize,
      w: wSize,
      y: 0,
      x: 0,
      color: '#FF495C',
      data: makeRandomCoords((coordCount / 10) * 3, hSize, wSize),
    },
  ]
}
