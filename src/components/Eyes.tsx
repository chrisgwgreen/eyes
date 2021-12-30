import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import styled from 'styled-components'
import 'assets/index.css'
import { getTexture } from 'assets/texture'

interface Eye {
  eyes: THREE.Mesh[]
  speed: number
  delay: number
}

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

    // const eyes: THREE.Mesh[] = []

    camera.position.z = 80

    renderer.setClearColor('#eee')
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)

    let xTotal = Math.ceil(width / 80)
    const yTotal = Math.ceil(height / 80)

    // Ensure pairs of eyes
    xTotal = xTotal % 2 !== 0 ? xTotal + 1 : xTotal

    const eyePairs: Eye[] = []

    let eyeColor = materials[Math.floor(Math.random() * materials.length)]
    for (let y = -yTotal / 2; y < yTotal / 2; y++) {
      for (let x = -xTotal / 2; x < xTotal / 2; x = x + 2) {
        eyeColor = materials[Math.floor(Math.random() * materials.length)]

        const leftEye = new THREE.Mesh(geometry, eyeColor)
        leftEye.position.x = x * 2.5 + 1.25
        leftEye.position.y = y * 2.5 + 1.25

        const rightEye = new THREE.Mesh(geometry, eyeColor)
        rightEye.position.x = (x + 1) * 2.5 + 1.25
        rightEye.position.y = y * 2.5 + 1.25

        eyePairs.push({
          speed: 0,
          delay: 0,
          eyes: [leftEye, rightEye]
        })

        scene.add(leftEye)
        scene.add(rightEye)
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

    let screenX: number = width / 2
    let screenY: number = height / 2

    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        screenX = e.screenX - 40
        screenY = e.screenY - 40
      })
    }

    let tick = true

    const animate = () => {
      requestAnimationFrame(() => {
        let pos = new THREE.Vector3()

        for (let i = 0; i < eyePairs.length; i++) {
          const eyePair = eyePairs[i]

          pos = pos.setFromMatrixPosition(eyePair.eyes[0].matrixWorld)
          pos.project(camera)
          pos.x = pos.x * (width / 2) + width / 2
          pos.y = -(pos.y * (height / 2)) + height / 2
          pos.z = 0

          eyePair.eyes[0].rotation.z =
            ((Math.PI * 0.5) / width) * (screenX - pos.x)
          eyePair.eyes[0].rotation.x =
            -Math.PI / 2 + ((Math.PI * 0.5) / height) * (screenY - pos.y)

          eyePair.eyes[1].rotation.z =
            ((Math.PI * 0.5) / width) * (screenX - pos.x)
          eyePair.eyes[1].rotation.x =
            -Math.PI / 2 + ((Math.PI * 0.5) / height) * (screenY - pos.y)
        }

        renderScene()

        if (tick) animate()
      })
    }

    animate()
    renderScene()

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    eyeWrapperCurrent.appendChild(renderer.domElement)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      eyeWrapperCurrent.removeChild(renderer.domElement)
      geometry.dispose()

      // for (let i = 0; i < eyes.length; i++) {
      //   scene.remove(eyes[i])
      // }

      for (let i = 0; i < materials.length; i++) {
        materials[i].dispose()
      }
    }
  }, [])

  return <EyeWrapper ref={eyeWrapper} />
}
