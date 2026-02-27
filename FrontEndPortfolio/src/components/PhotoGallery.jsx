import React, { useEffect, useRef, useState } from "react";
import RippleText from "./RippleText";

const vertexShader = `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const imageFragmentShader = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float dist = distance(uv, uMouse);

    float wave1 = sin(dist * 35.0 - uTime * 7.0) * 0.018;
    float wave2 = sin(dist * 60.0 - uTime * 12.0) * 0.008;

    float ripple = (wave1 + wave2) * smoothstep(0.6, 0.0, dist) * uHover;
    ripple *= smoothstep(0.0, 0.2, uTime * 0.3);
    ripple *= max(0.0, 1.0 - uTime * 0.25);

    uv.x += ripple;
    uv.y += ripple * 0.7;

    vec4 color = texture2D(uTexture, clamp(uv, 0.001, 0.999));
    color.rgb += uHover * 0.06;
    gl_FragColor = color;
  }
`;

const photos = [
  { src: "/images/photo1.jpg", alt: "Photo 1", label: "01" },
  { src: "/images/photo2.jpg", alt: "Photo 2", label: "02" },
  { src: "/images/photo3.jpg", alt: "Photo 3", label: "03" },
  { src: "/images/photo4.jpg", alt: "Photo 4", label: "04" },
  { src: "/images/photo5.jpg", alt: "Photo 5", label: "05" },
  { src: "/images/photo6.jpg", alt: "Photo 6", label: "06" },
];

const RippleImage = ({ src, alt }) => {
  const canvasRef = useRef(null);
  const [disableWebgl, setDisableWebgl] = useState(
    () => typeof window !== "undefined" && "ontouchstart" in window
  );
  const stateRef = useRef({
    mouse: { x: 0.5, y: 0.5 },
    targetMouse: { x: 0.5, y: 0.5 },
    hover: 0,
    targetHover: 0,
    rippleTime: 0,
    animId: null,
    texture: null,
    posBuf: null,
    uvBuf: null,
    program: null,
  });

  useEffect(() => {
    if (disableWebgl) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: true });
    if (!gl) {
      setDisableWebgl(true);
      return undefined;
    }

    const s = stateRef.current;

    const compileShader = (type, srcCode) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, srcCode);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vert = compileShader(gl.VERTEX_SHADER, vertexShader);
    const frag = compileShader(gl.FRAGMENT_SHADER, imageFragmentShader);
    if (!vert || !frag) {
      setDisableWebgl(true);
      return undefined;
    }

    const program = gl.createProgram();
    if (!program) {
      setDisableWebgl(true);
      return undefined;
    }
    s.program = program;

    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.deleteShader(vert);
    gl.deleteShader(frag);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      setDisableWebgl(true);
      return undefined;
    }

    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const uvs = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);

    const posBuf = gl.createBuffer();
    const uvBuf = gl.createBuffer();
    if (!posBuf || !uvBuf) {
      gl.deleteProgram(program);
      setDisableWebgl(true);
      return undefined;
    }

    s.posBuf = posBuf;
    s.uvBuf = uvBuf;

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, "position");

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    const uvLoc = gl.getAttribLocation(program, "uv");

    gl.useProgram(program);
    const uniforms = {
      uTexture: gl.getUniformLocation(program, "uTexture"),
      uTime: gl.getUniformLocation(program, "uTime"),
      uMouse: gl.getUniformLocation(program, "uMouse"),
      uHover: gl.getUniformLocation(program, "uHover"),
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const tex = gl.createTexture();
      if (!tex) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (s.texture) gl.deleteTexture(s.texture);
      s.texture = tex;
    };

    let lastTime = 0;
    const render = (time) => {
      const delta = (time - lastTime) / 1000 || 0;
      lastTime = time;

      s.mouse.x += (s.targetMouse.x - s.mouse.x) * 0.1;
      s.mouse.y += (s.targetMouse.y - s.mouse.y) * 0.1;
      s.hover += (s.targetHover - s.hover) * 0.08;

      if (s.hover > 0.01) s.rippleTime += delta;

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
      gl.enableVertexAttribArray(uvLoc);
      gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

      if (s.texture) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, s.texture);
      }

      gl.uniform1i(uniforms.uTexture, 0);
      gl.uniform1f(uniforms.uTime, s.rippleTime);
      gl.uniform2f(uniforms.uMouse, s.mouse.x, 1 - s.mouse.y);
      gl.uniform1f(uniforms.uHover, s.hover);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      s.animId = requestAnimationFrame(render);
    };

    s.animId = requestAnimationFrame(render);

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      s.targetMouse.x = (e.clientX - rect.left) / rect.width;
      s.targetMouse.y = (e.clientY - rect.top) / rect.height;
    };

    const onMouseEnter = () => {
      s.targetHover = 1;
      s.rippleTime = 0;
    };

    const onMouseLeave = () => {
      s.targetHover = 0;
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseenter", onMouseEnter);
    canvas.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", resize);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(s.animId);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseenter", onMouseEnter);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", resize);
      resizeObserver.disconnect();
      if (s.texture) gl.deleteTexture(s.texture);
      if (s.posBuf) gl.deleteBuffer(s.posBuf);
      if (s.uvBuf) gl.deleteBuffer(s.uvBuf);
      if (s.program) gl.deleteProgram(s.program);
    };
  }, [disableWebgl, src]);

  if (disableWebgl) {
    return <img className="gallery-image-fallback" src={src} alt={alt} loading="lazy" />;
  }

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} aria-label={alt} />;
};

const PhotoGallery = () => {
  return (
    <section className="gallery-section section" id="moments" data-scroll-section>
      <div className="gallery-header section__header">
        <span className="section__number">07</span>
        <RippleText tag="h2" className="section-title">
          Moments
        </RippleText>
      </div>
      <div className="gallery-grid">
        {photos.map((photo) => (
          <div key={photo.label} className="gallery-card">
            <div className="gallery-card-inner">
              <RippleImage src={photo.src} alt={photo.alt} />
            </div>
            <div className="gallery-card-label">{photo.label}</div>
          </div>
        ))}
      </div>
      {/* ADD YOUR PHOTOS: Place photo1.jpg through photo6.jpg in /public/images/ */}
      {/* Recommended size: 800x600px, JPG format */}
    </section>
  );
};

export default PhotoGallery;
