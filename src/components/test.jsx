import React, { useRef, useState, useCallback } from 'react'
import { Canvas, useFrame, useLoader, extend, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import CustomObject from './customObject'
import { OrbitControls } from '@react-three/drei'
import { shaderMaterial } from '@react-three/drei'
import glsl from 'babel-plugin-glsl/macro'
const WaveShaderMaterial = shaderMaterial(
  // Uniform
  {
    uTime: 0,
    uColor: new THREE.Color(0.0, 0.0, 0.0),
    uTexture: new THREE.Texture(),
    uHover: 0,
  },
  // Vertex Shader
  glsl`
    precision mediump float;

    varying vec2 vUv;
    varying float vWave;

    uniform float uTime;
    uniform float uHover;
    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);


    void main() {
      vUv = uv;

      vec3 pos = position;
      float noiseFreq = 2.0;
      float noiseAmp = 0.1;
      vec3 noisePos = vec3(pos.x * noiseFreq + (uTime * uHover), pos.y * noiseFreq, pos.z);
      pos.z += snoise3(noisePos) * noiseAmp;
      vWave = pos.z;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);  
    }
  `,
  // Fragment Shader
  glsl`
    precision mediump float;

    uniform vec3 uColor;
    uniform float uTime;
    uniform sampler2D uTexture;

    varying vec2 vUv;
    varying float vWave;

    void main() {
      float wave = vWave * .5;
      vec3 texture = texture2D(uTexture, vUv + wave).rgb;
      gl_FragColor = vec4(texture, 1.0); 
    }
  `,
)

extend({ WaveShaderMaterial })

const Test = () => {
  const ref = useRef(null)
  const [hovered, setHover] = useState(0.5)
  const [image] = useLoader(THREE.TextureLoader, ['/willToon.png'])
  const hover = useCallback(() => setHover(0.5), [])
  const unhover = useCallback(() => setHover(0.0), [])
  useFrame(({ clock }) => (ref.current.uTime = clock.getElapsedTime()))
  return (
    <>
      <mesh position={[0, -0.25, 0]} onClick={hover} onUnhover={unhover}>
        <planeBufferGeometry args={[1, 1, 64, 64]} />
        <waveShaderMaterial uColor={''} ref={ref} uTexture={image} uHover={hovered} />
      </mesh>
    </>
  )
}

export default Test
