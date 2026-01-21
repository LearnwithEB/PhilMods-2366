import { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars, useGLTF } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";

// Color palette
const VOID_PURPLE = "#1a0b2e";
const TERMINAL_GREEN = "#ff41b4";
const ACCENT_PINK = "#ff41b4";

// Boot sequence lines
const BOOT_SEQUENCE = [
  "INITIALIZING PHILMODS PROTOCOL...",
  "LOADING CREATIVE SYSTEMS...",
  "CALIBRATING 3D RENDER ENGINE...",
  "SYNCING METAVERSE PROTOCOLS...",
  "READY FOR COMMISSION"
];

// Project data
const PROJECTS = [
  {
    id: 1,
    title: "GOAT CHARACTER V1",
    techSpecs: "Blender | Unreal Engine | Game-Ready",
    polycount: "???",
    textures: "Loading...",
    rigged: "In Progress",
    description: "Something special is cooking... 🐐 First character model dropping soon. Watch this space evolve!",
    status: "wip"
  },
  {
    id: 2,
    title: "ENVIRONMENT PACK",
    techSpecs: "Blender | Unity | Modular",
    polycount: "???",
    textures: "Processing...",
    rigged: "N/A",
    description: "Building immersive worlds one vertex at a time. New environments materializing...",
    status: "coming"
  },
  {
    id: 3,
    title: "CHARACTER RIGGING DEMO",
    techSpecs: "Blender | Maya | Animation-Ready",
    polycount: "???",
    textures: "Rendering...",
    rigged: "Calculating...",
    description: "Loading creativity... Rigging showcase coming soon. Stay tuned for the full story!",
    status: "coming"
  },
  {
    id: 4,
    title: "UNREAL ENGINE REAL-TIME",
    techSpecs: "Unreal Engine 5 | Nanite | Lumen",
    polycount: "∞",
    textures: "Buffering...",
    rigged: "Pending",
    description: "New projects materializing... Real-time rendering demo in the works. More coming soon...",
    status: "coming"
  }
];

// Floating badges
const BADGES = [
  "BLENDER",
  "RIGGING",
  "GAME READY ASSETS"
];

