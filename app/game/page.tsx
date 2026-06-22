"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sky, useGLTF } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import * as THREE from "three";
import HUD from "@/src/components/game/HUD";
import { usePlayerControls } from "@/src/hooks/usePlayerControls";
import { useGameStore } from "@/src/store/gameStore";

// ==========================================
// 1. O JOGADOR (KauAI)
// ==========================================
function Player() {
  const playerRef = useRef<any>(null);
  const controls = usePlayerControls();
  const { setPlayerPosition, isQuizOpen, isPiloting, jetPosition } = useGameStore();

  useFrame((state) => {
    if (!playerRef.current || isQuizOpen) return;

    // Se estiver pilotando, o jogador fica invisível e "amarrado" à posição do caça
    if (isPiloting) {
      playerRef.current.setTranslation({ x: jetPosition[0], y: jetPosition[1] + 2, z: jetPosition[2] }, true);
      return;
    }

    const velocity = playerRef.current.linvel();
    const position = playerRef.current.translation();
    const { forward, backward, left, right, jump } = controls;

    const direction = new THREE.Vector3();
    if (forward) direction.z -= 1;
    if (backward) direction.z += 1;
    if (left) direction.x -= 1;
    if (right) direction.x += 1;

    direction.normalize().multiplyScalar(12);
    
    playerRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);

    if (jump && Math.abs(velocity.y) < 0.1) {
      playerRef.current.setLinvel({ x: velocity.x, y: 10, z: velocity.z }, true);
    }

    const cameraTarget = new THREE.Vector3(position.x, position.y + 4, position.z + 12);
    state.camera.position.lerp(cameraTarget, 0.1);
    state.camera.lookAt(position.x, position.y + 1, position.z);

    setPlayerPosition([position.x, position.y, position.z]);
  });

  return (
    <RigidBody ref={playerRef} colliders="cuboid" mass={1} position={[0, 5, 0]} lockRotations>
      {/* Condicional para esconder o cubo quando estiver dentro do caça */}
      <mesh visible={!isPiloting}>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color="#00aaff" />
      </mesh>
    </RigidBody>
  );
}

// ==========================================
// 2. A INTELIGÊNCIA ARTIFICIAL (VeJiTAI)
// ==========================================
function RivalAI() {
  const rivalRef = useRef<any>(null);

  useFrame(() => {
    if (!rivalRef.current) return;
    const [px, py, pz] = useGameStore.getState().playerPosition;
    const rivalPos = rivalRef.current.translation();
    const currentVel = rivalRef.current.linvel();

    const direction = new THREE.Vector3(px - rivalPos.x, 0, pz - rivalPos.z);
    const distance = direction.length();

    if (distance > 6 && distance < 30) {
      direction.normalize().multiplyScalar(6);
      rivalRef.current.setLinvel({ x: direction.x, y: currentVel.y, z: direction.z }, true);
    } else if (distance <= 6) {
      rivalRef.current.setLinvel({ x: 0, y: currentVel.y, z: 0 }, true);
    }
  });

  return (
    <RigidBody ref={rivalRef} colliders="cuboid" mass={1} position={[8, 5, -8]} lockRotations>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color="#ff0077" />
      </mesh>
    </RigidBody>
  );
}

// ==========================================
// 3. BLOCO DE CONHECIMENTO
// ==========================================
function KnowledgeBlock({ position, id }: { position: [number, number, number], id: string }) {
  const [isCollected, setIsCollected] = useState(false);
  const openQuiz = useGameStore((state) => state.openQuiz);

  if (isCollected) return null;

  return (
    <RigidBody type="fixed" position={position} 
      onCollisionEnter={(e) => {
        if (e.other.rigidBodyObject && e.other.rigidBodyObject.name !== "ground") {
          openQuiz(id);
          setIsCollected(true);
        }
      }}
    >
      <mesh>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshToonMaterial color="#ffcc00" />
      </mesh>
    </RigidBody>
  );
}

