import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "../PremiumEffects3D.css";

const FloatingGlassShards3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    );
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    renderer.domElement.className = "fx3d-canvas";

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.DirectionalLight(0xa8bcff, 1.1);
    key.position.set(4, 6, 4);
    scene.add(key);
    const rim = new THREE.PointLight(0xffffff, 0.8, 35, 2);
    rim.position.set(-4, -2, 6);
    scene.add(rim);

    const shards = [];
    const shardGroup = new THREE.Group();
    scene.add(shardGroup);
    const baseGeom = new THREE.OctahedronGeometry(0.32, 0);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xd9e4ff,
      roughness: 0.08,
      metalness: 0.12,
      transmission: 0.88,
      thickness: 0.8,
      transparent: true,
      opacity: 0.95,
      envMapIntensity: 0.9,
    });

    for (let i = 0; i < 36; i += 1) {
      const shard = new THREE.Mesh(baseGeom, material);
      const radius = 2.8 + Math.random() * 3.8;
      const angle = Math.random() * Math.PI * 2;
      shard.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 3.5,
        (Math.random() - 0.5) * 4.5
      );
      const scale = 0.65 + Math.random() * 1.8;
      shard.scale.set(scale, scale * (0.7 + Math.random() * 0.8), scale * 0.45);
      shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      shardGroup.add(shard);
      shards.push({
        mesh: shard,
        speed: 0.2 + Math.random() * 0.8,
        drift: (Math.random() - 0.5) * 0.25,
      });
    }

    let frameId = 0;
    const onResize = () => {
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      shardGroup.rotation.y = Math.sin(t * 0.18) * 0.18;
      shardGroup.rotation.x = Math.cos(t * 0.22) * 0.08;
      rim.position.x = Math.sin(t * 0.7) * 5;
      rim.position.y = Math.cos(t * 0.5) * 2;

      for (let i = 0; i < shards.length; i += 1) {
        const item = shards[i];
        item.mesh.rotation.x += 0.003 * item.speed;
        item.mesh.rotation.y += 0.005 * item.speed;
        item.mesh.position.y += Math.sin(t * item.speed + i) * 0.0009 + item.drift * 0.0002;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      baseGeom.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="fx3d-root" ref={containerRef} aria-hidden="true" />;
};

export default FloatingGlassShards3D;


