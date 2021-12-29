import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import styled from 'styled-components'
import 'assets/index.css'
import { getTexture } from 'assets/texture'

const EyeWrapper = styled.div`
  width: 100vw;
  height: 100vh;
`

export const Eyes = () => {
  const eyeWrapper = useRef<HTMLDivElement>(document.createElement('div'))

  useEffect(() => {
    const eyeWrapperCurrent = eyeWrapper.current
    let width = eyeWrapperCurrent.clientWidth
    let height = eyeWrapperCurrent.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(
      width / -64,
      width / 64,
      height / 64,
      height / -64,
      10,
      10000
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    const geometry = new THREE.SphereGeometry(1, 64, 64)

    const materials = [
      new THREE.MeshBasicMaterial({ map: getTexture(0) }),
      new THREE.MeshBasicMaterial({ map: getTexture(1) }),
      new THREE.MeshBasicMaterial({ map: getTexture(2) })
    ]

    const eyes: THREE.Mesh[] = []

    camera.position.z = 80

    renderer.setClearColor('#eee')
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)

    const xTotal = Math.ceil(width / 80)
    const yTotal = Math.ceil(height / 80)
    let index = 0

    let eyeColor = materials[Math.floor(Math.random() * materials.length)]
    for (let y = -yTotal / 2; y < yTotal / 2; y++) {
      for (let x = -xTotal / 2; x < xTotal / 2; x++) {
        if (index % 2 === 0)
          eyeColor = materials[Math.floor(Math.random() * materials.length)]

        eyes[index] = new THREE.Mesh(geometry, eyeColor)
        eyes[index].position.x = x * 2.5 + 1.25
        eyes[index].position.y = y * 2.5 + 1.25

        scene.add(eyes[index])

        index++
      }
    }

    const renderScene = () => {
      renderer.render(scene, camera)
    }

    const handleResize = () => {
      width = eyeWrapperCurrent.clientWidth
      height = eyeWrapperCurrent.clientHeight
      renderer.setSize(width, height)
      camera.updateProjectionMatrix()
      renderScene()
    }

    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        let pos = new THREE.Vector3()
        const screenX = e.screenX - 40
        const screenY = e.screenY - 40

        for (let index = 0; index < eyes.length; index++) {
          pos = pos.setFromMatrixPosition(eyes[index].matrixWorld)
          pos.project(camera)
          pos.x = pos.x * (width / 2) + width / 2
          pos.y = -(pos.y * (height / 2)) + height / 2
          pos.z = 0

          eyes[index].rotation.z = ((Math.PI * 0.5) / width) * (screenX - pos.x)
          eyes[index].rotation.x =
            -Math.PI / 2 + ((Math.PI * 0.5) / height) * (screenY - pos.y)
        }

        renderScene()
      })
    }

    renderScene()

    eyeWrapperCurrent.appendChild(renderer.domElement)

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      eyeWrapperCurrent.removeChild(renderer.domElement)
      geometry.dispose()

      for (let i = 0; i < eyes.length; i++) {
        scene.remove(eyes[i])
      }

      for (let i = 0; i < materials.length; i++) {
        materials[i].dispose()
      }
    }
  }, [])

  return <EyeWrapper ref={eyeWrapper} />
}
