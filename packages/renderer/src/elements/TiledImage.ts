import OpenSeadragon from 'openseadragon'
import { TiledImageProps } from '../types'
import Base from './Base'

async function loadDZIMeta(url: string) {
  const body = await fetch(url).then(response => response.text())
  const parser = new DOMParser()
  const dziMetaDoc = parser.parseFromString(body, 'application/xml')
  const errorNode = dziMetaDoc.querySelector('parsererror')
  if (errorNode) {
    throw new Error('Tile metadata load failed')
  } else {
    const imageNode = dziMetaDoc.querySelector('Image')
    const sizeNode = imageNode?.querySelector('Size')
    const format = imageNode?.getAttribute('Format')
    const tileSize = Number(imageNode?.getAttribute('TileSize'))
    const tileOverlap = Number(imageNode?.getAttribute('Overlap'))
    const width = Number(sizeNode?.getAttribute('Width'))
    const height = Number(sizeNode?.getAttribute('Height'))
    return {
      tileSize,
      tileOverlap,
      width,
      height,
      format,
    }
  }
}

class TiledImage extends Base {
  props: TiledImageProps

  _retryCount: number

  tImg: OpenSeadragon.TiledImage

  panPoint: OpenSeadragon.Point

  set parent(p: Base | null) {
    this._parent = p
    this._openImage()
  }

  constructor(viewer: OpenSeadragon.Viewer, props: TiledImageProps) {
    super(viewer)
    this.props = props
    this._retryCount = 0
  }

  commitUpdate(props: TiledImageProps): void {
    // const oldProps = this.props
    this.props = props

    // if (props.url !== oldProps.url)  {
    const old_zoom = this.viewer.viewport.getZoom()
    this._openImage()
    this.viewer.viewport.zoomTo(old_zoom, undefined, true)
    // }
  }

  private static _stateToQuery(
    stateObj: Record<string, string> | undefined
  ): string {
    if (!stateObj) return ''

    const entries = Object.entries(stateObj)
    const queries = entries.map(([key, value]) => `${key}=${value}`).join('&')
    return `?${queries}`
  }

  private _openImage(): void {
    const viewer = this._parent?.viewer
    if (!viewer) return
    try {
      viewer.close()
      if (!this.props.tileSource && !this.props.tileUrlBase && this.props.url) {
        // Real-time tiling
        viewer.open(this.props.url)
      } else if (
        !this.props.tileSource &&
        this.props.tileUrlBase &&
        this.props.url
      ) {
        const old_zoom = this.viewer.viewport.getZoom()

        // Real-time tiling with custom tile url
        loadDZIMeta(this.props.url)
          .then(dziMeta => {
            const { format, ...tileSource } = dziMeta

            const imgOpts = {
              ...tileSource,
              getTileUrl: (level: number, x: number, y: number) => {
                const queries = TiledImage._stateToQuery(
                  this.props.tiledImageState
                )
                const url = `${this.props.tileUrlBase}_files/${level}/${x}_${y}.${
                  format || 'jpeg'
                }`
                if (queries) {
                  return `${url}${queries}`
                }
                return url
              },
            }

            viewer.open(imgOpts)
            const bounds = this.viewer.viewport.getBounds()

            this.panPoint = new OpenSeadragon.Point(
              bounds.x + bounds.width / 2,
              bounds.y + bounds.height / 2
            )
          })
          .then(() => {
            setTimeout(() => {
              this.viewer.viewport.panTo(this.panPoint, true)
              this.viewer.viewport.zoomTo(old_zoom, undefined, true)
            }, 10)
          })
          .catch(error => {
            this.handleError(error)
          })
        // viewer.open({ url: this.props.url, getTileUrl: this.props.getTileUrl })
      } else if (this.props.tileSource) {
        // Static(Glob) tiling
        // https://github.com/openseadragon/openseadragon/issues/1032#issuecomment-248323573
        // https://github.com/openseadragon/openseadragon/blob/master/test/modules/ajax-tiles.js
        viewer.open(this.props.tileSource)
      } else {
        throw new Error('Either tileSource or url should be defined')
      }
    } catch (error) {
      this.handleError(error as Error)
    }
  }

  private handleError(error: Error): void {
    const viewer = this._parent?.viewer
    // if maxRetry is -1, then try forever
    if (
      this.props.maxRetry !== -1 &&
      (!this.props.maxRetry || this._retryCount >= this.props.maxRetry)
    ) {
      this._retryCount = 0
      if (viewer) {
        viewer.raiseEvent('open-failed', {
          eventSource: viewer,
          message: error?.message ? error?.message : error,
        })
      } else {
        throw error
      }
    } else {
      this._retryCount += 1
      setTimeout(
        () => {
          this._openImage()
        },
        this.props.retryInterval ? this.props.retryInterval : 1000
      )
    }
  }
}

export default TiledImage
