"use client"

import type React from "react"

import { forwardRef, useImperativeHandle, useEffect, useRef, useMemo, useState, useCallback, type FC, type ReactNode } from "react"
import * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"
import { PerspectiveCamera } from "@react-three/drei"
import { degToRad } from "three/src/math/MathUtils.js"
import {
  ArrowRight,
  Shield,
  Car,
  Building2,
  TrendingUp,
  Search,
  CheckCircle2,
  Lock,
  Zap,
  Star,
  MapPin,
  Smartphone,
  CreditCard,
  BadgeCheck,
  ChevronRight,
  ChevronLeft,
  Play,
} from "lucide-react"

// ============================================================================
// BEAMS COMPONENT (3D Background)
// ============================================================================

type UniformValue = THREE.IUniform<unknown> | unknown

interface ExtendMaterialConfig {
  header: string
  vertexHeader?: string
  fragmentHeader?: string
  material?: THREE.MeshPhysicalMaterialParameters & { fog?: boolean }
  uniforms?: Record<string, UniformValue>
  vertex?: Record<string, string>
  fragment?: Record<string, string>
}

type ShaderWithDefines = THREE.ShaderLibShader & {
  defines?: Record<string, string | number | boolean>
}

function extendMaterial<T extends THREE.Material = THREE.Material>(
  BaseMaterial: new (params?: THREE.MaterialParameters) => T,
  cfg: ExtendMaterialConfig,
): THREE.ShaderMaterial {
  const physical = THREE.ShaderLib.physical as ShaderWithDefines
  const { vertexShader: baseVert, fragmentShader: baseFrag, uniforms: baseUniforms } = physical
  const baseDefines = physical.defines ?? {}

  const uniforms: Record<string, THREE.IUniform> = THREE.UniformsUtils.clone(baseUniforms)

  const defaults = new BaseMaterial(cfg.material || {}) as T & {
    color?: THREE.Color
    roughness?: number
    metalness?: number
    envMap?: THREE.Texture
    envMapIntensity?: number
  }

  if (defaults.color) uniforms.diffuse.value = defaults.color
  if ("roughness" in defaults) uniforms.roughness.value = defaults.roughness
  if ("metalness" in defaults) uniforms.metalness.value = defaults.metalness
  if ("envMap" in defaults) uniforms.envMap.value = defaults.envMap
  if ("envMapIntensity" in defaults) uniforms.envMapIntensity.value = defaults.envMapIntensity

  Object.entries(cfg.uniforms ?? {}).forEach(([key, u]) => {
    uniforms[key] =
      u !== null && typeof u === "object" && "value" in u
        ? (u as THREE.IUniform<unknown>)
        : ({ value: u } as THREE.IUniform<unknown>)
  })

  let vert = `${cfg.header}
${cfg.vertexHeader ?? ""}
${baseVert}`
  let frag = `${cfg.header}
${cfg.fragmentHeader ?? ""}
${baseFrag}`

  for (const [inc, code] of Object.entries(cfg.vertex ?? {})) {
    vert = vert.replace(inc, `${inc}
${code}`)
  }

  for (const [inc, code] of Object.entries(cfg.fragment ?? {})) {
    frag = frag.replace(inc, `${inc}
${code}`)
  }

  const mat = new THREE.ShaderMaterial({
    defines: { ...baseDefines },
    uniforms,
    vertexShader: vert,
    fragmentShader: frag,
    lights: true,
    fog: !!cfg.material?.fog,
  })

  return mat
}

const CanvasWrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <Canvas dpr={[1, 2]} frameloop="always" className="w-full h-full relative">
    {children}
  </Canvas>
)

const hexToNormalizedRGB = (hex: string): [number, number, number] => {
  const clean = hex.replace("#", "")
  const r = Number.parseInt(clean.substring(0, 2), 16)
  const g = Number.parseInt(clean.substring(2, 4), 16)
  const b = Number.parseInt(clean.substring(4, 6), 16)
  return [r / 255, g / 255, b / 255]
}

const noise = `
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
           (c - a)* u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x,Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x,Pf1.y,Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy,Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy,Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x,Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz = mix(n_z.xy,n_z.zw,fade_xyz.y);
  float n_xyz = mix(n_yz.x,n_yz.y,fade_xyz.x);
  return 2.2 * n_xyz;
}
`

interface BeamsProps {
  beamWidth?: number
  beamHeight?: number
  beamNumber?: number
  lightColor?: string
  speed?: number
  noiseIntensity?: number
  scale?: number
  rotation?: number
}

