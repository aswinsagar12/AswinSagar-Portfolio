import React, { forwardRef, useEffect, useRef, useState } from "react";
import "./RippleText.css";

const vertexShader = `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float dist = distance(uv, uMouse);

    float ripple = sin(dist * 40.0 - uTime * 8.0) * 0.012;
    ripple *= smoothstep(0.5, 0.0, dist);
    ripple *= smoothstep(0.0, 0.3, uTime * 0.5);
    ripple *= smoothstep(2.0, 0.8, uTime * 0.5);
    ripple *= uHover;

    uv.x += ripple * 0.6;
    uv.y += ripple * 0.6;

    vec4 color = texture2D(uTexture, clamp(uv, 0.001, 0.999));
    gl_FragColor = color;
  }
`;

const RippleText = forwardRef(function RippleText(
  { children, className, style, tag: Tag = "h2" },
  forwardedRef
) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const [disableWebgl, setDisableWebgl] = useState(
    () => typeof window !== "undefined" && "ontouchstart" in window
  );
  const [isReady, setIsReady] = useState(false);

  const stateRef = useRef({
    mouse: { x: 0.5, y: 0.5 },
    targetMouse: { x: 0.5, y: 0.5 },
    hover: 0,
    targetHover: 0,
    rippleTime: 0,
    animId: null,
    gl: null,
    program: null,
    texture: null,
    posBuf: null,
    uvBuf: null,
    posLoc: -1,
    uvLoc: -1,
    uniforms: {},
  });

  useEffect(() => {
    if (disableWebgl) return undefined;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const text = textRef.current;
    if (!container || !canvas || !text) return undefined;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
    });

    if (!gl) {
      setDisableWebgl(true);
      return undefined;
    }

    const s = stateRef.current;
    s.gl = gl;

    const compileShader = (type, src) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vert = compileShader(gl.VERTEX_SHADER, vertexShader);
    const frag = compileShader(gl.FRAGMENT_SHADER, fragmentShader);
    if (!vert || !frag) {
      setDisableWebgl(true);
      return undefined;
    }

    const program = gl.createProgram();
    if (!program) {
      setDisableWebgl(true);
      return undefined;
    }

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

    s.program = program;

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
    s.posLoc = gl.getAttribLocation(program, "position");

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    s.uvLoc = gl.getAttribLocation(program, "uv");

    gl.useProgram(program);
    s.uniforms = {
      uTexture: gl.getUniformLocation(program, "uTexture"),
      uTime: gl.getUniformLocation(program, "uTime"),
      uMouse: gl.getUniformLocation(program, "uMouse"),
      uHover: gl.getUniformLocation(program, "uHover"),
    };

    const buildTexture = () => {
      const rect = text.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const offscreen = document.createElement("canvas");
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const ctx = offscreen.getContext("2d");
      if (!ctx) return;

      const computedStyle = window.getComputedStyle(text);
      const fontSize = parseFloat(computedStyle.fontSize) || rect.height * 0.75;
      const lineHeightValue = parseFloat(computedStyle.lineHeight);
      const lineHeight = Number.isFinite(lineHeightValue) ? lineHeightValue : fontSize;

      ctx.clearRect(0, 0, offscreen.width, offscreen.height);
      ctx.scale(dpr, dpr);
      ctx.font = computedStyle.font;
      ctx.fillStyle = computedStyle.color || "#ffffff";
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillText(text.textContent || "", 0, Math.max(lineHeight / 2, rect.height / 2));

      const tex = gl.createTexture();
      if (!tex) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, offscreen);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      if (s.texture) gl.deleteTexture(s.texture);
      s.texture = tex;

      gl.viewport(0, 0, canvas.width, canvas.height);
      setIsReady(true);
    };

    buildTexture();

    let lastTime = 0;
    const render = (time) => {
      const delta = (time - lastTime) / 1000 || 0;
      lastTime = time;

      s.mouse.x += (s.targetMouse.x - s.mouse.x) * 0.08;
      s.mouse.y += (s.targetMouse.y - s.mouse.y) * 0.08;
      s.hover += (s.targetHover - s.hover) * 0.08;

      if (s.hover > 0.01) s.rippleTime += delta;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.enableVertexAttribArray(s.posLoc);
      gl.vertexAttribPointer(s.posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
      gl.enableVertexAttribArray(s.uvLoc);
      gl.vertexAttribPointer(s.uvLoc, 2, gl.FLOAT, false, 0, 0);

      if (s.texture) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, s.texture);
      }

      gl.uniform1i(s.uniforms.uTexture, 0);
      gl.uniform1f(s.uniforms.uTime, s.rippleTime);
      gl.uniform2f(s.uniforms.uMouse, s.mouse.x, 1.0 - s.mouse.y);
      gl.uniform1f(s.uniforms.uHover, s.hover);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      s.animId = requestAnimationFrame(render);
    };

    s.animId = requestAnimationFrame(render);

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
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

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);

    const resizeObserver = new ResizeObserver(buildTexture);
    resizeObserver.observe(text);
    window.addEventListener("resize", buildTexture);

    return () => {
      cancelAnimationFrame(s.animId);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", buildTexture);
      resizeObserver.disconnect();
      if (s.texture) gl.deleteTexture(s.texture);
      if (s.posBuf) gl.deleteBuffer(s.posBuf);
      if (s.uvBuf) gl.deleteBuffer(s.uvBuf);
      if (s.program) gl.deleteProgram(s.program);
    };
  }, [children, disableWebgl]);

  const setRefs = (node) => {
    containerRef.current = node;
    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  const classNames = (className || "").split(/\s+/).filter(Boolean);
  const hasReveal = classNames.includes("reveal");
  const textClassName = classNames.filter((name) => name !== "reveal").join(" ");
  const containerClassName = ["ripple-text", hasReveal ? "reveal" : ""].filter(Boolean).join(" ");

  if (disableWebgl) {
    return (
      <Tag ref={forwardedRef} className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <div ref={setRefs} className={containerClassName} style={{ position: "relative", display: "inline-block" }}>
      <Tag
        ref={textRef}
        className={textClassName}
        style={{ ...style, opacity: isReady ? 0 : 1, userSelect: "none" }}
      >
        {children}
      </Tag>
      <canvas
        ref={canvasRef}
        className="ripple-text__canvas"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: isReady ? 1 : 0,
        }}
      />
    </div>
  );
});

export default RippleText;


