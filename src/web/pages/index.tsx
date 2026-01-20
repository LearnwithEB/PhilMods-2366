import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Text, MeshDistortMaterial, Stars, OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";

// Color palette
const VOID_PURPLE = "#1a0b2e";
const TERMINAL_GREEN = "#00ff41";
const ACCENT_PINK = "#ff41b4";

// Loading state component
function LoadingScreen({ onStart }: { onStart: () => void }) {
  const [loadingText, setLoadingText] = useState("");
  const [showButton, setShowButton] = useState(false);
  const fullText = "INITIALIZING GO MODS PROTOCOL...";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setLoadingText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowButton(true), 300);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a0b2e]">
      <div className="text-center">
        <div className="font-mono text-[#00ff41] text-lg md:text-2xl mb-8 h-8">
          {loadingText}
          <span className="animate-pulse">_</span>
        </div>
        <div className="flex gap-2 justify-center mb-12">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-[#00ff41] rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        {showButton && (
          <button
            onClick={onStart}
            className="relative px-8 py-4 font-mono text-lg text-[#1a0b2e] bg-[#00ff41] border-2 border-[#00ff41] 
                       hover:bg-transparent hover:text-[#00ff41] transition-all duration-300
                       animate-[fadeIn_0.5s_ease-out] shadow-[0_0_30px_rgba(0,255,65,0.5)]
                       hover:shadow-[0_0_50px_rgba(0,255,65,0.8)]"
          >
            [ START SYSTEM ]
          </button>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// Status beacon component
function StatusBeacon() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="fixed top-4 right-4 z-40 cursor-pointer"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className={`flex items-center gap-3 bg-[#0d0618]/90 backdrop-blur-sm border border-[#00ff41]/30 
                       px-4 py-2 font-mono text-xs text-[#00ff41] transition-all duration-500
                       ${expanded ? 'pr-6' : ''}`}>
        <div className="relative">
          <div className="w-2 h-2 bg-[#00ff41] rounded-full" />
          <div className="absolute inset-0 w-2 h-2 bg-[#00ff41] rounded-full animate-ping" />
        </div>
        <span>STATUS: ONLINE</span>
        <span className="text-[#00ff41]/60">|</span>
        <span>OPEN TO COMMISSION</span>
        {expanded && (
          <a 
            href="mailto:mcrevatis03@gmail.com" 
            className="ml-2 text-[#ff41b4] hover:underline animate-[fadeIn_0.3s]"
          >
            mcrevatis03@gmail.com
          </a>
        )}
      </div>
    </div>
  );
}

// 3D Wireframe Sphere
function WireframeSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 2]} />
      <meshBasicMaterial color={TERMINAL_GREEN} wireframe transparent opacity={0.8} />
    </mesh>
  );
}

// Holographic Emitter Platform
function HolographicEmitter() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} position={[0, -0.5, 0]}>
        {/* Base platform */}
        <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[2, 2.2, 0.3, 32]} />
          <meshStandardMaterial color="#2a1848" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glowing ring */}
        <mesh position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.05, 16, 100]} />
          <meshBasicMaterial color={TERMINAL_GREEN} />
        </mesh>
        {/* Holographic projection */}
        <WireframeSphere />
        {/* Light beam effect */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.3, 1.5, 2, 32, 1, true]} />
          <meshBasicMaterial color={TERMINAL_GREEN} transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Float>
  );
}

// Floating Project Screen
function ProjectScreen({ position, rotation, title, subtitle }: { 
  position: [number, number, number]; 
  rotation?: [number, number, number];
  title: string;
  subtitle: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.002;
    }
  });

  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      <mesh ref={meshRef}>
        <planeGeometry args={[4, 2.5]} />
        <meshBasicMaterial color="#0d0618" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[3.8, 2.3]} />
        <meshBasicMaterial color="#1a0b2e" />
      </mesh>
      {/* Border glow */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[4.1, 2.6]} />
        <meshBasicMaterial color={TERMINAL_GREEN} transparent opacity={0.3} />
      </mesh>
      <Text
        position={[0, 0.4, 0.02]}
        fontSize={0.35}
        color={TERMINAL_GREEN}
        font="/fonts/mono.woff"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
      <Text
        position={[0, -0.2, 0.02]}
        fontSize={0.15}
        color="#888"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
      >
        {subtitle}
      </Text>
    </group>
  );
}

// Main 3D Scene
function Scene({ scrollProgress, started }: { scrollProgress: number; started: boolean }) {
  const { camera } = useThree();
  const cameraRef = useRef(camera);

  useEffect(() => {
    if (started) {
      gsap.to(camera.position, {
        z: 8,
        duration: 2,
        ease: "power2.inOut",
      });
    }
  }, [started, camera]);

  useFrame(() => {
    // Scroll-based camera movement through the tunnel
    const targetZ = 8 - scrollProgress * 40;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color={TERMINAL_GREEN} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={ACCENT_PINK} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Hero section - Workbench with holographic emitter */}
      <group position={[0, 0, 0]}>
        <HolographicEmitter />
      </group>

      {/* Project tunnel screens */}
      <ProjectScreen
        position={[-5, 1, -15]}
        rotation={[0, 0.3, 0]}
        title="CHARACTER RIGS"
        subtitle="Custom skeletal systems for games & animation"
      />
      <ProjectScreen
        position={[5, -0.5, -25]}
        rotation={[0, -0.3, 0]}
        title="ENVIRONMENT DESIGN"
        subtitle="Immersive worlds built for the metaverse"
      />
      <ProjectScreen
        position={[-4, 0.5, -35]}
        rotation={[0, 0.2, 0]}
        title="PROCESS & TOPOLOGY"
        subtitle="Clean mesh flow, optimized for production"
      />

      {/* Additional floating elements in tunnel */}
      {[...Array(20)].map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10,
          -10 - i * 3
        ]}>
          <octahedronGeometry args={[0.1 + Math.random() * 0.2]} />
          <meshBasicMaterial color={i % 2 === 0 ? TERMINAL_GREEN : ACCENT_PINK} wireframe />
        </mesh>
      ))}
    </>
  );
}

