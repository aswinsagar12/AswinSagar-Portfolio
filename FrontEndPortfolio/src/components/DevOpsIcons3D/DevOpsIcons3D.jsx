import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const iconConfig = [
  { label: "AWS", shape: "box", position: [-5, 2, 0], size: 0.8 },
  { label: "Docker", shape: "box", position: [4, 3, -1], size: 0.75 },
  { label: "K8s", shape: "torus", position: [-3, -2, 1], size: 0.7 },
  { label: "Terraform", shape: "box", position: [5, -1, 0], size: 0.7 },
  { label: "GCP", shape: "sphere", position: [-4, 1, -1], size: 0.65 },
  { label: "Linux", shape: "box", position: [3, -3, 1], size: 0.7 },
  { label: "Python", shape: "box", position: [-6, -1, 0], size: 0.65 },
  { label: "Node.js", shape: "box", position: [6, 1, -2], size: 0.65 },
  { label: "JS", shape: "box", position: [2, 2, 1], size: 0.6 },
  { label: "Java", shape: "box", position: [-2, -3, -1], size: 0.65 },
  { label: "Git", shape: "box", position: [0, 3, -1], size: 0.6 },
  { label: "Grafana", shape: "torus", position: [-6, 2, 1], size: 0.6 },
  { label: "Prometheus", shape: "sphere", position: [7, 0, 0], size: 0.6 },
  { label: "CI/CD", shape: "box", position: [-1, -4, 0], size: 0.65 },
];

