export type VertexShader = WebGL2RenderingContext['VERTEX_SHADER']
export type FragmentShader = WebGL2RenderingContext['FRAGMENT_SHADER']

export interface GLConfig {
  program: WebGLProgram
  positionAttributeLocation: number
  resolutionUniformLocation: WebGLUniformLocation | null
  positionBuffer: WebGLBuffer | null
}
