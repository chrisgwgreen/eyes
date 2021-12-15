import * as THREE from 'three'
import { lighterCol, hexToRgb } from 'utils/color'

export const getTexture = (index: number) => {
  const width = 2048
  const height = 2048

  const size = width * height
  const data = new Uint8Array(3 * size)

  const pupilHeight = 150
  const pupilStart = 0
  const pupilEnd = width * pupilHeight

  const irisHeight = 200
  const irisEnd = width * irisHeight + pupilEnd

  const irisEdgeHeight = 80
  const irisEdgeEnd = width * irisEdgeHeight + irisEnd

  // Sclera
  for (let i = 0; i < size; i++) {
    const stride = i * 3

    data[stride] = 255
    data[stride + 1] = 255
    data[stride + 2] = 255
  }

  // Pupil
  for (let i = pupilStart; i < pupilEnd; i++) {
    const stride = i * 3

    data[stride] = 0
    data[stride + 1] = 0
    data[stride + 2] = 0
  }

  // Iris
  const colors = ['66B5D2', '634E34']

  const color = colors[index]

  for (let i = pupilEnd; i < irisEnd; i++) {
    const stride = i * 3

    const { r, g, b } = hexToRgb(
      lighterCol(color, 100 - Math.floor(((50 / irisHeight) * i) / width))
    )

    data[stride] = r
    data[stride + 1] = g
    data[stride + 2] = b
  }

  // Iris Edge
  for (let i = irisEnd; i < irisEdgeEnd; i++) {
    const stride = i * 3

    data[stride] = 0
    data[stride + 1] = 0
    data[stride + 2] = 0
  }

  return new THREE.DataTexture(data, width, height, THREE.RGBFormat)
}
