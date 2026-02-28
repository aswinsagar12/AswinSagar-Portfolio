import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "../PremiumEffects3D.css";

const distortGeometry = (geometry, amount = 0.18) => {
  const position = geometry.attributes.position;
  const vec = new THREE.Vector3();
  for (let i = 0; i < position.count; i += 1) {
    vec.fromBufferAttribute(position, i);
    const n = 1 + (Math.random() - 0.5) * amount;
    vec.multiplyScalar(n);
    position.setXYZ(i, vec.x, vec.y, vec.z);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
};

const ProceduralRocks3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050505, 12, 26);

    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      120
    );
    camera.position.set(0, 2.3, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    renderer.domElement.className = "fx3d-canvas";

    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xb9cafc, 1.2);
    key.position.set(5, 8, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.28);
    fill.position.set(-4, 2, -5);
    scene.add(fill);

    const group = new THREE.Group();
    scene.add(group);

    const rocks = [];
    for (let i = 0; i < 8; i += 1) {
      const g = new THREE.DodecahedronGeometry(0.7 + Math.random() * 0.65, 1);
      distortGeometry(g, 0.35);
      const m = new THREE.MeshStandardMaterial({
        color: 0x8f959f,
        roughness: 0.9,
        metalness: 0.12,
      });
      const rock = new THREE.Mesh(g, m);
      rock.position.set(
        (Math.random() - 0.5) * 8.2,
        -1.8 + Math.random() * 3.6,
        (Math.random() - 0.5) * 6.5
      );
      rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      group.add(rock);
      rocks.push({ mesh: rock, geo: g, mat: m, speed: 0.1 + Math.random() * 0.25 });
    }

    const onResize = () => {
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    let frameId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      group.rotation.y = Math.sin(t * 0.15) * 0.18;

      for (let i = 0; i < rocks.length; i += 1) {
        const item = rocks[i];
        item.mesh.rotation.y += 0.0015 * item.speed;
        item.mesh.rotation.x += 0.001 * item.speed;
        item.mesh.position.y += Math.sin(t * item.speed + i * 1.3) * 0.0009;
      }

      camera.position.x = Math.sin(t * 0.18) * 0.8;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      for (let i = 0; i < rocks.length; i += 1) {
        rocks[i].geo.dispose();
        rocks[i].mat.dispose();
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="fx3d-root" ref={containerRef} aria-hidden="true" />;
};

export default ProceduralRocks3D;


