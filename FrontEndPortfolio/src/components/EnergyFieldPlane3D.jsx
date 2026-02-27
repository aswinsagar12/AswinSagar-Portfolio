import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./PremiumEffects3D.css";

const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin((pos.x * 4.5) + uTime * 1.8) * 0.08;
    wave += cos((pos.y * 5.2) + uTime * 1.4) * 0.06;
    float mouseDist = distance(uv, uMouse);
    wave += sin(mouseDist * 22.0 - uTime * 4.0) * 0.06 * smoothstep(0.55, 0.0, mouseDist);
    pos.z += wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;

  void main() {
    float glow = 0.55 + 0.45 * sin((vUv.x * 10.0) + uTime * 1.8);
    float sweep = smoothstep(0.0, 1.0, sin((vUv.y * 14.0) - uTime * 1.9) * 0.5 + 0.5);
    float md = distance(vUv, uMouse);
    float hotspot = smoothstep(0.4, 0.0, md);
    vec3 colorA = vec3(0.42, 0.56, 1.0);
    vec3 colorB = vec3(0.08, 0.14, 0.34);
    vec3 color = mix(colorB, colorA, glow * 0.55 + sweep * 0.35);
    color += hotspot * vec3(0.22, 0.35, 0.9);
    gl_FragColor = vec4(color, 0.78);
  }
`;

const EnergyFieldPlane3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    );
    camera.position.set(0, 0.5, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    renderer.domElement.className = "fx3d-canvas";

    const geometry = new THREE.PlaneGeometry(12, 7, 160, 120);
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      wireframe: false,
      side: THREE.DoubleSide,
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -0.58;
    plane.position.y = -1.1;
    scene.add(plane);

    const pulseLight = new THREE.PointLight(0x7d98ff, 1.05, 30, 2);
    pulseLight.position.set(0, 1.5, 3.5);
    scene.add(pulseLight);

    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / Math.max(rect.width, 1);
      targetMouse.y = 1 - (e.clientY - rect.top) / Math.max(rect.height, 1);
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
      uniforms.uTime.value = t;
      uniforms.uMouse.value.lerp(targetMouse, 0.08);
      pulseLight.intensity = 0.9 + Math.sin(t * 2.2) * 0.25;
      pulseLight.position.x = Math.sin(t * 0.7) * 1.8;
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

export default EnergyFieldPlane3D;
