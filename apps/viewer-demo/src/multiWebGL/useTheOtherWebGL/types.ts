export type VertexShader = WebGL2RenderingContext['VERTEX_SHADER']
export type FragmentShader = WebGL2RenderingContext['FRAGMENT_SHADER']

export interface GLConfig {
  program: WebGLProgram
  positionAttributeLocation: number
  resolutionUniformLocation: WebGLUniformLocation | null
  positionBuffer: WebGLBuffer | null
}

export interface WebGLTileData {
  h: number
  w: number
  y: number
  x: number
  data: number[]
  color: RGBAColorVector
}

export interface Origin {
  x: number
  y: number
  zoom: number
}

export interface RGBAColorVector {
  r: number
  g: number
  b: number
  a: number
}
