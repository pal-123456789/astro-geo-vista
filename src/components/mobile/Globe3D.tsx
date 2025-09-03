import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Thermometer, Droplets, Wind } from 'lucide-react';

interface AnomalyMarker {
  id: string;
  position: [number, number, number];
  type: 'wildfire' | 'flood' | 'drought' | 'storm';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
}

const EarthGlobe = ({ anomalies, onAnomalyClick }: { 
  anomalies: AnomalyMarker[]; 
  onAnomalyClick: (anomaly: AnomalyMarker) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hoveredAnomaly, setHoveredAnomaly] = useState<string | null>(null);

  // Load Earth textures
  const earthTexture = useTexture('/earth-day.jpg');
  const earthNormalMap = useTexture('/earth-normal.jpg');
  const earthSpecularMap = useTexture('/earth-specular.jpg');

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'wildfire': return '🔥';
      case 'flood': return '🌊';
      case 'drought': return '🏜️';
      case 'storm': return '⛈️';
      default: return '⚠️';
    }
  };

  return (
    <group>
      {/* Earth Sphere */}
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <meshPhongMaterial
          map={earthTexture}
          normalMap={earthNormalMap}
          specularMap={earthSpecularMap}
          shininess={100}
        />
      </Sphere>

      {/* Anomaly Markers */}
      {anomalies.map((anomaly) => (
        <group key={anomaly.id} position={anomaly.position}>
          {/* Pulsing marker */}
          <Sphere
            args={[0.05, 16, 16]}
            onClick={() => onAnomalyClick(anomaly)}
            onPointerOver={() => setHoveredAnomaly(anomaly.id)}
            onPointerOut={() => setHoveredAnomaly(null)}
          >
            <meshBasicMaterial
              color={getSeverityColor(anomaly.severity)}
              transparent
              opacity={hoveredAnomaly === anomaly.id ? 1 : 0.8}
            />
          </Sphere>

          {/* Tooltip on hover */}
          {hoveredAnomaly === anomaly.id && (
            <Html distanceFactor={10}>
              <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getAnomalyIcon(anomaly.type)}</span>
                  <Badge variant={anomaly.severity === 'critical' ? 'destructive' : 'secondary'}>
                    {anomaly.severity}
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm mb-1">{anomaly.title}</h4>
                <p className="text-xs text-muted-foreground">{anomaly.description}</p>
              </div>
            </Html>
          )}

          {/* Glow effect for critical anomalies */}
          {anomaly.severity === 'critical' && (
            <Sphere args={[0.15, 16, 16]}>
              <meshBasicMaterial
                color={getSeverityColor(anomaly.severity)}
                transparent
                opacity={0.2}
              />
            </Sphere>
          )}
        </group>
      ))}

      {/* Atmosphere */}
      <Sphere args={[2.1, 64, 64]}>
        <meshBasicMaterial
          color="#87ceeb"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};

const Globe3D = () => {
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyMarker | null>(null);
  const [anomalies] = useState<AnomalyMarker[]>([
    {
      id: '1',
      position: [1.2, 0.8, 1.2],
      type: 'wildfire',
      severity: 'critical',
      title: 'California Wildfire',
      description: 'Severe wildfire spreading rapidly in Northern California'
    },
    {
      id: '2',
      position: [-1.8, -0.5, 0.8],
      type: 'flood',
      severity: 'high',
      title: 'Monsoon Flooding',
      description: 'Heavy monsoon rains causing widespread flooding'
    },
    {
      id: '3',
      position: [0.2, 1.9, 0.3],
      type: 'storm',
      severity: 'medium',
      title: 'Tropical Storm',
      description: 'Tropical storm forming in the Atlantic'
    }
  ]);

  const handleAnomalyClick = (anomaly: AnomalyMarker) => {
    setSelectedAnomaly(anomaly);
  };

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.3} />
          
          <EarthGlobe 
            anomalies={anomalies} 
            onAnomalyClick={handleAnomalyClick}
          />
          
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            zoomSpeed={0.5}
            rotateSpeed={0.5}
            minDistance={3}
            maxDistance={8}
          />
        </Suspense>
      </Canvas>

      {/* Anomaly Details Panel */}
      {selectedAnomaly && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <Card className="p-4 glass">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {selectedAnomaly.type === 'wildfire' && '🔥'}
                  {selectedAnomaly.type === 'flood' && '🌊'}
                  {selectedAnomaly.type === 'drought' && '🏜️'}
                  {selectedAnomaly.type === 'storm' && '⛈️'}
                </span>
                <Badge 
                  variant={selectedAnomaly.severity === 'critical' ? 'destructive' : 'secondary'}
                  className="animate-pulse-glow"
                >
                  {selectedAnomaly.severity.toUpperCase()}
                </Badge>
              </div>
              <button
                onClick={() => setSelectedAnomaly(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">{selectedAnomaly.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{selectedAnomaly.description}</p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
                <Thermometer className="w-5 h-5 mb-1 text-orange-500" />
                <span className="text-xs font-medium">45°C</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
                <Droplets className="w-5 h-5 mb-1 text-blue-500" />
                <span className="text-xs font-medium">12%</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
                <Wind className="w-5 h-5 mb-1 text-gray-500" />
                <span className="text-xs font-medium">25 km/h</span>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Loading fallback */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="glass p-4 rounded-lg">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          <p className="mt-2 text-sm text-muted-foreground">Loading Earth...</p>
        </div>
      </div>
    </div>
  );
};

export default Globe3D;