/* eslint-disable */
import OpenSeadragon from 'openseadragon'

const svgNS = 'http://www.w3.org/2000/svg'

;(function () {
  // ----------
  OpenSeadragon.Viewer.prototype.svgOverlay = function (options) {
    if (this._svgOverlayInfo) {
      return this._svgOverlayInfo
    }

    this._svgOverlayInfo = new Overlay(this, options)
    return this._svgOverlayInfo
  }

  OpenSeadragon.Viewer.prototype.svgOverlayExists = function () {
    return !!this._svgOverlayInfo
  }

  // ----------
  const Overlay = function (viewer, options) {
    const self = this
    this._viewer = viewer
    this._offset = { x: 0, y: 0, scale: 1 }

    const pmin = this._viewer.viewport.pixelFromPoint(
      new OpenSeadragon.Point(),
      true
    )
    const pmax = this._viewer.viewport.pixelFromPoint(
      new OpenSeadragon.Point(1, 1),
      true
    )

    this._containerWidth = 0
    this._containerHeight = 0

    this._svg = document.createElementNS(svgNS, 'svg')
    this._svg.style.position = 'absolute'
    this._svg.style.left = pmin.x
    this._svg.style.top = pmin.y
    // this._svg.style.width = '100%'
    this._svg.style.width = pmax.x - pmin.x
    // this._svg.style.minHeight = window.screen.height
    this._svg.style.height = pmax.y - pmin.y

    this._viewer.canvas.appendChild(this._svg)

    if (options.offsetConfig) {
      this._offset = options.offsetConfig
    }

    this.resize()

    this._node = document.createElementNS(svgNS, 'g')
    this._svg.appendChild(this._node)
    this._svgInner = null

    if (options.svgComponent) {
      const svgContent = new DOMParser().parseFromString(
        options.svgComponent,
        'image/svg+xml'
      )
      this._svgInner = svgContent.documentElement
      self.resize()
      this._node.appendChild(this._svgInner)

      // this._node.setAttribute(
      //   'transform',
      //   'translate(' + this._offset.x + ',' + this._offset.y + ')'
      // )
    }

    this._viewer.addHandler('animation', function () {
      self.resize()
    })

    this._viewer.addHandler('open', function () {
      self._open = true
      self.resize()
    })
    this._viewer.addHandler('close', function () {
      if (self) {
        self._open = false
      }
    })

    this._viewer.addHandler('rotate', function (evt) {
      self.resize()
    })

    this._viewer.addHandler('flip', function () {
      self.resize()
    })

    // this._viewer.addHandler('resize', function () {
    //   self.resize()
    // })
    this._viewer.addHandler('viewport-change', function () {
      self.resize()
    })
  }

  // ----------
  Overlay.prototype = {
    node: function () {
      return this._node
    },

    resize: function () {
      if (!this?._viewer?.world?.getItemAt(0)) return

      const pmin = this._viewer.viewport.pixelFromPoint(
        new OpenSeadragon.Point(),
        true
      )
      const pmax = this._viewer.viewport.pixelFromPoint(
        new OpenSeadragon.Point(1, 1),
        true
      )
      const zoom = this._viewer.viewport.getZoom(true)
      this._svg.style.left = pmin.x
      this._svg.style.top = pmin.y
      this._svg.style.width = (pmax.x - pmin.x) / zoom
      this._svg.style.height = (pmax.y - pmin.y) / zoom

      const p = this._viewer.viewport.pixelFromPoint(
        new OpenSeadragon.Point(),
        true
      )
      const pone = this._viewer.viewport.pixelFromPoint(
        new OpenSeadragon.Point(1, 1),
        true
      )

      // console.log('p', pmax.x - pmin.x)
      if (this._svgInner) {
        this._svgInner.setAttribute(
          'viewBox',
          `0 0 ${(pmax.x - pmin.x) / zoom} ${(pmax.y - pmin.y) / zoom}`
        )
      }
      // this._node.setAttribute(
      //   'transform',
      //   'translate(' +
      //     this._offset.x * zoom +
      //     ',' +
      //     this._offset.y * zoom +
      //     ')' +
      //     'scale(' +
      //     this._offset.scale +
      //     ',' +
      //     this._offset.scale +
      //     ')'
      // )
    },
    destroy: function () {
      this._svg = null
      this._viewer = null
    },
    onClick: function (node, handler) {
      // TODO: Fast click for mobile browsers

      new OpenSeadragon.MouseTracker({
        element: node,
        clickHandler: handler,
      }).setTracking(true)
    },
  }
})()