function createStackedPlanesBufferGeometry(
  n: number,
  width: number,
  height: number,
  spacing: number,
  heightSegments: number,
): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry()
  const numVertices = n * (heightSegments + 1) * 2
  const numFaces = n * heightSegments * 2

  const positions = new Float32Array(numVertices * 3)
  const indices = new Uint32Array(numFaces * 3)
  const uvs = new Float32Array(numVertices * 2)

  let vertexOffset = 0
  let indexOffset = 0
  let uvOffset = 0

  const totalWidth = n * width + (n - 1) * spacing
  const xOffsetBase = -totalWidth / 2

  for (let i = 0; i < n; i++) {
    const xOffset = xOffsetBase + i * (width + spacing)
    const uvXOffset = Math.random() * 300
    const uvYOffset = Math.random() * 300

    for (let j = 0; j <= heightSegments; j++) {
      const y = height * (j / heightSegments - 0.5)
      const v0 = [xOffset, y, 0]
      const v1 = [xOffset + width, y, 0]

      positions.set([...v0, ...v1], vertexOffset * 3)

      const uvY = j / heightSegments
      uvs.set([uvXOffset, uvY + uvYOffset, uvXOffset + 1, uvY + uvYOffset], uvOffset)

      if (j < heightSegments) {
        const a = vertexOffset,
          b = vertexOffset + 1,
          c = vertexOffset + 2,
          d = vertexOffset + 3
        indices.set([a, b, c, c, b, d], indexOffset)
        indexOffset += 6
      }

      vertexOffset += 2
      uvOffset += 4
    }
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2))
  geometry.setIndex(new THREE.BufferAttribute(indices, 1))
  geometry.computeVertexNormals()

  return geometry
}

const MergedPlanes = forwardRef<
  THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>,
  {
    material: THREE.ShaderMaterial
    width: number
    count: number
    height: number
  }
>(({ material, width, count, height }, ref) => {
  const mesh = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null!)

  useImperativeHandle(ref, () => mesh.current)

  const geometry = useMemo(
    () => createStackedPlanesBufferGeometry(count, width, height, 0, 100),
    [count, width, height],
  )

  useFrame((_, delta) => {
    mesh.current.material.uniforms.time.value += 0.1 * delta
  })

  return <mesh ref={mesh} geometry={geometry} material={material} />
})

MergedPlanes.displayName = "MergedPlanes"

const PlaneNoise = forwardRef<
  THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>,
  {
    material: THREE.ShaderMaterial
    width: number
    count: number
    height: number
  }
>((props, ref) => (
  <MergedPlanes ref={ref} material={props.material} width={props.width} count={props.count} height={props.height} />
))

PlaneNoise.displayName = "PlaneNoise"

const DirLight: FC<{ position: [number, number, number]; color: string }> = ({ position, color }) => {
  const dir = useRef<THREE.DirectionalLight>(null!)

  useEffect(() => {
    if (!dir.current) return
    const cam = dir.current.shadow.camera as THREE.Camera & {
      top: number
      bottom: number
      left: number
      right: number
      far: number
    }
    cam.top = 24
    cam.bottom = -24
    cam.left = -24
    cam.right = 24
    cam.far = 64
    dir.current.shadow.bias = -0.004
  }, [])

  return <directionalLight ref={dir} color={color} intensity={1} position={position} />
}

