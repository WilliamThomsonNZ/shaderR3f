import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import Test from '../components/test'
export default function Page(props) {
  return (
    <div className={'w-screen h-screen'}>
      <Canvas camera={{ fov: 16, position: [0, 0, 5] }}>
        <Test />
        <pointLight intensity={10} />
      </Canvas>
    </div>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Index' } }
}
