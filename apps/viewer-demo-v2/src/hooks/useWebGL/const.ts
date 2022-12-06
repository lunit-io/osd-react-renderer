const vertexShaderSource = `
  attribute vec4 a_position;
  uniform vec2 u_resolution;

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

// const circleVertexShader = ``

const fragmentShaderSource = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(0.1, 0.1, 0.1, 1);
  }
  `

// const circleFragmentShader = ``

export const source = {
  vertex: vertexShaderSource,
  fragment: fragmentShaderSource,
}

export const vertexAttributeConfig = {
  size: 2, // 2 components per iteration
  normalize: false, // don't normalize the data
  stride: 0, // 0 = move forward size * sizeof(type) each iteration to get the next position
  offset: 0, // start at the beginning of the buffer
}

export const CHUNK_SIZE = 3000