// Loading state component with detailed boot sequence
function LoadingScreen({ onStart }: { onStart: () => void }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [currentChar, setCurrentChar] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (currentLine >= BOOT_SEQUENCE.length) {
      setTimeout(() => setShowButton(true), 500);
      return;
    }

    const line = BOOT_SEQUENCE[currentLine];
    if (currentChar <= line.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => {
          const newLines = [...prev];
          newLines[currentLine] = line.slice(0, currentChar);
          return newLines;
        });
        setCurrentChar(c => c + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine(l => l + 1);
        setCurrentChar(0);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, currentChar]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a0b2e] cursor-crosshair-green">
      <div className="text-left max-w-2xl w-full px-8">
        <div className="border border-[#ff41b4]/30 bg-[#0d0618]/80 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#ff41b4]/20">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff41b4]" />
            <span className="ml-3 font-mono text-[#ff41b4]/60 text-xs">boot_sequence.exe</span>
          </div>
          <div className="font-mono text-[#ff41b4] text-sm md:text-base space-y-2 min-h-[180px]">
            {displayedText.map((line, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[#ff41b4]/50">&gt;</span>
                <span className={i === displayedText.length - 1 && currentLine < BOOT_SEQUENCE.length ? '' : 'opacity-70'}>
                  {line}
                </span>
                {i === currentLine && currentLine < BOOT_SEQUENCE.length && (
                  <span className="animate-pulse">█</span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2 justify-center mt-8 mb-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#ff41b4] rounded-full"
              style={{ 
                opacity: i <= currentLine ? 1 : 0.2,
                transition: 'opacity 0.3s'
              }}
            />
          ))}
        </div>
        
        {showButton && (
          <div className="flex justify-center">
            <button
              onClick={onStart}
              className="relative px-10 py-4 font-mono text-lg text-[#1a0b2e] bg-[#ff41b4] border-2 border-[#ff41b4] 
                         hover:bg-transparent hover:text-[#ff41b4] transition-all duration-300
                         animate-[fadeIn_0.5s_ease-out] shadow-[0_0_30px_rgba(255,65,180,0.5)]
                         hover:shadow-[0_0_50px_rgba(255,65,180,0.8)] cursor-pointer"
            >
              [ START SYSTEM ]
            </button>
          </div>
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
      <div className={`flex items-center gap-3 bg-[#0d0618]/90 backdrop-blur-sm border border-[#ff41b4]/30 
                       px-4 py-2 font-mono text-xs text-[#ff41b4] transition-all duration-500
                       ${expanded ? 'pr-6' : ''}`}>
        <div className="relative">
          <div className="w-2 h-2 bg-[#ff41b4] rounded-full" />
          <div className="absolute inset-0 w-2 h-2 bg-[#ff41b4] rounded-full animate-ping" />
        </div>
        <span>STATUS: ONLINE</span>
        <span className="text-[#ff41b4]/60">|</span>
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

// Project Modal
function ProjectModal({ project, onClose, wireframeMode, onToggleWireframe }: { 
  project: typeof PROJECTS[0] | null; 
  onClose: () => void;
  wireframeMode: boolean;
  onToggleWireframe: () => void;
}) {
  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#0d0618]/95 border border-[#ff41b4]/40 rounded-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#ff41b4]/20">
          <h3 className="font-mono text-[#ff41b4] text-xl">{project.title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#ff41b4] hover:bg-[#ff41b4]/20 rounded transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Content */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* 3D Viewer Area */}
          <div className="aspect-square bg-[#1a0b2e] rounded-lg border border-[#ff41b4]/20 relative overflow-hidden">
            <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[5, 5, 5]} intensity={1} color={TERMINAL_GREEN} />
              <Float speed={2} rotationIntensity={0.5}>
                <mesh>
                  <dodecahedronGeometry args={[1, 0]} />
                  {wireframeMode ? (
                    <meshBasicMaterial color={TERMINAL_GREEN} wireframe />
                  ) : (
                    <meshStandardMaterial color={TERMINAL_GREEN} metalness={0.5} roughness={0.3} />
                  )}
                </mesh>
              </Float>
              <Stars radius={50} depth={20} count={1000} factor={2} fade />
            </Canvas>
            
            {/* Wireframe Toggle */}
            <button
              onClick={onToggleWireframe}
              className="absolute bottom-4 right-4 px-4 py-2 font-mono text-xs text-[#ff41b4] border border-[#ff41b4]/50 
                         bg-[#0d0618]/80 hover:bg-[#ff41b4]/20 rounded transition-all"
            >
              {wireframeMode ? '[ SOLID VIEW ]' : '[ WIREFRAME ]'}
            </button>
          </div>
          
          {/* Project Info */}
          <div className="space-y-6">
            <p className="font-mono text-white/70 text-sm leading-relaxed">
              {project.description}
            </p>
            
            <div className="space-y-3">
              <div className="font-mono text-xs text-[#ff41b4]/60 uppercase tracking-wider">Tech Specs</div>
              <div className="text-[#ff41b4] font-mono text-sm">{project.techSpecs}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#1a0b2e] border border-[#ff41b4]/20 rounded-lg p-3">
                <div className="font-mono text-[#ff41b4]/50 text-xs mb-1">Polycount</div>
                <div className="font-mono text-[#ff41b4] text-sm">{project.polycount}</div>
              </div>
              <div className="bg-[#1a0b2e] border border-[#ff41b4]/20 rounded-lg p-3">
                <div className="font-mono text-[#ff41b4]/50 text-xs mb-1">Textures</div>
                <div className="font-mono text-[#ff41b4] text-sm">{project.textures}</div>
              </div>
              <div className="bg-[#1a0b2e] border border-[#ff41b4]/20 rounded-lg p-3">
                <div className="font-mono text-[#ff41b4]/50 text-xs mb-1">Rigged</div>
                <div className="font-mono text-[#ff41b4] text-sm">{project.rigged}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Project Capsule Card
function ProjectCapsule({ project, delay, onSelect }: { 
  project: typeof PROJECTS[0]; 
  delay: number;
  onSelect: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isComingSoon = project.status === "coming";
  const isWip = project.status === "wip";
  
  return (
    <div
      className={`relative group cursor-pointer transition-all duration-500 
                  ${isHovered ? 'scale-110 z-10' : 'scale-100'}`}
      style={{ 
        animation: `floatCapsule 6s ease-in-out infinite ${delay * 100}ms`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* Glass morphism container */}
      <div className={`relative p-6 rounded-xl border transition-all duration-500
                       bg-[#0d0618]/40 backdrop-blur-md
                       ${isHovered 
                         ? 'border-[#ff41b4]/80 shadow-[0_0_40px_rgba(255,65,180,0.4)]' 
                         : 'border-[#ff41b4]/30 shadow-[0_0_20px_rgba(255,65,180,0.1)]'}`}>
        
        {/* Status Badge */}
        {isWip && (
          <div className="absolute -top-2 -right-2 z-20">
            <div className="relative px-3 py-1 font-mono text-[10px] text-[#1a0b2e] bg-[#ff41b4] rounded-full 
                           shadow-[0_0_15px_rgba(255,65,180,0.6)] animate-pulse">
              <span className="relative flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#1a0b2e] rounded-full animate-ping" />
                WORK IN PROGRESS
              </span>
            </div>
          </div>
        )}
        
        {isComingSoon && (
          <div className="absolute -top-2 -right-2 z-20">
            <div className="relative px-3 py-1 font-mono text-[10px] text-[#ff41b4] bg-[#1a0b2e] border border-[#ff41b4]/50 rounded-full 
                           shadow-[0_0_10px_rgba(255,65,180,0.3)]">
              <span className="flex items-center gap-1.5">
                <span className="inline-block animate-spin" style={{ animationDuration: '3s' }}>⟳</span>
                COMING SOON
              </span>
            </div>
          </div>
        )}
        
        {/* Mini 3D preview */}
        <div className="w-full aspect-video bg-[#1a0b2e] rounded-lg mb-4 overflow-hidden relative">
          <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[3, 3, 3]} intensity={0.8} color={TERMINAL_GREEN} />
            <Float speed={isHovered ? 0.5 : 2} rotationIntensity={isHovered ? 0.2 : 0.5}>
              <mesh rotation={[0.5, 0, 0]}>
                <icosahedronGeometry args={[0.8, 1]} />
                <meshBasicMaterial color={TERMINAL_GREEN} wireframe opacity={isComingSoon ? 0.5 : 1} transparent />
              </mesh>
            </Float>
          </Canvas>
          
          {/* Coming soon overlay */}
          {isComingSoon && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1a0b2e]/60 backdrop-blur-[1px]">
              <div className="text-center">
                <div className="font-mono text-[#ff41b4]/80 text-xs animate-pulse">
                  [ LOADING CREATIVITY... ]
                </div>
                <div className="mt-2 flex justify-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-1.5 h-1.5 bg-[#ff41b4] rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* WIP progress bar */}
          {isWip && (
            <div className="absolute bottom-2 left-2 right-2">
              <div className="h-1 bg-[#ff41b4]/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#ff41b4] rounded-full animate-pulse"
                  style={{ width: '65%', boxShadow: '0 0 10px rgba(255,65,180,0.8)' }}
                />
              </div>
              <div className="font-mono text-[8px] text-[#ff41b4]/60 mt-1 text-right">
                BUILDING... 65%
              </div>
            </div>
          )}
          
          {/* Scan line effect */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="w-full h-px bg-[#ff41b4] animate-scanline" />
          </div>
        </div>
        
        {/* Title */}
        <h3 className={`font-mono text-lg mb-2 transition-colors duration-300
                        ${isHovered ? 'text-[#ff41b4]' : 'text-[#ff41b4]/80'}`}>
          {project.title}
        </h3>
        
        {/* Description */}
        <p className="font-mono text-xs text-white/60 mb-2 line-clamp-2">
          {project.description}
        </p>
        
        {/* Tech specs */}
        <p className="font-mono text-xs text-[#ff41b4]/50">
          {project.techSpecs}
        </p>
        
        {/* Hover indicator */}
        <div className={`absolute bottom-2 right-2 font-mono text-[10px] text-[#ff41b4]/60 
                         transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          [ CLICK TO EXPLORE ]
        </div>
      </div>
    </div>
  );
}

// Floating Badge
function FloatingBadge({ text, delay }: { text: string; delay: number }) {
  return (
    <div
      className="inline-block px-4 py-2 font-mono text-xs text-[#ff41b4] border border-[#ff41b4]/30 
                 rounded-full bg-[#0d0618]/60 backdrop-blur-sm whitespace-nowrap
                 animate-driftBadge"
      style={{ animationDelay: `${delay}s` }}
    >
      {text}
    </div>
  );
}

// Floating code particles
function CodeParticles({ count = 50 }: { count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 30,
      speed: 0.2 + Math.random() * 0.5,
      size: 0.1 + Math.random() * 0.15
    }));
  }, [count]);

  return (
    <group>
      {particles.map((particle) => (
        <FloatingCodeParticle key={particle.id} {...particle} />
      ))}
    </group>
  );
}

function FloatingCodeParticle({ x, y, z, speed, size }: { 
  x: number; y: number; z: number; speed: number; size: number 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = useRef(y);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = initialY.current + Math.sin(state.clock.elapsedTime * speed) * 2;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[x, y, z]}>
      <octahedronGeometry args={[size]} />
      <meshBasicMaterial color={TERMINAL_GREEN} wireframe transparent opacity={0.6} />
    </mesh>
  );
}

// MEOW Character 3D Model
function MeowCharacter({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/meow.gltf');
  
  useFrame((state) => {
    if (groupRef.current) {
      // Scroll-based Y rotation
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3 + scrollProgress * Math.PI * 2;
      // Subtle breathing-like movement
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef} scale={0.8} position={[0, 0, 0]}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

// Preload the MEOW model for optimization
useGLTF.preload('/meow.gltf');

// Loading fallback for 3D model
function ModelLoadingFallback() {
  return (
    <mesh>
      <icosahedronGeometry args={[0.8, 1]} />
      <meshBasicMaterial color={TERMINAL_GREEN} wireframe transparent opacity={0.5} />
    </mesh>
  );
}

// Holographic Emitter Platform
function HolographicEmitter({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Platform base */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2.2, 0.3, 32]} />
        <meshStandardMaterial color="#2a1848" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Glowing ring */}
      <mesh position={[0, -1.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.05, 16, 100]} />
        <meshBasicMaterial color={TERMINAL_GREEN} />
      </mesh>
      {/* MEOW Character Model */}
      <Suspense fallback={<ModelLoadingFallback />}>
        <MeowCharacter scrollProgress={scrollProgress} />
      </Suspense>
      {/* Holographic cone effect */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.3, 1.5, 2, 32, 1, true]} />
        <meshBasicMaterial color={TERMINAL_GREEN} transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Main 3D Scene
function Scene({ scrollProgress, started }: { scrollProgress: number; started: boolean }) {
  const { camera } = useThree();

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
    const targetZ = 8 - scrollProgress * 40;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
  });

  return (
    <>
      {/* Enhanced lighting for MEOW model */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color={TERMINAL_GREEN} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={ACCENT_PINK} />
      {/* Spotlight from above */}
      <spotLight 
        position={[0, 8, 5]} 
        intensity={2} 
        color={TERMINAL_GREEN} 
        angle={0.5} 
        penumbra={0.5}
        castShadow
      />
      {/* Rim light from behind */}
      <pointLight position={[0, 2, -5]} intensity={1} color={TERMINAL_GREEN} />
      {/* Front fill light */}
      <pointLight position={[0, 0, 5]} intensity={0.8} color="#ffffff" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <CodeParticles count={40} />
      <group position={[0, 0, 0]}>
        <HolographicEmitter scrollProgress={scrollProgress} />
      </group>

      {/* Tunnel elements */}
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

  const terminalColor = nostalgiaMode ? "#41f4ff" : "#ff41b4";

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
          <span className="ml-4 text-xs" style={{ color: terminalColor }}>philmods_console.exe</span>
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

// Process Viewer - Timeline slider
const PROCESS_STAGES = [
  { name: "Concept Sketch", icon: "✏️" },
  { name: "Blockout", icon: "📦" },
  { name: "Wireframe", icon: "🔷" },
  { name: "Textured", icon: "🎨" },
  { name: "Final Render", icon: "✨" }
];

function ProcessViewer() {
  const [stage, setStage] = useState(0);
  
  return (
    <div className="w-full max-w-2xl mx-auto p-6 border border-[#ff41b4]/30 rounded-xl bg-[#0d0618]/60">
      <h3 className="font-mono text-[#ff41b4] text-lg mb-6 text-center">[ PROCESS VIEWER ]</h3>
      
      {/* Stage display */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <span className="text-4xl">{PROCESS_STAGES[stage].icon}</span>
        <span className="font-mono text-[#ff41b4] text-xl">{PROCESS_STAGES[stage].name}</span>
      </div>
      
      {/* Timeline slider */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max="4"
          value={stage}
          onChange={(e) => setStage(parseInt(e.target.value))}
          className="w-full h-2 bg-[#1a0b2e] rounded-lg appearance-none cursor-pointer accent-[#ff41b4]
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ff41b4]
                     [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(255,65,180,0.6)]"
        />
        {/* Stage markers */}
        <div className="flex justify-between mt-2">
          {PROCESS_STAGES.map((s, i) => (
            <button
              key={i}
              onClick={() => setStage(i)}
              className={`text-xs font-mono transition-all ${i === stage ? 'text-[#ff41b4]' : 'text-white/30 hover:text-white/60'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-6 h-1 bg-[#1a0b2e] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#ff41b4] transition-all duration-300"
          style={{ width: `${(stage / 4) * 100}%` }}
        />
      </div>
    </div>
  );
}



// Matrix Rain Effect (Easter Egg)
function MatrixRain({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    
    const draw = () => {
      ctx.fillStyle = 'rgba(13, 6, 24, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#ff41b4';
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    
    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, [active]);
  
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="font-mono text-[#ff41b4] text-4xl mb-4 animate-pulse">MATRIX MODE</div>
        <div className="font-mono text-[#ff41b4]/60 text-sm">Press ESC to exit</div>
      </div>
    </div>
  );
}

// Wireframe Rat Component - Uses Intersection Observer for reliable trigger
function WireframeRat({ mitSectionEndRef }: { mitSectionEndRef: React.RefObject<HTMLDivElement | null>; contactSectionStartRef: React.RefObject<HTMLDivElement | null> }) {
  const [isRunning, setIsRunning] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [position, setPosition] = useState(-35);
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  const legRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  
  // Use Intersection Observer to trigger when MIT section is 50% visible
  useEffect(() => {
    if (!mitSectionEndRef.current || hasTriggered) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggered && !isRunning) {
            console.log('[RAT] 🐀 MIT section visible - STARTING RUN!');
            setHasTriggered(true);
            setIsRunning(true);
            setDirection('right');
            setPosition(-35);
            
            const startTime = Date.now();
            const duration = 5000; // 5 seconds to cross
            
            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              // Smooth easing
              const eased = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
              
              const newPos = -35 + (eased * 170); // -35vw to 135vw
              setPosition(newPos);
              legRef.current += 0.35;
              
              if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
              } else {
                setIsRunning(false);
                console.log('[RAT] 🐀 RUN COMPLETE');
              }
            };
            
            animationRef.current = requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% visible
    );
    
    observer.observe(mitSectionEndRef.current);
    
    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mitSectionEndRef, hasTriggered, isRunning]);
  
  // Reset when scrolled back to top
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent < 30 && hasTriggered && !isRunning) {
        setHasTriggered(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasTriggered, isRunning]);
  
  if (!isRunning) return null;
  
  const legAngle = Math.sin(legRef.current) * 35;
  const bodyBob = Math.sin(legRef.current * 2) * 10;
  
  return (
    <div 
      className="fixed pointer-events-none"
      style={{ 
        left: `${position}vw`, 
        top: '50vh',
        transform: `translateY(${bodyBob}px) scaleX(${direction === 'left' ? -1 : 1})`,
        zIndex: 99999
      }}
    >
      {/* Large glow backdrop */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '500px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(255,65,180,0.6) 0%, rgba(255,65,180,0.3) 40%, transparent 70%)',
          transform: 'translate(-150px, -150px)',
          filter: 'blur(40px)'
        }}
      />
      <svg 
        width="300" 
        height="200" 
        viewBox="0 0 80 50"
        style={{ 
          filter: 'drop-shadow(0 0 40px #ff41b4) drop-shadow(0 0 80px #ff41b4) drop-shadow(0 0 20px #ff41b4)'
        }}
      >
        {/* Body */}
        <ellipse 
          cx="35" cy="25" rx="20" ry="12" 
          fill="rgba(255,65,180,0.2)" 
          stroke="#ff41b4" 
          strokeWidth="2.5"
        />
        {/* Head */}
        <circle 
          cx="58" cy="22" r="10" 
          fill="rgba(255,65,180,0.2)" 
          stroke="#ff41b4" 
          strokeWidth="2.5"
        />
        {/* Ear */}
        <circle 
          cx="64" cy="14" r="5" 
          fill="rgba(255,65,180,0.2)" 
          stroke="#ff41b4" 
          strokeWidth="2"
        />
        {/* Second ear */}
        <circle 
          cx="56" cy="12" r="4" 
          fill="rgba(255,65,180,0.2)" 
          stroke="#ff41b4" 
          strokeWidth="2"
        />
        {/* Eye */}
        <circle cx="62" cy="20" r="2.5" fill="#ff41b4" />
        {/* Eye shine */}
        <circle cx="63" cy="19" r="1" fill="#fff" />
        {/* Nose */}
        <circle cx="68" cy="24" r="2" fill="#ff41b4" />
        {/* Whiskers */}
        <line x1="67" y1="24" x2="80" y2="18" stroke="#ff41b4" strokeWidth="1.5" />
        <line x1="67" y1="24" x2="80" y2="24" stroke="#ff41b4" strokeWidth="1.5" />
        <line x1="67" y1="24" x2="80" y2="30" stroke="#ff41b4" strokeWidth="1.5" />
        {/* Tail - wavy */}
        <path 
          d={`M 15 25 Q ${5 + Math.sin(legRef.current * 0.5) * 3} 15, 2 ${30 + Math.sin(legRef.current) * 5} Q ${-2 + Math.sin(legRef.current * 0.7) * 2} 42, 8 35`}
          fill="none" 
          stroke="#ff41b4" 
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Front leg */}
        <line 
          x1="45" y1="35" x2={45 + Math.sin(legAngle * Math.PI / 180) * 10} y2="50"
          stroke="#ff41b4" 
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Back leg */}
        <line 
          x1="25" y1="35" x2={25 + Math.sin(-legAngle * Math.PI / 180) * 12} y2="50"
          stroke="#ff41b4" 
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Second front leg */}
        <line 
          x1="50" y1="35" x2={50 + Math.sin(-legAngle * Math.PI / 180) * 10} y2="50"
          stroke="#ff41b4" 
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Second back leg */}
        <line 
          x1="30" y1="35" x2={30 + Math.sin(legAngle * Math.PI / 180) * 12} y2="50"
          stroke="#ff41b4" 
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Little feet */}
        <circle cx={45 + Math.sin(legAngle * Math.PI / 180) * 10} cy="49" r="2" fill="#ff41b4" />
        <circle cx={25 + Math.sin(-legAngle * Math.PI / 180) * 12} cy="49" r="2" fill="#ff41b4" />
        <circle cx={50 + Math.sin(-legAngle * Math.PI / 180) * 10} cy="49" r="2" fill="#ff41b4" />
        <circle cx={30 + Math.sin(legAngle * Math.PI / 180) * 12} cy="49" r="2" fill="#ff41b4" />
      </svg>
      {/* Squeak text bubble */}
      <div 
        className="absolute -top-16 left-20 font-mono text-[#ff41b4] text-2xl font-bold whitespace-nowrap"
        style={{ 
          animation: 'pulse 0.4s infinite',
          textShadow: '0 0 30px #ff41b4, 0 0 60px #ff41b4, 0 0 90px #ff41b4'
        }}
      >
        *squeak squeak!*
      </div>
      {/* Trail particles */}
      <div className="absolute -left-12 top-1/2 flex gap-3">
        {[0, 1, 2, 3, 4].map(i => (
          <div 
            key={i}
            className="w-4 h-4 rounded-full bg-[#ff41b4]"
            style={{
              opacity: 0.9 - i * 0.15,
              transform: `scale(${1 - i * 0.15})`,
              animation: `pulse ${0.3 + i * 0.1}s infinite`,
              boxShadow: '0 0 15px #ff41b4'
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Konami Code Hook
function useKonamiCode(callback: () => void) {
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = [...inputSequence, e.code].slice(-10);
      setInputSequence(newSequence);
      
      if (newSequence.join(',') === konamiCode.join(',')) {
        callback();
        setInputSequence([]);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputSequence, callback]);
}

// Commission Button with pulse
function CommissionButton() {
  return (
    <a
      href="mailto:mcrevatis03@gmail.com"
      className="relative inline-block mt-10 px-8 py-4 font-mono text-base md:text-lg 
                 text-[#ff41b4] bg-transparent border-2 border-[#ff41b4] 
                 hover:bg-[#ff41b4] hover:text-[#1a0b2e] transition-all duration-300
                 shadow-[0_0_20px_rgba(255,65,180,0.4)] hover:shadow-[0_0_40px_rgba(255,65,180,0.7)]
                 pointer-events-auto cursor-pointer commission-pulse"
    >
      [ COMMISSION TODAY ]
    </a>
  );
}

// Wireframe Character Display Component
function WireframeCharacterDisplay() {
  return (
    <div className="relative w-full max-w-lg mx-auto mb-8">
      {/* Glow effect behind image */}
      <div className="absolute inset-0 blur-3xl opacity-40 bg-gradient-radial from-[#ff41b4] to-transparent scale-110" />
      
      {/* Main image container */}
      <div className="relative wireframe-float">
        {/* Holographic border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#ff41b4]/30 via-[#ff41b4]/30 to-[#ff41b4]/30 rounded-xl blur-sm" />
        
        {/* Image */}
        <img 
          src="./wireframe-character.png" 
          alt="3D Wireframe Character"
          className="relative w-full h-auto rounded-lg shadow-[0_0_60px_rgba(255,65,180,0.3)]"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(255,65,180,0.4))'
          }}
        />
        
        {/* Scan line overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg opacity-30">
          <div className="absolute w-full h-1 bg-gradient-to-b from-transparent via-[#ff41b4] to-transparent animate-scanline" />
        </div>
        
        {/* Holographic grid overlay */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-lg opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(0deg, #ff41b4 1px, transparent 1px),
              linear-gradient(90deg, #ff41b4 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>
      
      {/* Tech label */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0d0618]/90 border border-[#ff41b4]/40 rounded-full">
        <span className="font-mono text-xs text-[#ff41b4]/80">[ WIREFRAME VIEW ]</span>
      </div>
    </div>
  );
}

// Discord Icon
function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

// ArtStation Icon
function ArtStationIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24-3.313a2.43 2.43 0 0 0-.453-1.424L15.86 1.438a2.425 2.425 0 0 0-2.163-1.33H9.543l12.371 21.444 1.657-2.868a2.422 2.422 0 0 0 .429-1.274v-3zm-7.257-4.905L9.857 1.548H9.54a2.425 2.425 0 0 0-2.163 1.33L0 19.043l2.027-3.505 9.743-16.89 2.792 4.838 2.181 3.776z"/>
    </svg>
  );
}

// LinkedIn Icon
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

// Contact Section - Open Network
function ContactSection({ contactSectionStartRef }: { contactSectionStartRef?: React.RefObject<HTMLDivElement | null> }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "cfc8e4c9-68f2-41af-b2be-b4a50df8f3a5",
          name: name,
          email: email,
          message: message,
          subject: `New Commission Inquiry from ${name}`,
          from_name: "PhilMods Portfolio",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setName("");
        setEmail("");
        setMessage("");
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMessage(result.message || "Something went wrong. Please try again.");
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch {
      setStatus('error');
      setErrorMessage("Network error. Please try again later.");
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact-form" className="min-h-screen relative py-20 px-4 overflow-hidden">
      {/* Ref marker for rat trigger - start of contact section */}
      {contactSectionStartRef && <div ref={contactSectionStartRef} className="absolute top-0 left-0 right-0 h-1" />}
      
      {/* Grid floor effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute bottom-0 left-0 right-0 h-64 opacity-30"
          style={{
            background: `
              linear-gradient(to top, #0d0618 0%, transparent 100%),
              linear-gradient(90deg, #ff41b4 1px, transparent 1px),
              linear-gradient(0deg, #ff41b4 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 40px 40px, 40px 40px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'bottom'
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section Header */}
        <h2 className="text-center font-mono text-[#ff41b4] text-2xl md:text-3xl mb-4">
          [ OPEN NETWORK ]
        </h2>
        <p className="text-center font-mono text-white/40 text-sm mb-12">
          Establish Connection
        </p>

        {/* Central Holographic Display */}
        <div className="mx-auto mb-12 max-w-md">
          <div className="relative p-6 border border-[#ff41b4]/40 rounded-xl bg-[#0d0618]/80 backdrop-blur-md
                          shadow-[0_0_40px_rgba(255,65,180,0.2)]">
            {/* Status display */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <div className="w-3 h-3 bg-[#ff41b4] rounded-full" />
                <div className="absolute inset-0 w-3 h-3 bg-[#ff41b4] rounded-full animate-ping" />
              </div>
              <span className="font-mono text-[#ff41b4] text-lg tracking-wider">
                STATUS: ONLINE | OPEN TO COMMISSION
              </span>
            </div>
            
            {/* Response time */}
            <div className="text-center font-mono text-white/50 text-sm border-t border-[#ff41b4]/20 pt-4">
              Response Time: <span className="text-[#ff41b4]">24-48 HR TURNAROUND</span>
            </div>
          </div>
        </div>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Discord & Social */}
          <div className="space-y-6">
            {/* Discord */}
            <a 
              href="https://discord.com/users/pheliabobelia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 border border-[#ff41b4]/30 rounded-lg bg-[#0d0618]/60
                         hover:border-[#ff41b4]/60 hover:bg-[#ff41b4]/5 transition-all group"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#5865F2] text-white">
                <DiscordIcon />
              </div>
              <div>
                <div className="font-mono text-[#ff41b4] text-sm">Discord</div>
                <div className="font-mono text-white/70 group-hover:text-[#ff41b4] transition-colors">
                  @pheliabobelia
                </div>
              </div>
            </a>

            {/* Email direct */}
            <a 
              href="mailto:mcrevatis03@gmail.com"
              className="flex items-center gap-4 p-4 border border-[#ff41b4]/30 rounded-lg bg-[#0d0618]/60
                         hover:border-[#ff41b4]/60 hover:bg-[#ff41b4]/5 transition-all group"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#ff41b4]/20 text-[#ff41b4]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="font-mono text-[#ff41b4] text-sm">Email</div>
                <div className="font-mono text-white/70 group-hover:text-[#ff41b4] transition-colors">
                  mcrevatis03@gmail.com
                </div>
              </div>
            </a>
          </div>

          {/* Email Form */}
          <div className="border border-[#ff41b4]/30 rounded-lg bg-[#0d0618]/60 p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#ff41b4]/20">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 rounded-full bg-[#ff41b4]" />
              <span className="ml-2 font-mono text-[#ff41b4]/60 text-xs">send_message.exe</span>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[#ff41b4]/60 text-xs mb-2">&gt; YOUR_NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={status === 'loading'}
                  className="w-full px-4 py-2 bg-[#1a0b2e] border border-[#ff41b4]/30 rounded font-mono text-white
                             focus:border-[#ff41b4] focus:outline-none focus:ring-1 focus:ring-[#ff41b4]/50
                             placeholder:text-white/30 disabled:opacity-50"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block font-mono text-[#ff41b4]/60 text-xs mb-2">&gt; YOUR_EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === 'loading'}
                  className="w-full px-4 py-2 bg-[#1a0b2e] border border-[#ff41b4]/30 rounded font-mono text-white
                             focus:border-[#ff41b4] focus:outline-none focus:ring-1 focus:ring-[#ff41b4]/50
                             placeholder:text-white/30 disabled:opacity-50"
                  placeholder="user@domain.com"
                />
              </div>
              <div>
                <label className="block font-mono text-[#ff41b4]/60 text-xs mb-2">&gt; MESSAGE</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  disabled={status === 'loading'}
                  className="w-full px-4 py-2 bg-[#1a0b2e] border border-[#ff41b4]/30 rounded font-mono text-white
                             focus:border-[#ff41b4] focus:outline-none focus:ring-1 focus:ring-[#ff41b4]/50
                             placeholder:text-white/30 resize-none disabled:opacity-50"
                  placeholder="Describe your project..."
                />
              </div>
              
              {/* Error message */}
              {status === 'error' && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded font-mono text-red-400 text-sm animate-[fadeIn_0.3s]">
                  ⚠ {errorMessage}
                </div>
              )}
              
              {/* Success message */}
              {status === 'success' && (
                <div className="p-3 bg-[#ff41b4]/10 border border-[#ff41b4]/30 rounded font-mono text-[#ff41b4] text-sm animate-[fadeIn_0.3s]">
                  ✓ Message sent! I'll get back to you within 24-48 hours.
                </div>
              )}
              
              <button
                type="submit"
                disabled={status === 'loading'}
                className={`w-full py-3 font-mono text-sm border-2 rounded transition-all relative overflow-hidden
                           ${status === 'success' 
                             ? 'bg-[#ff41b4] text-[#1a0b2e] border-[#ff41b4] shadow-[0_0_20px_rgba(255,65,180,0.5)]' 
                             : status === 'loading'
                             ? 'border-[#ff41b4]/50 text-[#ff41b4]/50 cursor-not-allowed'
                             : 'border-[#ff41b4] text-[#ff41b4] hover:bg-[#ff41b4] hover:text-[#1a0b2e]'}`}
              >
                {status === 'loading' && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-5 h-5 border-2 border-[#ff41b4]/30 border-t-[#ff41b4] rounded-full animate-spin" />
                  </span>
                )}
                <span className={status === 'loading' ? 'opacity-0' : ''}>
                  {status === 'success' ? '[ MESSAGE SENT! ]' : '[ TRANSMIT MESSAGE ]'}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="py-12 px-4 bg-[#0d0618] border-t border-[#ff41b4]/10">
      <div className="max-w-4xl mx-auto">
        {/* Main footer content */}
        <div className="text-center mb-8">
          <p className="font-mono text-[#ff41b4] text-lg mb-2">PHILMODS</p>
          <p className="font-mono text-white/50 text-sm">
            © 2026 PHILMODS | Bringing Ideas to Life Through Innovation
          </p>
          {/* Signature */}
          <div className="flex flex-col justify-center items-center gap-1 mt-4">
            <span 
              className="text-2xl"
              style={{ 
                color: '#8B4513',
                textShadow: '0 0 10px #00d9ff, 0 0 20px #00d9ff, 0 0 30px #00d9ff',
                filter: 'drop-shadow(0 0 12px #00d9ff)'
              }}
            >
              🖖🏾
            </span>
            <span 
              className="font-mono text-xs tracking-widest"
              style={{ 
                color: '#00d9ff',
                textShadow: '0 0 8px #00d9ff, 0 0 16px #00d9ff'
              }}
            >
              ELVTE
            </span>
          </div>
        </div>

        {/* Social icons */}
        <div className="flex justify-center gap-6">
          <a 
            href="https://discord.com/users/pheliabobelia"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#ff41b4]/30 
                       text-[#ff41b4] hover:bg-[#ff41b4]/10 hover:border-[#ff41b4]/60 transition-all"
          >
            <DiscordIcon />
          </a>
          <a 
            href="https://artstation.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#ff41b4]/30 
                       text-[#ff41b4] hover:bg-[#ff41b4]/10 hover:border-[#ff41b4]/60 transition-all"
          >
            <ArtStationIcon />
          </a>
          <a 
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#ff41b4]/30 
                       text-[#ff41b4] hover:bg-[#ff41b4]/10 hover:border-[#ff41b4]/60 transition-all"
          >
            <LinkedInIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}

// Services Data
const SERVICES = [
  {
    icon: "🎭",
    title: "Custom Character Modeling",
    description: "Bring your characters to life with detailed, game-ready 3D models featuring clean topology and optimized poly counts."
  },
  {
    icon: "🎮",
    title: "Game-Ready Asset Creation",
    description: "Production-quality assets optimized for real-time engines with proper LODs, collision, and material setup."
  },
  {
    icon: "🦴",
    title: "Rigging & Animation",
    description: "Advanced skeletal systems with IK/FK switching, facial rigs, and animation-ready setups for games and film."
  },
  {
    icon: "⚡",
    title: "Unreal Engine Integration",
    description: "Seamless integration with UE5 including Nanite, Lumen, MetaHumans, and real-time visualization."
  },
  {
    icon: "🔧",
    title: "Technical Art Consultation",
    description: "Expert guidance on pipelines, optimization strategies, and best practices for 3D production workflows."
  }
];

// Services Section
function ServicesSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, #ff41b4 0px, #ff41b4 1px, transparent 1px, transparent 60px),
                           repeating-linear-gradient(90deg, #ff41b4 0px, #ff41b4 1px, transparent 1px, transparent 60px)`
        }} />
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <h2 className="text-center font-mono text-[#ff41b4] text-2xl md:text-3xl mb-4">
          [ SERVICES ]
        </h2>
        <p className="text-center font-mono text-xl md:text-2xl text-white/80 mb-4 max-w-2xl mx-auto">
          Transforming Imagination into Immersive 3D Realities
        </p>
        <p className="text-center font-mono text-white/40 text-sm mb-16 max-w-xl mx-auto">
          At PhilMods, our mission is to bring your ideas to life through innovative 3D creation. We specialize in high-quality models and animations that cater to your unique requirements.
        </p>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {SERVICES.map((service, i) => (
            <div 
              key={i}
              className="p-6 border border-[#ff41b4]/20 rounded-xl bg-[#0d0618]/40 backdrop-blur-sm
                         hover:border-[#ff41b4]/50 hover:bg-[#ff41b4]/5 transition-all duration-300
                         group"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="font-mono text-[#ff41b4] text-lg mb-3 group-hover:text-[#ff41b4] transition-colors">
                {service.title}
              </h3>
              <p className="font-mono text-white/50 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* CTA */}
        <div className="text-center">
          <p className="font-mono text-white/60 text-lg mb-8 max-w-lg mx-auto">
            Ready to bring your vision to life? Let's create something extraordinary.
          </p>
          <button
            onClick={() => {
              document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-block px-10 py-4 font-mono text-lg text-[#1a0b2e] bg-[#ff41b4] 
                       border-2 border-[#ff41b4] hover:bg-transparent hover:text-[#ff41b4] 
                       transition-all duration-300 shadow-[0_0_30px_rgba(255,65,180,0.4)]
                       hover:shadow-[0_0_50px_rgba(255,65,180,0.6)] cursor-pointer"
          >
            [ START YOUR PROJECT ]
          </button>
        </div>
        
        {/* MIT Reality Hack Featured Achievement Section */}
        <div className="mt-24 relative">
          {/* Decorative top line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-[#ff41b4]/50 to-transparent" />
          
          <div className="text-center pt-12">
            {/* Achievement Badge Header */}
            <div className="inline-block mb-8">
              <div className="px-6 py-2 border border-[#00d9ff]/40 bg-[#00d9ff]/5 rounded-full backdrop-blur-sm
                             shadow-[0_0_20px_rgba(0,217,255,0.2)]">
                <span className="font-mono text-xs md:text-sm tracking-[0.3em] text-[#00d9ff] uppercase">
                  ✦ Featured Achievement ✦
                </span>
              </div>
            </div>
            
            {/* Title */}
            <h3 className="font-mono text-[#ff41b4] text-xl md:text-2xl mb-2 tracking-wide">
              MIT Reality Hack Art 2026
            </h3>
            <p className="font-mono text-white/60 text-sm md:text-base mb-8 tracking-wider uppercase">
              Selected Exhibitor
            </p>
            
            {/* Neon Sign Image with Glow Effects */}
            <div className="relative max-w-md mx-auto mb-10 group">
              {/* Outer glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#ff41b4]/20 via-[#00d9ff]/20 to-[#ff41b4]/20 
                             rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700
                             animate-pulse" style={{ animationDuration: '3s' }} />
              
              {/* Inner container with border */}
              <div className="relative border-2 border-[#ff41b4]/30 rounded-xl overflow-hidden 
                             bg-[#0d0618]/60 backdrop-blur-sm p-2
                             group-hover:border-[#ff41b4]/60 transition-all duration-500
                             shadow-[0_0_30px_rgba(255,65,180,0.3),0_0_60px_rgba(0,217,255,0.2)]
                             group-hover:shadow-[0_0_50px_rgba(255,65,180,0.5),0_0_80px_rgba(0,217,255,0.3)]">
                
                {/* The neon sign image */}
                <img 
                  src="./d6f928be-4a22-4345-b58d-3b2faa80947e.png" 
                  alt="MIT Reality Hack Neon Sign"
                  className="w-full h-auto rounded-lg
                            group-hover:scale-[1.02] transition-transform duration-700"
                />
                
                {/* Shimmer overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                               -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              </div>
              
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#00d9ff]/60" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#00d9ff]/60" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#ff41b4]/60" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#ff41b4]/60" />
            </div>
            
            {/* Profile Photo Placeholder */}
            <div className="relative max-w-[180px] mx-auto mb-6">
              {/* Decorative frame */}
              <div className="relative aspect-square rounded-full border-2 border-[#00d9ff]/40 
                             bg-[#0d0618]/80 backdrop-blur-sm overflow-hidden
                             shadow-[0_0_25px_rgba(0,217,255,0.2),inset_0_0_30px_rgba(0,217,255,0.1)]
                             group">
                {/* Inner decorative rings */}
                <div className="absolute inset-2 rounded-full border border-[#00d9ff]/20" />
                <div className="absolute inset-4 rounded-full border border-[#ff41b4]/10" />
                
                {/* Placeholder icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg 
                    className="w-16 h-16 text-[#00d9ff]/30" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                
                {/* Scan line effect */}
                <div className="absolute inset-0 opacity-30 pointer-events-none"
                     style={{
                       background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,217,255,0.03) 2px, rgba(0,217,255,0.03) 4px)'
                     }} />
              </div>
              
              {/* Animated ring around photo */}
              <div className="absolute -inset-1 rounded-full border border-[#00d9ff]/20 animate-pulse" 
                   style={{ animationDuration: '2s' }} />
            </div>
            
            {/* Name with Tron Blue styling */}
            <div className="relative inline-block">
              <h4 className="font-mono text-2xl md:text-3xl font-bold tracking-wider
                           text-[#00d9ff] 
                           drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]
                           hover:drop-shadow-[0_0_20px_rgba(0,217,255,0.8)]
                           transition-all duration-300">
                Mya Crevatis
              </h4>
              <div className="mt-2 w-24 h-px mx-auto bg-gradient-to-r from-transparent via-[#00d9ff]/50 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Mobile fallback
function MobileFallback({ onSelectProject, selectedProject, wireframeMode, onToggleWireframe, onCloseModal }: {
  onSelectProject: (project: typeof PROJECTS[0]) => void;
  selectedProject: typeof PROJECTS[0] | null;
  wireframeMode: boolean;
  onToggleWireframe: () => void;
  onCloseModal: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#1a0b2e] text-white">
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#ff41b4] rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        <h1 className="text-5xl md:text-8xl font-black text-center mb-4 tracking-tighter">
          <span className="text-[#ff41b4]">PHIL</span>MODS
        </h1>
        <p className="text-center text-[#ff41b4]/70 font-mono text-sm md:text-base max-w-md">
          Innovative 3D Modeling & Animation
        </p>
        <p className="text-center text-white/50 font-mono text-xs md:text-sm mt-2">
          Ready for the Metaverse
        </p>
        <CommissionButton />
      </section>
      
      {/* Featured Wireframe Character */}
      <section className="py-20 px-4 flex flex-col items-center">
        <h2 className="text-center font-mono text-[#ff41b4] text-xl mb-8">[ FEATURED WORK ]</h2>
        <WireframeCharacterDisplay />
        <p className="mt-8 text-center font-mono text-white/50 text-sm max-w-md px-4">
          High-quality character models with clean topology, optimized for games
        </p>
      </section>
      
      {/* Projects */}
      <section className="py-20 px-4">
        <h2 className="text-center font-mono text-[#ff41b4] text-2xl mb-12">[ PROJECT CAPSULES ]</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {PROJECTS.map((project, i) => (
            <ProjectCapsule key={project.id} project={project} delay={i} onSelect={() => onSelectProject(project)} />
          ))}
        </div>
      </section>
      
      {/* Services Section */}
      <ServicesSection />
      
      {/* Contact Section */}
      <ContactSection />
      
      {/* Footer */}
      <Footer />
      
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={onCloseModal}
          wireframeMode={wireframeMode}
          onToggleWireframe={onToggleWireframe}
        />
      )}
    </div>
  );
}

// Main Index component
function Index() {
  const [started, setStarted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [nostalgiaMode, setNostalgiaMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [matrixMode, setMatrixMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mitSectionEndRef = useRef<HTMLDivElement>(null);
  const contactSectionStartRef = useRef<HTMLDivElement>(null);

  // Konami code easter egg
  useKonamiCode(() => setMatrixMode(true));
  
  // ESC to exit matrix mode
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && matrixMode) {
        setMatrixMode(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [matrixMode]);

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
        <MobileFallback 
          onSelectProject={setSelectedProject}
          selectedProject={selectedProject}
          wireframeMode={wireframeMode}
          onToggleWireframe={() => setWireframeMode(!wireframeMode)}
          onCloseModal={() => setSelectedProject(null)}
        />
      </>
    );
  }

  return (
    <div ref={containerRef} className="relative cursor-crosshair-green">
      {!started && <LoadingScreen onStart={handleStart} />}
      <StatusBeacon />
      <MatrixRain active={matrixMode} />
      <WireframeRat mitSectionEndRef={mitSectionEndRef} contactSectionStartRef={contactSectionStartRef} />

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
        <section className="min-h-screen flex flex-col items-center justify-center pointer-events-none py-20 px-4">
          <h1 className="text-5xl md:text-[8rem] font-black tracking-[-0.05em] text-white/90 leading-none text-center mb-8">
            <span className="text-[#ff41b4]">PHIL</span>MODS
          </h1>
          <p className="text-center font-mono text-[#ff41b4]/80 text-sm md:text-lg tracking-wider max-w-2xl px-4">
            Innovative 3D Modeling & Animation
          </p>
          <p className="mt-2 text-center font-mono text-white/50 text-xs md:text-sm mb-8">
            Ready for the Metaverse
          </p>
          <CommissionButton />
          <div className="mt-12 animate-bounce text-[#ff41b4]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Wireframe Character Showcase */}
        <section className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
          <h2 className="text-center font-mono text-[#ff41b4] text-xl md:text-2xl mb-12">
            [ FEATURED WORK ]
          </h2>
          <WireframeCharacterDisplay />
          <p className="mt-12 text-center font-mono text-white/50 text-sm max-w-lg">
            High-quality character models with clean topology, optimized for games and real-time rendering
          </p>
        </section>

        {/* Spacer for scroll tunnel */}
        <div className="h-[50vh]" />

        {/* Projects Section - The Creative Void */}
        <section className="min-h-screen py-20 px-4 relative">
          {/* Floating badges */}
          <div className="absolute top-10 left-0 right-0 overflow-hidden h-12 pointer-events-none">
            <div className="flex gap-8 animate-scrollBadges">
              {[...BADGES, ...BADGES].map((badge, i) => (
                <FloatingBadge key={i} text={badge} delay={i * 0.5} />
              ))}
            </div>
          </div>
          
          <h2 className="text-center font-mono text-[#ff41b4] text-2xl md:text-3xl mb-4 mt-16">
            [ THE CREATIVE VOID ]
          </h2>
          <p className="text-center font-mono text-white/40 text-sm mb-16">
            Project Capsules / Click to explore
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {PROJECTS.map((project, i) => (
              <ProjectCapsule 
                key={project.id} 
                project={project} 
                delay={i}
                onSelect={() => setSelectedProject(project)}
              />
            ))}
          </div>
          
          {/* Bottom floating badges */}
          <div className="absolute bottom-10 left-0 right-0 overflow-hidden h-12 pointer-events-none">
            <div className="flex gap-8 animate-scrollBadgesReverse">
              {[...BADGES, ...BADGES].map((badge, i) => (
                <FloatingBadge key={i} text={badge} delay={i * 0.3} />
              ))}
            </div>
          </div>
          
        </section>

        {/* Process Viewer Section */}
        <section className="py-20 px-4">
          <ProcessViewer />
        </section>

        {/* Services Section */}
        <ServicesSection />

        {/* About Console Section */}
        <section className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-t from-[#0d0618] to-transparent">
          <TerminalConsole nostalgiaMode={nostalgiaMode} onToggle={() => setNostalgiaMode(!nostalgiaMode)} />
        </section>

        {/* Rat trigger zone - after About Console, before Contact */}
        <div ref={mitSectionEndRef} className="h-16" />

        {/* Contact Section - Open Network */}
        <ContactSection contactSectionStartRef={contactSectionStartRef} />

        {/* Footer */}
        <Footer />
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)}
          wireframeMode={wireframeMode}
          onToggleWireframe={() => setWireframeMode(!wireframeMode)}
        />
      )}

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
        
        /* Custom neon green crosshair cursor */
        .cursor-crosshair-green {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cline x1='12' y1='0' x2='12' y2='10' stroke='%23ff41b4' stroke-width='2'/%3E%3Cline x1='12' y1='14' x2='12' y2='24' stroke='%23ff41b4' stroke-width='2'/%3E%3Cline x1='0' y1='12' x2='10' y2='12' stroke='%23ff41b4' stroke-width='2'/%3E%3Cline x1='14' y1='12' x2='24' y2='12' stroke='%23ff41b4' stroke-width='2'/%3E%3Ccircle cx='12' cy='12' r='3' stroke='%23ff41b4' stroke-width='1.5' fill='none'/%3E%3C/svg%3E") 12 12, crosshair;
        }

        /* Commission button pulse animation */
        .commission-pulse {
          animation: commissionPulse 2s ease-in-out infinite;
        }
        
        @keyframes commissionPulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255,65,180,0.4);
          }
          50% {
            box-shadow: 0 0 35px rgba(255,65,180,0.7), 0 0 60px rgba(255,65,180,0.3);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes floatCapsule {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes wireframeFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.02); }
        }
        
        .wireframe-float {
          animation: wireframeFloat 4s ease-in-out infinite;
        }
        
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(10000%); }
        }
        
        .animate-scanline {
          animation: scanline 4s linear infinite;
        }
        
        @keyframes scrollBadges {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-scrollBadges {
          animation: scrollBadges 20s linear infinite;
        }
        
        @keyframes scrollBadgesReverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        
        .animate-scrollBadgesReverse {
          animation: scrollBadgesReverse 25s linear infinite;
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