// Terminal Console
function TerminalConsole({ nostalgiaMode, onToggle }: { nostalgiaMode: boolean; onToggle: () => void }) {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = `> SYSTEM ONLINE
> MISSION: Bringing ideas to life through innovative 3D creation
> SPECIALIZATION: Character Rigs | Environment Design | Game Assets
> STATUS: Ready for collaboration`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, []);

  const terminalColor = nostalgiaMode ? "#ff41b4" : "#00ff41";

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div 
        className="border-2 rounded-lg p-6 font-mono text-sm md:text-base transition-all duration-500"
        style={{ 
          borderColor: terminalColor,
          backgroundColor: "#0d0618",
          boxShadow: `0 0 30px ${terminalColor}33`
        }}
      >
        <div className="flex items-center gap-2 mb-4 pb-4 border-b" style={{ borderColor: `${terminalColor}33` }}>
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: terminalColor }} />
          <span className="ml-4 text-xs" style={{ color: terminalColor }}>go_mods_console.exe</span>
        </div>
        <pre className="whitespace-pre-wrap leading-relaxed" style={{ color: terminalColor }}>
          {displayedText}
          <span className="animate-pulse">█</span>
        </pre>
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={onToggle}
            className="px-4 py-2 text-xs border rounded transition-all duration-300 hover:scale-105"
            style={{ 
              borderColor: terminalColor, 
              color: terminalColor,
              backgroundColor: nostalgiaMode ? `${terminalColor}22` : 'transparent'
            }}
          >
            [ NOSTALGIA MODE: {nostalgiaMode ? 'ON' : 'OFF'} ]
          </button>
        </div>
      </div>
    </div>
  );
}

// Mobile fallback (simpler visuals)
function MobileFallback({ scrollProgress }: { scrollProgress: number }) {
  return (
    <div className="min-h-screen bg-[#1a0b2e] text-white">
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#00ff41] rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-center mb-4 tracking-tighter">
          <span className="text-[#00ff41]">GO</span> MODS
        </h1>
        <p className="text-center text-[#00ff41]/70 font-mono text-sm md:text-base max-w-md">
          Innovative 3D Modeling & Animation<br />Ready for the Metaverse
        </p>
        <div className="mt-12 animate-bounce text-[#00ff41]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>
    </div>
  );
}

// Main Index component
function Index() {
  const [started, setStarted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [nostalgiaMode, setNostalgiaMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || !window.WebGLRenderingContext);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStart = () => {
    setStarted(true);
  };

  if (isMobile) {
    return (
      <>
        <StatusBeacon />
        <MobileFallback scrollProgress={scrollProgress} />
      </>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {!started && <LoadingScreen onStart={handleStart} />}
      <StatusBeacon />

      {/* Fixed 3D Canvas */}
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: VOID_PURPLE }}
        >
          <Suspense fallback={null}>
            <Scene scrollProgress={scrollProgress} started={started} />
          </Suspense>
        </Canvas>
      </div>

      {/* Scrollable content overlay */}
      <div className="relative z-10">
        {/* Hero section */}
        <section className="h-screen flex flex-col items-center justify-center pointer-events-none">
          <h1 className="text-7xl md:text-[12rem] font-black tracking-[-0.05em] text-white/90 leading-none text-center">
            <span className="text-[#00ff41]">GO</span> MODS
          </h1>
          <p className="mt-6 text-center font-mono text-[#00ff41]/80 text-sm md:text-lg tracking-wider">
            Innovative 3D Modeling & Animation
          </p>
          <p className="mt-2 text-center font-mono text-white/50 text-xs md:text-sm">
            Ready for the Metaverse
          </p>
          <div className="mt-20 animate-bounce text-[#00ff41]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Spacer for scroll tunnel */}
        <div className="h-[300vh]" />

        {/* About Console Section */}
        <section className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-t from-[#0d0618] to-transparent">
          <TerminalConsole nostalgiaMode={nostalgiaMode} onToggle={() => setNostalgiaMode(!nostalgiaMode)} />
        </section>

        {/* Footer */}
        <footer className="py-12 text-center font-mono text-[#00ff41]/50 text-xs bg-[#0d0618]">
          <p>© 2024 GO MODS — All systems operational</p>
          <p className="mt-2">
            <a href="mailto:mcrevatis03@gmail.com" className="hover:text-[#00ff41] transition-colors">
              mcrevatis03@gmail.com
            </a>
          </p>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@400;700;900&display=swap');
        
        body {
          font-family: 'Orbitron', sans-serif;
          background: ${VOID_PURPLE};
          overflow-x: hidden;
        }
        
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${VOID_PURPLE};
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${TERMINAL_GREEN}44;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${TERMINAL_GREEN}88;
        }
      `}</style>
    </div>
  );
}

export default Index;