const Beams: FC<BeamsProps> = ({
  beamWidth = 2,
  beamHeight = 15,
  beamNumber = 12,
  lightColor = "#ffffff",
  speed = 2,
  noiseIntensity = 1.75,
  scale = 0.2,
  rotation = 0,
}) => {
  const meshRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null!)

  const beamMaterial = useMemo(
    () =>
      extendMaterial(THREE.MeshStandardMaterial, {
        header: `
  varying vec3 vEye;
  varying float vNoise;
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float time;
  uniform float uSpeed;
  uniform float uNoiseIntensity;
  uniform float uScale;
  ${noise}`,
        vertexHeader: `
  float getPos(vec3 pos) {
    vec3 noisePos =
      vec3(pos.x * 0., pos.y - uv.y, pos.z + time * uSpeed * 3.) * uScale;
    return cnoise(noisePos);
  }

  vec3 getCurrentPos(vec3 pos) {
    vec3 newpos = pos;
    newpos.z += getPos(pos);
    return newpos;
  }

  vec3 getNormal(vec3 pos) {
    vec3 curpos = getCurrentPos(pos);
    vec3 nextposX = getCurrentPos(pos + vec3(0.01, 0.0, 0.0));
    vec3 nextposZ = getCurrentPos(pos + vec3(0.0, -0.01, 0.0));
    vec3 tangentX = normalize(nextposX - curpos);
    vec3 tangentZ = normalize(nextposZ - curpos);
    return normalize(cross(tangentZ, tangentX));
  }`,
        fragmentHeader: "",
        vertex: {
          "#include <begin_vertex>": `transformed.z += getPos(transformed.xyz);`,
          "#include <beginnormal_vertex>": `objectNormal = getNormal(position.xyz);`,
        },
        fragment: {
          "#include <dithering_fragment>": `
    float randomNoise = noise(gl_FragCoord.xy);
    gl_FragColor.rgb -= randomNoise / 15. * uNoiseIntensity;`,
        },
        material: { fog: true },
        uniforms: {
          diffuse: new THREE.Color(...hexToNormalizedRGB("#000000")),
          time: { shared: true, mixed: true, linked: true, value: 0 },
          roughness: 0.3,
          metalness: 0.3,
          uSpeed: { shared: true, mixed: true, linked: true, value: speed },
          envMapIntensity: 10,
          uNoiseIntensity: noiseIntensity,
          uScale: scale,
        },
      }),
    [speed, noiseIntensity, scale],
  )

  return (
    <CanvasWrapper>
      <group rotation={[0, 0, degToRad(rotation)]}>
        <PlaneNoise ref={meshRef} material={beamMaterial} count={beamNumber} width={beamWidth} height={beamHeight} />
        <DirLight color={lightColor} position={[0, 3, 10]} />
      </group>
      <ambientLight intensity={1} />
      <color attach="background" args={["#000000"]} />
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={30} />
    </CanvasWrapper>
  )
}

// ============================================================================
// DALAAL ETHREAL BEAMS HERO
// ============================================================================

const STATS = [
  { icon: Car, value: "2,400+", label: "Listings" },
  { icon: Shield, value: "$12M+", label: "Secured" },
  { icon: Building2, value: "850+", label: "Agents" },
  { icon: TrendingUp, value: "99.8%", label: "Success" },
]

const FEATURES = [
  { icon: Lock, text: "Escrow Protected" },
  { icon: CheckCircle2, text: "Verified Agents" },
  { icon: Zap, text: "Instant Payments" },
]

const HOW_IT_WORKS = [
  { step: "01", title: "Browse Listings", desc: "Search cars & properties" },
  { step: "02", title: "Lock Deposit", desc: "Funds held in escrow" },
  { step: "03", title: "Verify & Drive", desc: "Inspect before release" },
]

const TRUSTED_BY = ["Hormuud Telecom", "Telesom", "Golis Bank", "Dahabshiil"]

const FEATURED_LISTINGS: Array<{
  id: number
  title: string
  type: ListingType
  location: string
  price: string
  image: string
  specs: Record<string, string | number>
  badge: string
  brokerInitials: string
  brokerName: string
  rating: string
}> = [
  {
    id: 1,
    title: "Toyota Land Cruiser Prado",
    type: "vehicle",
    location: "Garowe, Puntland",
    price: "$48,500",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    specs: { fuel: "Diesel", year: 2022, transmission: "Automatic" },
    badge: "FEATURED",
    brokerInitials: "MA",
    brokerName: "Mustafa Ali",
    rating: "4.9",
  },
  {
    id: 2,
    title: "Luxury Diaspora Villa",
    type: "property",
    location: "Hodan, Mogadishu",
    price: "$245,000",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    specs: { beds: 5, baths: 4, size: "380 m\u00B2" },
    badge: "FOR SALE",
    brokerInitials: "AR",
    brokerName: "Abdi Rahman",
    rating: "4.8",
  },
  {
    id: 3,
    title: "Prime Commercial Land",
    type: "land",
    location: "Waberi, Mogadishu",
    price: "$180,000",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    specs: { area: "1,200 m\u00B2", zoning: "Commercial", title: "Clear" },
    badge: "HOT",
    brokerInitials: "SL",
    brokerName: "Sahal Lands",
    rating: "4.7",
  },
  {
    id: 4,
    title: "Range Rover Sport",
    type: "vehicle",
    location: "Mogadishu, Banaadir",
    price: "$72,000",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80",
    specs: { fuel: "Petrol", year: 2023, transmission: "Automatic" },
    badge: "NEW",
    brokerInitials: "FA",
    brokerName: "Faisal Ali",
    rating: "4.8",
  },
  {
    id: 5,
    title: "Modern 3-Bedroom Apartment",
    type: "property",
    location: "Jigjiga Yar, Hargeisa",
    price: "$750/mo",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    specs: { beds: 3, baths: 2, size: "150 m\u00B2" },
    badge: "FOR RENT",
    brokerInitials: "FY",
    brokerName: "Faisal Yusuf",
    rating: "4.6",
  },
  {
    id: 6,
    title: "Residential Plot near Airport",
    type: "land",
    location: "Hamar Jajab, Mogadishu",
    price: "$95,000",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    specs: { area: "600 m\u00B2", zoning: "Residential", title: "Clear" },
    badge: "NEW",
    brokerInitials: "KA",
    brokerName: "Khadra Ahmed",
    rating: "4.9",
  },
]

