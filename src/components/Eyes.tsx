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
  const mount = useRef<HTMLDivElement>(document.createElement('div'))

  useEffect(() => {
    const mountCurrent = mount.current
    let width = mountCurrent.clientWidth
    let height = mountCurrent.clientHeight

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
      new THREE.MeshBasicMaterial({ map: getTexture(1) })
    ]

    const eyes: THREE.Mesh[] = []

    camera.position.z = 30

    renderer.setClearColor('#eee')
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)

    const wn = Math.ceil(width / 90 / 2)
    const hn = Math.ceil(height / 90 / 2)
    let u = 0

    for (let x = -wn; x < wn; x++) {
      for (let y = -hn; y < hn; y++) {
        u++

        eyes[x + y] = new THREE.Mesh(
          geometry,
          materials[Math.floor(Math.random() * materials.length)]
        )
        eyes[x + y].position.x = x * 2.5
        eyes[x + y].position.y = y * 2.5

        eyes[x + y].rotation.x = -Math.PI / 2

        scene.add(eyes[x + y])
      }
    }

    console.log(u)

    const renderScene = () => {
      renderer.render(scene, camera)
    }

    const handleResize = () => {
      width = mountCurrent.clientWidth
      height = mountCurrent.clientHeight
      renderer.setSize(width, height)
      camera.updateProjectionMatrix()
      renderScene()
    }

    // const animate = () => {
    //   eyes[0].rotation.x += 0.01
    //   // eyes[1].rotation.x += 0.01

    //   // eyes[0].rotation.z += 0.01
    //   // eyes[1].rotation.z += 0.01

    //   renderScene()
    //   requestAnimationFrame(animate)
    // }

    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        console.log('handleMouseMove', e)

        for (let index = 0; index < eyes.length; index++) {
          // eyes[index].rotation.z += 0.01

          eyes[index].lookAt(-e.screenX, e.screenY, 100)
        }

        renderScene()

        // eyes[0].rotation.x += 0.01
      })
    }

    renderScene()

    // requestAnimationFrame(animate)

    mountCurrent.appendChild(renderer.domElement)
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      mountCurrent.removeChild(renderer.domElement)
      geometry.dispose()

      for (let i = 0; i < eyes.length; i++) {
        scene.remove(eyes[i])
      }

      for (let i = 0; i < materials.length; i++) {
        materials[i].dispose()
      }
    }
  }, [])

  return <EyeWrapper ref={mount} />
}
