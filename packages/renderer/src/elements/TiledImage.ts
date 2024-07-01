import OpenSeadragon from 'openseadragon'
import { isEqual } from 'lodash'
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

  index: number

  isVisible: boolean

  set parent(p: Base | null) {
    this._parent = p
    this._openImage()
  }

  constructor(viewer: OpenSeadragon.Viewer, props: TiledImageProps) {
    super(viewer)
    this.props = props
    this._retryCount = 0
    this.index = props.index || 0
    this.isVisible = props.isVisible ?? true
  }

  commitUpdate(props: TiledImageProps): void {
    // discard isVisible from comparison
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isVisible: _oldIsVisible, ...oldProps } = this.props
    const { isVisible: newIsVisible, ...newProps } = props

    if (!isEqual(oldProps, newProps)) {
      this.props = props
      this.isVisible = props.isVisible ?? true
      this._closeImage()
      this._openImage()
    } else {
      this.isVisible = newIsVisible ?? true
      this.updateOpacity()
    }
  }

  private updateOpacity() {
    const world = this._parent?.viewer?.world
    const layer = world?.getItemAt(this.index)
    layer?.setOpacity(this.isVisible ? 1 : 0)
  }

  private getQueryStringFromProps(): string {
    if (!this.props.queryParams) return ''

    const entries = Object.entries(this.props.queryParams)
    const queries = entries.map(([key, value]) => `${key}=${value}`).join('&')
    return `?${queries}`
  }

  private _openImage(): void {
    const viewer = this._parent?.viewer
    if (!viewer) return
    try {
      // Only supplies tile url base
      if (!this.props.tileSource && !this.props.url && this.props.tileUrlBase) {
        // eslint-disable-next-line no-console
        console.warn(
          'TiledImage: url for tile metadata not provided. Using tileUrlBase only.\nIt is recommended to supply tile metadata url.'
        )
        // Real-time tiling
        viewer.addTiledImage({
          tileSource: {
            getTileUrl: (level: number, x: number, y: number) => {
              const url = `${this.props.tileUrlBase}_files/${level}/${x}_${y}.${'jpeg'}`
              const queries = this.getQueryStringFromProps()
              if (queries) {
                return `${url}${queries}`
              }
              return url
            },
          },
          index: this.index,
          opacity: this.isVisible ? 1 : 0,
        })

        // Supplying (meta) url and the tile url base
      } else if (
        !this.props.tileSource &&
        this.props.tileUrlBase &&
        this.props.url
      ) {
        // Real-time tiling with custom tile url
        loadDZIMeta(this.props.url)
          .then(dziMeta => {
            const { format, ...tileSource } = dziMeta
            viewer.addTiledImage({
              tileSource: {
                ...tileSource,
                getTileUrl: (level: number, x: number, y: number) => {
                  const url = `${this.props.tileUrlBase}_files/${level}/${x}_${y}.${
                    format || 'jpeg'
                  }`
                  const queries = this.getQueryStringFromProps()
                  if (queries) {
                    return `${url}${queries}`
                  }
                  return url
                },
              },
              index: this.index,
              opacity: this.isVisible ? 1 : 0,
            })
          })
          .catch(error => {
            this.handleError(error)
          })
        // Supplying tile source (should include everything else)
      } else if (this.props.tileSource) {
        // Static(Glob) tiling
        // https://github.com/openseadragon/openseadragon/issues/1032#issuecomment-248323573
        // https://github.com/openseadragon/openseadragon/blob/master/test/modules/ajax-tiles.js

        if (this.props.tileSource && !this.props.tileSource.getTileUrl) {
          throw new Error('TileSource must include getTileUrl function')
        }
        viewer.addTiledImage({
          tileSource: {
            ...this.props.tileSource,
          },
          index: this.index,
          opacity: this.isVisible ? 1 : 0,
        })
        viewer.open(this.props.tileSource)
      } else {
        throw new Error('Either tileSource or url should be defined')
      }
    } catch (error) {
      this.handleError(error as Error)
    }
  }

  private _closeImage(): void {
    const layer = this._parent?.viewer?.world.getItemAt(this.index)
    if (!layer) return
    layer?.destroy()
    this._parent?.viewer?.world.removeItem(layer)
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
