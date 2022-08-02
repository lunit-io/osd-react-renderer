/* eslint-disable */
import OpenSeadragon from 'openseadragon'

// OpenSeadragon canvas Overlay plugin 0.0.2 based on svg overlay plugin
;(function () {
  // ----------
  OpenSeadragon.Viewer.prototype.offscreenOverlay = function (options) {
    if (this._offscreenOverlayInfo) {
      return this._offscreenOverlayInfo
    }

    this._offscreenOverlayInfo = new Overlay(this, options)
    return this._offscreenOverlayInfo
  }

  OpenSeadragon.Viewer.prototype.offscreenOverlayExists = function () {
    return !!this._offscreenOverlayInfo
  }

  // ----------
  var Overlay = function (viewer, options) {
    var self = this
    this._viewer = viewer

    this._containerWidth = 0
    this._containerHeight = 0

    this._canvasdiv = document.createElement('div')
    this._canvasdiv.style.position = 'absolute'
    this._canvasdiv.style.left = 0
    this._canvasdiv.style.top = 0
    this._canvasdiv.style.width = '100%'
    this._canvasdiv.style.height = '100%'
    this._viewer.canvas.appendChild(this._canvasdiv)

    this._offscreenCanvas = document.createElement('canvas')
    this._offscreenCanvas.style.width = '100%'
    this._offscreenCanvas.style.height = '100%'
    this._canvasdiv.appendChild(this._offscreenCanvas)
    this._offscreen = this._offscreenCanvas.transferControlToOffscreen()
    this._open = false

    this.worker = undefined
    this.onRedraw = options.onRedraw || function () {}
    this.clearBeforeRedraw =
      typeof options.clearBeforeRedraw !== 'undefined'
        ? options.clearBeforeRedraw
        : true

    this._viewer.addHandler('viewport-change', function () {
      self.resize()
      self._updateCanvas()
    })

    this._viewer.addHandler('open', function () {
      self._open = true
      self.resize()
      self._updateCanvas()
    })

    this._viewer.addHandler('close', function () {
      if (self) {
        self._open = false
      }
    })
  }

  // ----------
  Overlay.prototype = {
    // ----------
    offscreen: function () {
      return this._offscreen
    },
    // ----------
    context2d: function () {
      return this._offscreen.getContext('2d')
    },
    // ----------
    clear: function () {
      this._offscreen.width = this._offscreen.width
    },
    forceRedraw: function () {
      if (this._open) {
        this.resize()
        this._updateCanvas()
      }
    },
    reset: function () {
      this._open = false
    },
    destroy: function () {
      this._canvasdiv.removeChild(this._offscreenCanvas)
      this._viewer.canvas.removeChild(this._canvasdiv)
      this.onRedraw = null
      this.worker = undefined
      this._canvasdiv = null
      this._offscreenCanvas = null
      this._offscreen = null
      this._viewer = null
    },
    // ----------
    resize: function () {
      if (!this?._viewer?.world?.getItemAt(0)) return
      if (this._containerWidth !== this._viewer.container.clientWidth) {
        this._containerWidth = this._viewer.container.clientWidth
        this._canvasdiv.setAttribute('width', this._containerWidth)
        this._offscreen.width = this._containerWidth
      }

      if (this._containerHeight !== this._viewer.container.clientHeight) {
        this._containerHeight = this._viewer.container.clientHeight
        this._canvasdiv.setAttribute('height', this._containerHeight)
        this._offscreen.height = this._containerHeight
      }
      this._viewportOrigin = new OpenSeadragon.Point(0, 0)
      var boundsRect = this._viewer.viewport.getBounds(true)
      var image1 = this._viewer.world.getItemAt(0)
      this.imgWidth = image1.source.dimensions.x
      this.imgHeight = image1.source.dimensions.y
      this.imgAspectRatio = this.imgWidth / this.imgHeight
      this._viewportOrigin.x = boundsRect.x
      this._viewportOrigin.y = boundsRect.y * this.imgAspectRatio

      this._viewportWidth = boundsRect.width
      this._viewportHeight = boundsRect.height * this.imgAspectRatio
    },
    _updateCanvas: function () {
      if (!this?._viewer?.world?.getItemAt(0)) return
      var viewportZoom = this._viewer.viewport.getZoom(true)
      var image1 = this._viewer.world.getItemAt(0)
      var zoom = image1.viewportToImageZoom(viewportZoom)
      var x =
        ((this._viewportOrigin.x / this.imgWidth - this._viewportOrigin.x) /
          this._viewportWidth) *
        this._containerWidth
      var y =
        ((this._viewportOrigin.y / this.imgHeight - this._viewportOrigin.y) /
          this._viewportHeight) *
        this._containerHeight
      if (this.clearBeforeRedraw) this.clear()
      this.worker.postMessage({
        action: 'redraw',
        zoom,
        position: { x, y },
        img: { width: this.imgWidth, height: this.imgHeight },
      })
    },
  }
})()
