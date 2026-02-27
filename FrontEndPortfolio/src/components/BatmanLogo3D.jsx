import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import batmanSvg from "../assets/BatMan.svg";
import "./BatmanLogo3D.css";

const BatmanLogo3D = ({ onInteractionChange, onPointerMove }) => {
  const containerRef = useRef(null);
  const interactionCbRef = useRef(onInteractionChange);
  const pointerCbRef = useRef(onPointerMove);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    interactionCbRef.current = onInteractionChange;
    pointerCbRef.current = onPointerMove;
  }, [onInteractionChange, onPointerMove]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse)");
    const onChange = () => setIsMobile(query.matches);
    onChange();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (isMobile) return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const ambient = new THREE.AmbientLight(0xffffff, 0.42);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(4, 7, 6);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xffffff, 0.55);
    fill.position.set(-6, 2, 4);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xc5ccff, 0.75);
    rim.position.set(0, -4, -6);
    scene.add(rim);

    const sparkle = new THREE.PointLight(0xffffff, 0.4, 60, 2);
    sparkle.position.set(6, 2.5, 7);
    scene.add(sparkle);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const LOGO_SCALE_XY = 0.03;
    const LOGO_SCALE_Z = 0.12;
    const EXTRUDE_DEPTH = 6;

    const frontMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.24,
      metalness: 0.92,
      clearcoat: 0.65,
      clearcoatRoughness: 0.26,
      reflectivity: 0.9,
      envMapIntensity: 0.65,
    });
    const sideMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xdfe3ea,
      roughness: 0.3,
      metalness: 0.82,
      clearcoat: 0.45,
      clearcoatRoughness: 0.32,
      reflectivity: 0.8,
      envMapIntensity: 0.55,
    });
    const materials = [frontMaterial, sideMaterial];

    const renderTarget = new THREE.WebGLRenderTarget(
      container.clientWidth,
      container.clientHeight,
      { type: THREE.HalfFloatType }
    );
    if (renderer.capabilities.isWebGL2) {
      renderTarget.samples = 4;
    }
    const composer = new EffectComposer(renderer, renderTarget);
    composer.addPass(new RenderPass(scene, camera));
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.material.uniforms.resolution.value.set(
      1 / (container.clientWidth * renderer.getPixelRatio()),
      1 / (container.clientHeight * renderer.getPixelRatio())
    );
    composer.addPass(fxaaPass);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.06,
      0.38,
      0.95
    );
    composer.addPass(bloomPass);

    const svgLoader = new SVGLoader();
    let batMesh = null;
    let geometry = null;

    const state = {
      isDragging: false,
      prevX: 0,
      prevY: 0,
      velX: 0,
      velY: 0,
      autoRotate: true,
    };

    let autoRotateTimer = null;
    let frameId = 0;

    const canvas = renderer.domElement;
    canvas.style.cursor = "grab";

    const emitInteraction = (active) => {
      if (interactionCbRef.current) interactionCbRef.current(active);
    };

    const emitPointer = (clientX, clientY) => {
      if (!pointerCbRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const x = THREE.MathUtils.clamp((clientX - rect.left) / rect.width, 0, 1);
      const y = THREE.MathUtils.clamp((clientY - rect.top) / rect.height, 0, 1);
      pointerCbRef.current({ x, y });
    };

    const fitCameraToMesh = (mesh) => {
      const box = new THREE.Box3().setFromObject(mesh);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y);
      const fov = camera.fov * (Math.PI / 180);
      const cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * 1.35;
      camera.position.z = cameraZ;
      camera.position.y = 0;
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };

    const onMouseEnter = () => emitInteraction(true);

    const onMouseLeave = () => {
      state.isDragging = false;
      emitInteraction(false);
      canvas.style.cursor = "grab";
    };

    const onMouseDown = (e) => {
      state.isDragging = true;
      state.autoRotate = false;
      state.prevX = e.clientX;
      state.prevY = e.clientY;
      state.velX = 0;
      state.velY = 0;
      clearTimeout(autoRotateTimer);
      canvas.style.cursor = "grabbing";
      emitInteraction(true);
      emitPointer(e.clientX, e.clientY);
    };

    const onMouseMove = (e) => {
      emitPointer(e.clientX, e.clientY);
      if (!state.isDragging || !batMesh) return;
      const dx = e.clientX - state.prevX;
      const dy = e.clientY - state.prevY;
      batMesh.rotation.y += dx * 0.01;
      batMesh.rotation.x += dy * 0.01;
      state.velY = dx * 0.01;
      state.velX = dy * 0.01;
      state.prevX = e.clientX;
      state.prevY = e.clientY;
    };

    const onMouseUp = () => {
      state.isDragging = false;
      canvas.style.cursor = "grab";
      autoRotateTimer = setTimeout(() => {
        state.autoRotate = true;
        state.velX = 0;
        state.velY = 0;
        emitInteraction(false);
      }, 3000);
    };

    const onTouchStart = (e) => {
      if (!batMesh) return;
      state.isDragging = true;
      state.autoRotate = false;
      state.prevX = e.touches[0].clientX;
      state.prevY = e.touches[0].clientY;
      clearTimeout(autoRotateTimer);
      emitInteraction(true);
      emitPointer(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onTouchMove = (e) => {
      if (!state.isDragging || !batMesh) return;
      const dx = e.touches[0].clientX - state.prevX;
      const dy = e.touches[0].clientY - state.prevY;
      batMesh.rotation.y += dx * 0.01;
      batMesh.rotation.x += dy * 0.01;
      state.velY = dx * 0.01;
      state.velX = dy * 0.01;
      state.prevX = e.touches[0].clientX;
      state.prevY = e.touches[0].clientY;
      emitPointer(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onTouchEnd = () => {
      state.isDragging = false;
      autoRotateTimer = setTimeout(() => {
        state.autoRotate = true;
        emitInteraction(false);
      }, 3000);
    };

    canvas.addEventListener("mouseenter", onMouseEnter);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);

    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
      composer.setSize(width, height);
      fxaaPass.material.uniforms.resolution.value.set(
        1 / (width * renderer.getPixelRatio()),
        1 / (height * renderer.getPixelRatio())
      );
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", onResize);

    svgLoader.load(
      batmanSvg,
      (data) => {
        const mergedShapes = [];
        data.paths.forEach((path) => {
          const shapes = SVGLoader.createShapes(path);
          mergedShapes.push(...shapes);
        });

        geometry = new THREE.ExtrudeGeometry(mergedShapes, {
          depth: EXTRUDE_DEPTH,
          bevelEnabled: true,
          bevelThickness: 0.12,
          bevelSize: 0.08,
          bevelSegments: 6,
          curveSegments: 48,
        });
        geometry.computeVertexNormals();
        geometry.center();

        batMesh = new THREE.Mesh(geometry, materials);
        batMesh.castShadow = true;
        batMesh.receiveShadow = true;
        batMesh.scale.set(LOGO_SCALE_XY, -LOGO_SCALE_XY, LOGO_SCALE_Z);

        rootGroup.add(batMesh);
        fitCameraToMesh(batMesh);
      },
      undefined,
      () => {}
    );

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      if (batMesh) {
        if (state.autoRotate) {
          batMesh.rotation.y += 0.0019;
        } else if (!state.isDragging) {
          batMesh.rotation.y += state.velY;
          batMesh.rotation.x += state.velX;
          state.velY *= 0.9;
          state.velX *= 0.9;
        }
      }

      const interacting = state.isDragging || !state.autoRotate;
      bloomPass.strength = interacting ? 0.04 : 0.08;
      sparkle.intensity = interacting ? 0.22 : 0.4;

      sparkle.position.x = Math.cos(t * 0.8) * 6.2;
      sparkle.position.y = 2.0 + Math.sin(t * 1.6) * 0.55;
      sparkle.position.z = 6.0 + Math.sin(t * 0.9) * 1.1;

      composer.render();
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(autoRotateTimer);
      emitInteraction(false);

      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mouseenter", onMouseEnter);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);

      if (geometry) geometry.dispose();
      frontMaterial.dispose();
      sideMaterial.dispose();
      envTexture.dispose();
      pmremGenerator.dispose();
      composer.dispose();
      renderTarget.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isMobile]);

  return (
    <div className="batman-logo3d" ref={containerRef}>
      {isMobile ? (
        <img className="batman-logo3d__fallback" src={batmanSvg} alt="Batman logo" />
      ) : null}
    </div>
  );
};

export default BatmanLogo3D;