function makeIconTexture(label) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 240, 240);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = label.length > 5 ? "bold 36px monospace" : "bold 52px monospace";
  ctx.fillText(label, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const makeGeometry = (shape, size) => {
  if (shape === "torus") return new THREE.TorusGeometry(size * 0.7, size * 0.24, 24, 64);
  if (shape === "sphere") return new THREE.SphereGeometry(size * 0.62, 32, 32);
  return new THREE.BoxGeometry(size, size, size);
};

export default function DevOpsIcons3D() {
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
    camera.position.set(0, 0, 18);
    const isMobile = window.innerWidth <= 768;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.touchAction = isMobile ? "pan-y" : "none";
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.45);
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(5, 6, 8);
    const fill = new THREE.DirectionalLight(0xffffff, 0.35);
    fill.position.set(-4, -2, 6);
    scene.add(ambient, key, fill);

    const scaleFactor = isMobile ? 0.84 : 1;
    const spreadFactor = isMobile ? 1.1 : 1.5;

    const items = iconConfig.map((cfg, index) => {
      const texture = makeIconTexture(cfg.label);
      const geometry = makeGeometry(cfg.shape, cfg.size * scaleFactor);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: texture,
        roughness: 0.35,
        metalness: 0.2,
      });
      const mesh = new THREE.Mesh(geometry, material);
      const basePosition = new THREE.Vector3(
        cfg.position[0] * scaleFactor * spreadFactor,
        cfg.position[1] * scaleFactor * spreadFactor,
        cfg.position[2] * scaleFactor * 1.1
      );
      mesh.position.copy(basePosition);
      mesh.rotation.set(Math.random() * 0.8, Math.random() * 0.8, Math.random() * 0.8);
      mesh.userData.iconIndex = index;
      scene.add(mesh);
      return {
        mesh,
        texture,
        geometry,
        material,
        basePosition,
        isDragging: false,
      };
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const dragPlane = new THREE.Plane();
    const planeHit = new THREE.Vector3();
    const dragOffset = new THREE.Vector3();
    const dragState = {
      item: null,
      prevClientX: 0,
      prevClientY: 0,
      hoverItem: null,
    };

    const updatePointer = (clientX, clientY) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
      pointer.y = -((clientY - rect.top) / Math.max(rect.height, 1)) * 2 + 1;
    };

    const nearestLetterShake = (mesh) => {
      const letters = Array.from(document.querySelectorAll("[data-letter-index]"));
      if (!letters.length) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const pos = mesh.position.clone().project(camera);
      const sx = (pos.x * 0.5 + 0.5) * rect.width + rect.left;
      const sy = (-pos.y * 0.5 + 0.5) * rect.height + rect.top;

      let minDist = Infinity;
      let minIndex = -1;

      for (let i = 0; i < letters.length; i += 1) {
        const el = letters[i];
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(cx - sx, cy - sy);
        if (dist < minDist) {
          minDist = dist;
          minIndex = Number(el.getAttribute("data-letter-index"));
        }
      }

      if (minDist < (isMobile ? 190 : 150) && minIndex >= 0) {
        window.dispatchEvent(new CustomEvent("letterShake", { detail: { index: minIndex } }));
      }
    };

    const handlePointerDown = (e) => {
      updatePointer(e.clientX, e.clientY);
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(items.map((it) => it.mesh), false);
      if (!intersects.length) return;
      const hitMesh = intersects[0].object;
      const item = items.find((it) => it.mesh === hitMesh);
      if (!item) return;

      dragState.item = item;
      dragState.prevClientX = e.clientX;
      dragState.prevClientY = e.clientY;
      item.isDragging = true;
      if (isMobile && typeof e.preventDefault === "function") e.preventDefault();
      if (renderer.domElement.setPointerCapture && typeof e.pointerId === "number") {
        renderer.domElement.setPointerCapture(e.pointerId);
      }

      dragPlane.set(new THREE.Vector3(0, 0, 1), -item.mesh.position.z);
      if (raycaster.ray.intersectPlane(dragPlane, planeHit)) {
        dragOffset.copy(planeHit).sub(item.mesh.position);
      } else {
        dragOffset.set(0, 0, 0);
      }

      renderer.domElement.style.cursor = "grabbing";
    };

    const handlePointerMove = (e) => {
      updatePointer(e.clientX, e.clientY);
      raycaster.setFromCamera(pointer, camera);

      if (dragState.item) {
        if (isMobile && typeof e.preventDefault === "function") e.preventDefault();
        const item = dragState.item;
        dragPlane.set(new THREE.Vector3(0, 0, 1), -item.mesh.position.z);
        if (raycaster.ray.intersectPlane(dragPlane, planeHit)) {
          item.mesh.position.copy(planeHit.sub(dragOffset));
        }
        const dx = e.clientX - dragState.prevClientX;
        const dy = e.clientY - dragState.prevClientY;
        item.mesh.rotation.y += dx * 0.02;
        item.mesh.rotation.x += dy * 0.02;
        item.mesh.rotation.z += dx * 0.01;
        dragState.prevClientX = e.clientX;
        dragState.prevClientY = e.clientY;
        renderer.domElement.style.cursor = "grabbing";
        return;
      }

      const intersects = raycaster.intersectObjects(items.map((it) => it.mesh), false);
      dragState.hoverItem = intersects.length ? intersects[0].object : null;
      renderer.domElement.style.cursor = dragState.hoverItem ? "grab" : "default";
    };

    const handlePointerUp = () => {
      if (dragState.item) {
        nearestLetterShake(dragState.item.mesh);
        dragState.item.isDragging = false;
        dragState.item = null;
      }
      renderer.domElement.style.cursor = dragState.hoverItem ? "grab" : "default";
    };

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    const onResize = () => {
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      items.forEach((item, i) => {
        if (!item.isDragging) {
          const target = new THREE.Vector3(
            item.basePosition.x,
            item.basePosition.y + Math.sin(t * 0.6 + i * 1.2) * 0.15,
            item.basePosition.z
          );
          item.mesh.position.lerp(target, 0.05);
          item.mesh.rotation.y += 0.004;
          item.mesh.rotation.x += 0.002;
        }
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("resize", onResize);
      items.forEach((item) => {
        item.texture.dispose();
        item.geometry.dispose();
        item.material.dispose();
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} style={{ position: "absolute", inset: 0, zIndex: 1, touchAction: "pan-y" }} />;
}


