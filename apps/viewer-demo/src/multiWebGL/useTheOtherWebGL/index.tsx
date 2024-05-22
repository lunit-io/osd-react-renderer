import { circleSource, vertexAttributeConfig } from './const'
import { hexToRgbVector, makeColouredTiles, setProgram } from './func'
import { Origin, WebGLTileData } from './types'

function useTheOtherWebGL() {
  let program: WebGLProgram | undefined
  let positionAttrLocation: number
  let resolutionUniformLocation: WebGLUniformLocation | null
  let colorUniformLocation: WebGLUniformLocation | null

  function drawWithWebGL(
    gl: WebGL2RenderingContext,
    ctx: CanvasRenderingContext2D,
    tile: WebGLTileData,
    origin: Origin = { x: 0, y: 0, zoom: 1 }
  ) {
    if (!program) program = setProgram(gl, circleSource)
    if (!program) {
      console.warn('failed to set webGL program')
      return
    }

    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)

    // initialize memory locations
    if (!positionAttrLocation)
      positionAttrLocation = gl.getAttribLocation(program, 'a_position')
    if (!resolutionUniformLocation)
      resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')
    if (!colorUniformLocation)
      colorUniformLocation = gl.getUniformLocation(program, 'u_color')

    // place vertices into webgl memory
    const positionBuffer = gl.createBuffer()
    const floatPos = new Float32Array(tile.data)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, floatPos, gl.STATIC_DRAW)

    // set up canvas before drawing
    gl.canvas.width = Math.floor(tile.w * origin.zoom)
    gl.canvas.height = Math.floor(tile.h * origin.zoom)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // activate program
    gl.useProgram(program)

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttrLocation)

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    gl.vertexAttribPointer(
      positionAttrLocation,
      vertexAttributeConfig.size,
      gl.FLOAT,
      vertexAttributeConfig.normalize,
      vertexAttributeConfig.stride,
      vertexAttributeConfig.offset
    )

    gl.uniform2f(resolutionUniformLocation, tile.w, tile.h)
    gl.uniform4f(
      colorUniformLocation,
      tile.color.r,
      tile.color.g,
      tile.color.b,
      tile.color.a
    )

    // draw
    gl.drawArrays(
      gl.POINTS, // what shape
      0, // starting from where in the buffer
      floatPos.length / 2 // how many shapes
    )

    // move webGL rendered image to 2d canvas
    ctx.drawImage(
      gl.canvas,
      origin.x + tile.x * origin.zoom,
      origin.y + tile.y * origin.zoom,
      tile.w * origin.zoom,
      tile.h * origin.zoom
    )
  }

  // function onWebGLOverlayRedraw(
  //   glCanvas: HTMLCanvasElement,
  //   normalCanvas: HTMLCanvasElement
  // ) {
  //   const origin = { x: 0, y: 0, zoom: 1 }
  //   const gl = glCanvas.getContext('webgl2', {
  //     antialias: true,
  //     premultipliedAlpha: false,
  //   })
  //   const ctx = normalCanvas.getContext('2d')
  //   if (!gl) {
  //     console.log('failed to load webgl context')
  //     return
  //   }
  //   if (!ctx) {
  //     console.log('failed to load 2d context')
  //     return
  //   }
  //   performance.mark('webgl-start')
  //   gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  //   const greenTiles = makeColouredTiles(300_000, 1000, 1400)[0]

  //   drawWithWebGL(
  //     gl,
  //     ctx,
  //     { ...greenTiles, color: hexToRgbVector(greenTiles.color) },
  //     origin
  //   )
  //   performance.mark('webgl-end')
  //   performance.measure('webgl-one', 'webgl-start', 'webgl-end')
  //   performance.getEntriesByName('webgl-one').forEach(entry => {
  //     if (entry.duration) {
  //       console.debug(entry.name, entry.duration)
  //     }
  //   })
  //   performance.clearMeasures()
  // }
  function onWebGLOverlayOverlayRedraw(
    glCanvas: HTMLCanvasElement,
    normalCanvas: HTMLCanvasElement
  ) {
    const origin = { x: 0, y: 0, zoom: 1 }
    const gl = glCanvas.getContext('webgl2', {
      antialias: true,
      premultipliedAlpha: false,
    })
    const ctx = normalCanvas.getContext('2d')
    if (!gl) {
      console.log('failed to load webgl context')
      return
    }
    if (!ctx) {
      console.log('failed to load 2d context')
      return
    }
    performance.mark('webgl-start')
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    const redTiles = makeColouredTiles(300_000, 1000, 1400)[1]

    drawWithWebGL(
      gl,
      ctx,
      { ...redTiles, color: hexToRgbVector(redTiles.color) },
      origin
    )
    performance.mark('webgl-end')
    performance.measure('webgl-two', 'webgl-start', 'webgl-end')
    performance.getEntriesByName('webgl-two').forEach(entry => {
      if (entry.duration) {
        console.debug(entry.name, entry.duration)
      }
    })
    performance.clearMeasures()
  }

  return {
    onWebGLOverlayOverlayRedraw,
  }
}
export default useTheOtherWebGL
