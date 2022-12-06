const vertexShaderSource = `
  attribute vec4 a_position;
  uniform vec2 u_resolution;

  varying vec2 v_texcoord;

  void main() {
    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position.xy / u_resolution;
 
    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;
 
    // convert from 0->2 to -1->+1 (clip space)
    vec2 clipSpace = zeroToTwo - 1.0;
 
    gl_Position = vec4(clipSpace, 0, 1);

  }
  `

const circleVertexShader = `#version 300 es
  in vec2 a_position;
uniform vec2 u_resolution;

  void main() {
    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position.xy / u_resolution;
 
    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;
 
    // convert from 0->2 to -1->+1 (clip space)
    vec2 clipSpace = zeroToTwo - 1.0;
 
    gl_PointSize = 12.0;
    gl_Position = vec4(clipSpace, 0, 1);
  }
  `

const fragmentShaderSource = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(0.1, 0.1, 0.1, 1);
  }
  `
const circleFragmentShader = `#version 300 es
 precision mediump float;
 out vec4 pixColor;
  
 void main()
 {

  float r = 0.0, delta = 0.0, alpha = 1.0;
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;
  r = dot(cxy, cxy);
  delta = fwidth(r);
  alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);
     pixColor = vec4(0.1, 0.6, 0.6, alpha);

 }`

export const source = {
  vertex: vertexShaderSource,
  fragment: fragmentShaderSource,
}

export const circleSource = {
  vertex: circleVertexShader,
  fragment: circleFragmentShader,
}

export const vertexAttributeConfig = {
  size: 2, // 2 components per iteration
  normalize: false, // don't normalize the data
  stride: 0, // 0 = move forward size * sizeof(type) each iteration to get the next position
  offset: 0, // start at the beginning of the buffer
}

export const CHUNK_SIZE = 3000
