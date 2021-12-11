import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas: any = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader()

// Objects
const geometry = new THREE.PlaneBufferGeometry(1, 1.3)

for(let i = 0; i < 4; i++) {
  const material = new THREE.MeshBasicMaterial({
    map: textureLoader.load(`../static/img/${i}.jpg`)
  })

  const img = new THREE.Mesh(geometry, material)
  img.position.set(Math.random()+ .3, -i*1.8, 0)

  scene.add(img)
}

let objs: any = []

scene.traverse((object) => {
  if (object instanceof THREE.Mesh) objs.push(object)
})

/**
 * Raycaster
 */
 const raycaster = new THREE.Raycaster()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Mouse
 */


// const mouse = new THREE.Vector2;

// window.addEventListener("mousemove", (e) => [
//   mouse.x = (e.clientX / sizes.width) * 2 - 1
// ])

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

gui.add(camera.position, 'y').min(-5).max(10).step(0.5)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Mouse
let y = 0
let position = 0

window.addEventListener('wheel', (e) => {
  y = -(e.deltaY * 0.0007)
})

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX / sizes.width * 2 - 1
  mouse.y = - (e.clientY / sizes.height) * 2 + 1
})

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update camera
    position += y
    y *= .9

    camera.position.y = position

    // Raycaster
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(objs)

    intersects.forEach((intersect) => {
      gsap.to(intersect.object.scale, {x: 1.7, y: 1.7})
      gsap.to(intersect.object.rotation, {y: -0.5})
      gsap.to(intersect.object.position, {z: -0.9})
    })

    objs.forEach((object: THREE.Object3D) => {
      if(!intersects.find(intersect => intersect.object === object)) {
        gsap.to(object.scale, {x: 1, y: 1})
        gsap.to(object.rotation, {y: 0})
        gsap.to(object.position, {z: 0})

      }
    })

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()