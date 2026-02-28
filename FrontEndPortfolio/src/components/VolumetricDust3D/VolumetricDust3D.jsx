import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "../PremiumEffects3D.css";

const VolumetricDust3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      120
    );
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    renderer.domElement.className = "fx3d-canvas";

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const particleCount = 1600;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3;
      const radius = Math.pow(Math.random(), 0.85) * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      const c = 0.68 + Math.random() * 0.32;
      colors[i3] = c * 0.85;
      colors[i3 + 1] = c * 0.9;
      colors[i3 + 2] = c;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.06,
      transparent: true,
      opacity: 0.75,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const glow = new THREE.PointLight(0x9eb8ff, 0.7, 40, 2);
    glow.position.set(0, 0, 5);
    scene.add(glow);

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      target.x = ((e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
      target.y = -((e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
    };

    const onResize = () => {
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", onResize);
    container.addEventListener("mousemove", onPointerMove);

    let frameId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      pointer.x += (target.x - pointer.x) * 0.04;
      pointer.y += (target.y - pointer.y) * 0.04;
      points.rotation.y = t * 0.05 + pointer.x * 0.08;
      points.rotation.x = pointer.y * 0.04;
      glow.position.x = pointer.x * 3;
      glow.position.y = pointer.y * 2;
      glow.intensity = 0.55 + Math.sin(t * 1.3) * 0.15;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onPointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="fx3d-root" ref={containerRef} aria-hidden="true" />;
};

export default VolumetricDust3D;