type ListingType = "vehicle" | "property" | "land"

function ListingSpecs({ type, specs }: { type: ListingType; specs: Record<string, string | number> }) {
  if (type === "vehicle") {
    return (
      <div className="flex items-center gap-5 py-3 border-t border-white/10 text-sm text-white/60">
        <span className="flex items-center gap-1.5"><Car className="w-4 h-4" /> {specs.fuel as string}</span>
        <span>{String(specs.year)}</span>
        <span>{specs.transmission as string}</span>
      </div>
    )
  }
  if (type === "property") {
    return (
      <div className="flex items-center gap-5 py-3 border-t border-white/10 text-sm text-white/60">
        <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {String(specs.beds)} Beds</span>
        <span>{String(specs.baths)} Baths</span>
        <span>{specs.size as string}</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-5 py-3 border-t border-white/10 text-sm text-white/60">
      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {specs.area as string}</span>
      <span>{specs.zoning as string}</span>
      <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-400" /> {specs.title as string}</span>
    </div>
  )
}

function ListingBadge({ type }: { type: ListingType }) {
  const colors: Record<ListingType, string> = {
    vehicle: "bg-sky-500",
    property: "bg-indigo-500",
    land: "bg-emerald-500",
  }
  const labels: Record<ListingType, string> = {
    vehicle: "VEHICLE",
    property: "PROPERTY",
    land: "LAND",
  }
  return (
    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg ${colors[type]} text-[10px] font-bold text-white shadow-md flex items-center gap-1`}>
      <Shield className="w-3 h-3" /> {labels[type]}
    </span>
  )
}

export default function EtherealBeamsHero() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const next = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % FEATURED_LISTINGS.length)
  }, [])

  const prev = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + FEATURED_LISTINGS.length) % FEATURED_LISTINGS.length)
  }, [])

  const goTo = useCallback((index: number) => {
    setCurrentIdx(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }, [])

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(next, 3500)
    return () => clearInterval(timer)
  }, [isAutoPlaying, next])

  const item = FEATURED_LISTINGS[currentIdx]
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Beams Background */}
      <div className="absolute inset-0 z-0">
        <Beams
          beamWidth={2.5}
          beamHeight={18}
          beamNumber={15}
          lightColor="#ffffff"
          speed={2.5}
          noiseIntensity={2}
          scale={0.15}
          rotation={43}
        />
      </div>

      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

      {/* Main Content — Side by Side */}
      <div className="relative z-10 flex h-full min-h-screen items-center pt-24 pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex items-center gap-12">

          {/* LEFT — Text Content */}
          <div className="flex-1 flex flex-col gap-5 max-w-xl">
            {/* Badge */}
            <div className="hero-fade-in inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-md w-fit" style={{ animationDelay: "0.3s" }}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-400" />
              </span>
              Escrow-backed car trading
            </div>

            {/* Headline */}
            <h1 className="hero-fade-in text-4xl font-black uppercase leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl" style={{ animationDelay: "0.45s" }}>
              <span className="hero-shimmer inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-300 to-sky-400 bg-[length:200%_auto]">
                Dalaal-Prime Web/App
              </span>
              <br />
              <span className="text-white">For</span>{" "}
              <span className="text-white">All</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-fade-in text-sm text-white/70 md:text-base leading-relaxed max-w-md" style={{ animationDelay: "0.6s" }}>
              Buy and sell cars with complete confidence. Every transaction is secured through verified escrow so both sides are always protected.
            </p>

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-2.5">
              {FEATURES.map((f, i) => {
                const Icon = f.icon
                return (
                  <div key={f.text} className="hero-fade-in flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm" style={{ animationDelay: `${0.7 + i * 0.08}s` }}>
                    <Icon className="h-3.5 w-3.5 text-sky-300" />
                    {f.text}
                  </div>
                )
              })}
            </div>

            {/* Search Bar */}
            <div className="hero-fade-in flex w-full items-center gap-3 rounded-2xl bg-white/10 p-2 backdrop-blur-xl shadow-lg" style={{ animationDelay: "0.95s" }}>
              <div className="flex flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm text-zinc-500 shadow-sm">
                <Search className="h-4 w-4 shrink-0 text-zinc-400" />
                <span className="truncate">Search by make, model, or keyword</span>
              </div>
              <button className="rounded-xl bg-sky-400 px-6 py-3 font-bold text-sm text-white shadow-lg shadow-sky-400/25 hover:bg-sky-300 hover:scale-105 active:scale-95 transition-all duration-200 inline-flex items-center justify-center">
                Search
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>

            {/* How It Works — 3 Steps */}
            <div className="flex gap-4 pt-1">
              {HOW_IT_WORKS.map((step, i) => (
                <div key={step.step} className="hero-fade-in flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 backdrop-blur-sm" style={{ animationDelay: `${1.1 + i * 0.1}s` }}>
                  <span className="text-[10px] font-black text-sky-400 bg-sky-400/15 rounded-md px-1.5 py-0.5">{step.step}</span>
                  <div>
                    <span className="text-xs font-bold text-white block leading-tight">{step.title}</span>
                    <span className="text-[10px] text-white/45">{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* App Download */}
            <div className="flex items-center gap-3 pt-1">
              <div className="hero-fade-in flex items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-3 py-2 backdrop-blur-sm" style={{ animationDelay: "1.4s" }}>
                <Smartphone className="w-4 h-4 text-white/70" />
                <div>
                  <span className="text-[9px] text-white/45 block leading-tight">Download on</span>
                  <span className="text-xs font-bold text-white">App Store</span>
                </div>
              </div>
              <div className="hero-fade-in flex items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-3 py-2 backdrop-blur-sm" style={{ animationDelay: "1.48s" }}>
                <Play className="w-4 h-4 text-white/70 fill-white/70" />
                <div>
                  <span className="text-[9px] text-white/45 block leading-tight">Get it on</span>
                  <span className="text-xs font-bold text-white">Google Play</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-5 pt-1">
              {STATS.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="hero-fade-in flex items-center gap-2" style={{ animationDelay: `${1.6 + i * 0.06}s` }}>
                    <Icon className="h-3.5 w-3.5 text-sky-300" />
                    <span className="text-xs font-bold text-white">{stat.value}</span>
                    <span className="text-[10px] text-white/45">{stat.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT — Car Card Slider */}
          <div className="hero-fade-in-right hidden lg:flex flex-1 justify-center items-center" style={{ animationDelay: "0.5s" }}>
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-4 bg-sky-400/10 rounded-3xl blur-2xl" />

              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-[10px] p-6 shadow-2xl">
                {/* Listing Image */}
                <div className="relative rounded-[10px] overflow-hidden mb-5">
                  <img
                    key={item.id}
                    src={item.image}
                    alt={item.title}
                    className="w-full h-72 object-cover transition-opacity duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-sky-500 text-[10px] font-bold text-white shadow-md">
                    {item.badge}
                  </span>
                  <ListingBadge type={item.type} />
                </div>

                {/* Card Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-white/50" />
                        <span className="text-sm text-white/50">{item.location}</span>
                      </div>
                    </div>
                    <span className="text-2xl font-black text-sky-400">{item.price}</span>
                  </div>

                  {/* Specs — dynamic by type */}
                  <ListingSpecs type={item.type} specs={item.specs} />

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-sky-400 py-2.5 text-sm font-bold text-white hover:bg-sky-300 transition-colors">
                      <BadgeCheck className="w-4 h-4" /> {item.type === "property" ? "Inquire Now" : item.type === "land" ? "View Plot" : "Buy Now"}
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/15 py-2.5 px-4 text-sm font-bold text-white hover:bg-white/20 transition-colors">
                      <CreditCard className="w-4 h-4" /> {item.type === "property" ? "Rent" : "Finance"}
                    </button>
                  </div>

                  {/* Broker */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-[10px] font-bold text-white">{item.brokerInitials}</div>
                      <div>
                        <span className="text-sm font-semibold text-white/80 block leading-tight">{item.brokerName}</span>
                        <span className="text-[10px] text-white/40">Verified Dalaal Agent</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sky-400">
                      <Star className="w-3 h-3 fill-sky-400" />
                      <span className="text-xs font-bold">{item.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prev}
                className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dot Indicators */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {FEATURED_LISTINGS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === currentIdx
                        ? "bg-sky-400 w-6"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Trust Bar */}
      <div className="hero-fade-in-bottom absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-white/5 backdrop-blur-md" style={{ animationDelay: "1.2s" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Trusted by</span>
            {TRUSTED_BY.map((name) => (
              <span key={name} className="text-xs font-semibold text-white/60">{name}</span>
            ))}
          </div>
          <a href="/escrow" className="flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors">
            Learn how escrow works <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
