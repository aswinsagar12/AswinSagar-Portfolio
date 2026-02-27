import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./PremiumEffects3D.css";

const OrbitingRings3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      48,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      120
    );
    camera.position.set(0, 1.2, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    renderer.domElement.className = "fx3d-canvas";

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const key = new THREE.PointLight(0xbecbff, 1.2, 40, 2);
    key.position.set(3, 5, 5);
    scene.add(key);

    const rings = [];
    const group = new THREE.Group();
    scene.add(group);

    const ringCount = 4;
    for (let i = 0; i < ringCount; i += 1) {
      const radius = 1.2 + i * 0.75;
      const tube = 0.03 + i * 0.008;
      const geo = new THREE.TorusGeometry(radius, tube, 24, 140);
      const mat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xffffff : 0xb8c6ff,
        roughness: 0.2,
        metalness: 0.9,
        emissive: i % 2 === 0 ? 0x111111 : 0x1a223b,
        emissiveIntensity: 0.45,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = Math.PI / 2 + i * 0.15;
      mesh.rotation.y = i * 0.5;
      group.add(mesh);
      rings.push({ mesh, geo, mat, speed: (i % 2 === 0 ? 1 : -1) * (0.12 + i * 0.04) });
    }

    const coreGeo = new THREE.IcosahedronGeometry(0.32, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xe7edff,
      roughness: 0.22,
      metalness: 0.8,
      clearcoat: 0.9,
      clearcoatRoughness: 0.18,
      emissive: 0x131927,
      emissiveIntensity: 0.7,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      target.x = ((e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
      target.y = -((e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
    };
    container.addEventListener("mousemove", onPointerMove);

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
      pointer.x += (target.x - pointer.x) * 0.05;
      pointer.y += (target.y - pointer.y) * 0.05;

      group.rotation.y = pointer.x * 0.2;
      group.rotation.x = pointer.y * 0.12;
      core.rotation.y = t * 0.7;
      core.rotation.x = t * 0.4;

      for (let i = 0; i < rings.length; i += 1) {
        const item = rings[i];
        item.mesh.rotation.z += 0.0025 * item.speed;
        item.mesh.position.y = Math.sin(t * 0.7 + i) * 0.05;
      }

      key.intensity = 1 + Math.sin(t * 1.6) * 0.2;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onPointerMove);
      for (let i = 0; i < rings.length; i += 1) {
        rings[i].geo.dispose();
        rings[i].mat.dispose();
      }
      coreGeo.dispose();
      coreMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="fx3d-root" ref={containerRef} aria-hidden="true" />;
};

export default OrbitingRings3D;
