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
    this._offset = { x: 100, y: -9, scale: 1000 }

    this._containerWidth = 0
    this._containerHeight = 0

    this._svg = document.createElementNS(svgNS, 'svg')
    this._svg.style.position = 'absolute'
    this._svg.style.left = 0
    this._svg.style.top = 0
    this._svg.style.width = '100%'
    this._svg.style.height = '100%'

    this._viewer.canvas.appendChild(this._svg)

    // parent node
    this._node = document.createElementNS(svgNS, 'g')
    this._svg.appendChild(this._node)

    if (options.svgData) {
      console.log('options.svgData', options.svgData)
      options.svgData.map(gridGroup => {
        const group = document.createElementNS(svgNS, 'g')
        group.setAttribute('fill', gridGroup.color)
        group.setAttribute('opacity', 0.5)

        gridGroup.children.map(gridRect => {
          const rect = document.createElementNS(svgNS, 'rect')
          rect.setAttribute('x', gridRect.x / 100)
          rect.setAttribute('y', gridRect.y / 100)
          rect.setAttribute('width', '38')
          rect.setAttribute('height', '38')
          group.appendChild(rect)
        })
        this._node.appendChild(group)
      })
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
      // TODO: Expose an accessor for _containerInnerSize in the OSD API so we don't have to use the private variable.
      var containerSizeX = this._viewer.viewport._containerInnerSize.x
      var scaleX = (containerSizeX * zoom) / this._offset.scale
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
