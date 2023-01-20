/* eslint-disable */
import OpenSeadragon from 'openseadragon'
import { SVG_NAMESPACE, SVG_ROOT_ID } from '../constants'
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

    this._containerWidth = 0
    this._containerHeight = 0

    this._subElementsWereAdded = false

    this._svg = document.createElementNS(SVG_NAMESPACE, 'svg')
    this._svg.style.position = 'absolute'
    this._svg.style.left = 0
    this._svg.style.top = 0
    this._svg.style.width = '100%'
    this._svg.style.height = '100%'

    this._viewer.canvas.appendChild(this._svg)
    this._node = document.createElementNS(SVG_NAMESPACE, 'g')
    this._node.setAttribute('id', SVG_ROOT_ID)
    this._svg.appendChild(this._node)

    this._initializeSVG =
      options.initializeSVGSubElements ||
      function () {
        return []
      }

    self.resize()

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

    this._viewer.addHandler('resize', function () {
      self.resize()
    })
    this._viewer.addHandler('viewport-change', function () {
      self.resize()
    })
  }

  // ----------
  Overlay.prototype = {
    node: function () {
      return this._node
    },

    _addSVGSubElements: function () {
      const elems = this._initializeSVG(SVG_NAMESPACE)
      if (elems.length) {
        this._initializeSVG(SVG_NAMESPACE).forEach(e =>
          this._node.appendChild(e)
        )
        return true
      }
      return false
    },

    resize: function () {
      if (!this._subElementsWereAdded) {
        this._subElementsWereAdded = this._addSVGSubElements()
      }

      if (this._containerWidth !== this._viewer.container.clientWidth) {
        this._containerWidth = this._viewer.container.clientWidth
        this._svg.setAttribute('width', this._containerWidth)
      }

      if (this._containerHeight !== this._viewer.container.clientHeight) {
        this._containerHeight = this._viewer.container.clientHeight
        this._svg.setAttribute('height', this._containerHeight)
      }

      var p = this._viewer.viewport.pixelFromPoint(
        new OpenSeadragon.Point(0, 0),
        true
      )
      var zoom = this._viewer.viewport.getZoom(true)
      var rotation = this._viewer.viewport.getRotation()
      var flipped = this._viewer.viewport.getFlip()
      var containerSizeX = this._viewer.viewport._containerInnerSize.x
      var scaleX = containerSizeX * zoom
      var scaleY = scaleX

      if (flipped) {
        // Makes the x component of the scale negative to flip the svg
        scaleX = -scaleX
        // Translates svg back into the correct coordinates when the x scale is made negative.
        p.x = -p.x + containerSizeX
      }

      this._node.setAttribute(
        'transform',
        'translate(' +
          p.x +
          ',' +
          p.y +
          ') scale(' +
          scaleX +
          ',' +
          scaleY +
          ') rotate(' +
          rotation +
          ')'
      )
    },
    destroy: function () {
      this._svg = null
      this._viewer = null
      this._node = null
    },
    onClick: function (node, handler) {
      new OpenSeadragon.MouseTracker({
        element: node,
        clickHandler: handler,
      }).setTracking(true)
    },
  }
})()