// ==========================================
// 4. O CAÇA F-22 (Lógica de Voo Arcade)
// ==========================================
function FighterJet({ position }: { position: [number, number, number] }) {
  const jetRef = useRef<any>(null);
  const { scene } = useGLTF('/assets/models/f22/scene.gltf'); 
  const { isPiloting, togglePiloting, playerPosition, setJetPosition, setMission } = useGameStore();
  const controls = usePlayerControls();
  const [cooldown, setCooldown] = useState(0);

  useFrame((state, delta) => {
    if (!jetRef.current) return;
    if (cooldown > 0) setCooldown(c => c - delta);

    const jetPos = jetRef.current.translation();
    const jetRot = jetRef.current.rotation();
    
    // Atualiza o cérebro com a posição do caça
    setJetPosition([jetPos.x, jetPos.y, jetPos.z]);

    // Lógica se estiver A PÉ (Esperando o piloto)
    if (!isPiloting) {
      const dist = new THREE.Vector3(...playerPosition).distanceTo(new THREE.Vector3(jetPos.x, jetPos.y, jetPos.z));
      
      // Se chegar perto (raio de 8 metros) e apertar F
      if (dist < 8 && controls.action && cooldown <= 0) {
        togglePiloting();
        setCooldown(1);
        setMission("Controles: WASD para pilotar, ESPAÇO para acelerar, F para ejetar.");
      }
      return;
    }

    // Lógica se estiver VOANDO
    if (isPiloting) {
      // Ejetar do Avião com F
      if (controls.action && cooldown <= 0) {
        togglePiloting();
        setCooldown(1);
        setMission("Exploração a pé ativada. Encontre o cubo de conhecimento.");
        return;
      }

      // Converte a rotação atual para Euler para facilitar o controle
      const quaternion = new THREE.Quaternion(jetRot.x, jetRot.y, jetRot.z, jetRot.w);
      const euler = new THREE.Euler().setFromQuaternion(quaternion, 'YXZ');

      // Comandos de Voo (Manche)
      if (controls.forward) euler.x -= 1.5 * delta; // Bico pra baixo
      if (controls.backward) euler.x += 1.5 * delta; // Bico pra cima
      if (controls.left) { euler.z += 2 * delta; euler.y += 1 * delta; } // Rola e vira pra esquerda
      if (controls.right) { euler.z -= 2 * delta; euler.y -= 1 * delta; } // Rola e vira pra direita

      // Nivelamento automático da asa (Arcade style)
      if (!controls.left && !controls.right) {
        euler.z = THREE.MathUtils.lerp(euler.z, 0, 0.05);
      }

      // Aplica a nova rotação
      const newQuat = new THREE.Quaternion().setFromEuler(euler);
      jetRef.current.setNextKinematicRotation(newQuat);

      // Aceleração e Velocidade (Space para Turbo)
      const speed = controls.jump ? 80 : 30; // 30 voo normal, 80 turbo
      const forwardVec = new THREE.Vector3(0, 0, -1).applyQuaternion(newQuat).multiplyScalar(speed * delta);
      
      jetRef.current.setNextKinematicTranslation({
        x: jetPos.x + forwardVec.x,
        y: jetPos.y + forwardVec.y,
        z: jetPos.z + forwardVec.z
      });

      // A Câmera persegue o Caça
      const camOffset = new THREE.Vector3(0, 4, 15).applyQuaternion(newQuat);
      state.camera.position.lerp(
        new THREE.Vector3(jetPos.x + camOffset.x, jetPos.y + camOffset.y, jetPos.z + camOffset.z), 
        0.1
      );
      state.camera.lookAt(jetPos.x, jetPos.y, jetPos.z);
    }
  });

  return (
    // O tipo 'kinematicPosition' desativa a gravidade pesada e permite controlar o avião pelo ar livremente
    <RigidBody ref={jetRef} type="kinematicPosition" colliders="hull" position={position}>
      <primitive object={scene} scale={0.1} />
    </RigidBody>
  );
}

function AirForceBase() {
  return (
    <RigidBody type="fixed" name="ground">
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <planeGeometry args={[2, 200]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-30, 10, -50]} castShadow receiveShadow>
        <boxGeometry args={[40, 20, 30]} />
        <meshToonMaterial color="#8899aa" />
      </mesh>
    </RigidBody>
  );
}

// ==========================================
// 5. CENA PRINCIPAL DO JOGO
// ==========================================
export default function Game() {
  return (
    <main className="w-screen h-screen bg-[#87CEEB] overflow-hidden relative">
      <HUD />

      <Canvas className="w-full h-full" shadows>
        <ambientLight intensity={0.6} />
        <directionalLight position={[50, 50, 20]} intensity={2.5} castShadow shadow-mapSize={[2048, 2048]} />
        <Sky distance={450000} sunPosition={[50, 50, 20]} inclination={0.2} azimuth={0.25} />

        <Physics gravity={[0, -30, 0]}> 
          <AirForceBase />
          
          <FighterJet position={[-15, 1, -20]} />
          
          <Player />
          <RivalAI />
          <KnowledgeBlock position={[-10, 1.5, -30]} id="block_1" />
        </Physics>
      </Canvas>
    </main>
  );
}