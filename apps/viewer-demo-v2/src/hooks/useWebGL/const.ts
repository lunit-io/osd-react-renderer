const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
  `

const fragmentShaderSource = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(1, 0, 0.5, 1);
  }
  `

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
