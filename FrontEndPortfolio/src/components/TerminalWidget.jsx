import React, { useEffect, useMemo, useRef, useState } from "react";

const COMMANDS = {
  whoami: () => "aswin - sre @ aswinsagar.com",
  date: () => new Date().toString(),
  uptime: () => `up ${Math.floor(Math.random() * 999)} days, running strong`,
  echo: (args) => args || "",
  help: () =>
    "commands: whoami, date, uptime, echo [text], clear, skills, about, experience, creative, testimonials, test, projects, work, contact, home, mail, linkedin, github, hello, pwd, ls",
  skills: () =>
    "aws\ndocker\nkubernetes\nterraform\ngcp\nlinux\npython\nnodejs\ngrafana\nprometheus\nci/cd",
  clear: () => "__CLEAR__",
  hello: () => "Hello, world!",
  pwd: () => "/srv/aswinsagar.com",
  ls: () => "about/\nskills/\nexperience/\ncreative/\ntestimonials/\ncontact/\nlinks/",
};

const SECTION_ALIASES = {
  home: "home",
  about: "about",
  skills: "skills",
  experience: "experience",
  creative: "creative",
  testimonials: "testimonials",
  test: "testimonials",
  projects: "moments",
  work: "moments",
  contact: "contact",
};

const EXTERNAL_LINKS = {
  mail: "mailto:aswinsagar12@gmail.com",
  linkedin: "https://www.linkedin.com/in/aswinsagar12/",
  github: "https://github.com/aswinsagar12",
};

const getInitialPos = () => {
  const w = typeof window !== "undefined" ? window.innerWidth : 1280;
  const h = typeof window !== "undefined" ? window.innerHeight : 900;
  const mobile = w < 768;
  if (mobile) return { x: 16, y: h - 260 };
  return { x: 120, y: Math.max(h - 280, 320) };
};

export default function TerminalWidget() {
  const initialPos = useMemo(() => getInitialPos(), []);
  const [pos, setPos] = useState(initialPos);
  const posRef = useRef(initialPos);
  const [history, setHistory] = useState([
    { type: "output", text: "Welcome to aswinsagar-shell v1.0.0" },
    { type: "output", text: "Type help for available commands." },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [cmdIdx, setCmdIdx] = useState(-1);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const lastPos = useRef(initialPos);
  const momentumId = useRef(0);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const inputValueRef = useRef("");
  const cardRef = useRef(null);
  const [viewport, setViewport] = useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 1280,
    h: typeof window !== "undefined" ? window.innerHeight : 900,
  }));

  const isMobile = viewport.w < 768;

  const clampPos = (x, y) => {
    const el = cardRef.current;
    const w = el?.offsetWidth || (isMobile ? viewport.w - 32 : 360);
    const h = el?.offsetHeight || 260;
    return {
      x: Math.max(0, Math.min(window.innerWidth - w, x)),
      y: Math.max(0, Math.min(window.innerHeight - h, y)),
    };
  };

  const setBothPos = (next) => {
    posRef.current = next;
    setPos(next);
  };

  const stopMomentum = () => {
    if (momentumId.current) {
      cancelAnimationFrame(momentumId.current);
      momentumId.current = 0;
    }
  };

  const applyMomentum = () => {
    const el = cardRef.current;
    if (!el) return;
    if (Math.abs(velocity.current.x) < 0.5 && Math.abs(velocity.current.y) < 0.5) {
      momentumId.current = 0;
      return;
    }
    const next = clampPos(
      posRef.current.x + velocity.current.x,
      posRef.current.y + velocity.current.y
    );
    velocity.current.x *= 0.88;
    velocity.current.y *= 0.88;
    setBothPos(next);
    momentumId.current = requestAnimationFrame(applyMomentum);
  };

  const onMouseDown = (e) => {
    if (e.target === inputRef.current) return;
    stopMomentum();
    isDragging.current = true;
    offset.current = { x: e.clientX - posRef.current.x, y: e.clientY - posRef.current.y };
    e.preventDefault();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const next = clampPos(e.clientX - offset.current.x, e.clientY - offset.current.y);
      if (isMobile) {
        velocity.current = {
          x: (next.x - lastPos.current.x) * 0.3,
          y: (next.y - lastPos.current.y) * 0.3,
        };
      }
      lastPos.current = next;
      setBothPos(next);
    };

    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      if (isMobile) {
        stopMomentum();
        momentumId.current = requestAnimationFrame(applyMomentum);
      }
    };

    const onResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
      const next = clampPos(posRef.current.x, posRef.current.y);
      lastPos.current = next;
      setBothPos(next);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onResize);
      if (isMobile) stopMomentum();
    };
  }, [isMobile]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return undefined;

    const onTouchStart = (e) => {
      if (e.target === inputRef.current) return;
      stopMomentum();
      isDragging.current = true;
      offset.current = {
        x: e.touches[0].clientX - posRef.current.x,
        y: e.touches[0].clientY - posRef.current.y,
      };
    };

    const onTouchMove = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();
      e.stopPropagation();
      const next = clampPos(
        e.touches[0].clientX - offset.current.x,
        e.touches[0].clientY - offset.current.y
      );
      velocity.current = {
        x: (next.x - lastPos.current.x) * 0.3,
        y: (next.y - lastPos.current.y) * 0.3,
      };
      lastPos.current = next;
      setBothPos(next);
    };

    const onTouchEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      stopMomentum();
      momentumId.current = requestAnimationFrame(applyMomentum);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [isMobile]);

  useEffect(() => {
    if (!bodyRef.current) return;
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history]);

  useEffect(() => {
    inputValueRef.current = input;
  }, [input]);

  const runCommand = (cmd) => {
    const parts = cmd.trim().split(" ");
    const name = (parts[0] || "").toLowerCase();
    const args = parts.slice(1).join(" ");

    const targetId = SECTION_ALIASES[name];
    if (targetId) {
      const pathBySection = {
        home: "/home",
        about: "/about",
        skills: "/skills",
        experience: "/experience",
        creative: "/creative",
        testimonials: name === "test" ? "/test" : "/testimonials",
        contact: "/contact",
        moments: name === "work" ? "/work" : "/projects",
      };
      const nextPath = pathBySection[targetId] || `/${name}`;
      setHistory((prev) => [
        ...prev,
        { type: "input", text: cmd },
        { type: "output", text: `navigating to ${nextPath}` },
      ]);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("app:navigate", { detail: { path: nextPath } }));
      }, 20);
      setCmdHistory((prev) => [cmd, ...prev]);
      setCmdIdx(-1);
      setInput("");
      return;
    }

    const externalUrl = EXTERNAL_LINKS[name];
    if (externalUrl) {
      setHistory((prev) => [
        ...prev,
        { type: "input", text: cmd },
        { type: "output", text: `opening ${externalUrl}` },
      ]);
      setTimeout(() => {
        if (name === "mail") window.location.href = externalUrl;
        else window.open(externalUrl, "_blank", "noopener,noreferrer");
      }, 20);
      setCmdHistory((prev) => [cmd, ...prev]);
      setCmdIdx(-1);
      setInput("");
      return;
    }

    const fn = COMMANDS[name];
    const output = fn ? fn(args) : `command not found: ${name}. try 'help'`;
    if (output === "__CLEAR__") {
      setHistory([]);
    } else {
      setHistory((prev) => [...prev, { type: "input", text: cmd }, { type: "output", text: output }]);
    }
    setCmdHistory((prev) => [cmd, ...prev]);
    setCmdIdx(-1);
    setInput("");
  };

  useEffect(() => {
    const onGlobalKeyDown = (e) => {
      const target = e.target;
      const tag = target?.tagName?.toLowerCase?.();
      const isEditable = tag === "input" || tag === "textarea" || target?.isContentEditable;
      if (isEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "Enter") {
        if (inputValueRef.current.trim()) runCommand(inputValueRef.current);
        if (inputRef.current) inputRef.current.focus();
        e.preventDefault();
        return;
      }
      if (e.key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
        if (inputRef.current) inputRef.current.focus();
        e.preventDefault();
        return;
      }
      if (e.key === "Escape") {
        setInput("");
        return;
      }
      if (e.key.length === 1) {
        setInput((prev) => `${prev}${e.key}`);
        if (inputRef.current) inputRef.current.focus();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onGlobalKeyDown);
    return () => window.removeEventListener("keydown", onGlobalKeyDown);
  }, []);

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      if (input.trim()) runCommand(input);
      return;
    }
    if (e.key === "ArrowUp") {
      const idx = Math.min(cmdIdx + 1, cmdHistory.length - 1);
      setCmdIdx(idx);
      setInput(cmdHistory[idx] || "");
      e.preventDefault();
      return;
    }
    if (e.key === "ArrowDown") {
      const idx = Math.max(cmdIdx - 1, -1);
      setCmdIdx(idx);
      setInput(idx === -1 ? "" : cmdHistory[idx]);
      e.preventDefault();
    }
  };

  return (
    <div
      ref={cardRef}
      className="widget-card no-select"
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        zIndex: 23,
        width: isMobile ? `${viewport.w - 32}px` : "min(288px, calc(100vw - 24px))",
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "12px",
        overflow: "hidden",
        fontFamily: "monospace",
        fontSize: isMobile ? "11px" : "12px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.06)",
          padding: "7px 11px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          cursor: "grab",
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e", display: "inline-block" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginLeft: "8px" }}>
          root@aswinsagar.com ~ $
        </span>
      </div>

      <div
        ref={bodyRef}
        className="terminal-body"
        style={{
          height: isMobile ? "120px" : "135px",
          overflowY: "auto",
          overflowX: "hidden",
          wordBreak: "break-all",
          whiteSpace: "pre-wrap",
          padding: "9px 11px",
        }}
      >
        {history.map((line, i) =>
          line.type === "output" ? (
            <div
              key={`${line.type}-${i}`}
              style={{
                color: "rgba(255,255,255,0.6)",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
                maxWidth: "100%",
                lineHeight: 1.5,
                marginBottom: "2px",
              }}
            >
              {line.text}
            </div>
          ) : (
            <div key={`${line.type}-${i}`} style={{ marginBottom: "2px", lineHeight: 1.5 }}>
              <span style={{ color: "#00ff41" }}>$ </span>
              <span style={{ color: "#fff" }}>{line.text}</span>
            </div>
          )
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 11px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
          minHeight: "40px",
        }}
      >
        <span style={{ color: "#00ff41", marginRight: "6px", fontWeight: "bold" }}>$</span>
        <span className="terminal-cursor" style={{ marginRight: "8px" }} />
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#fff",
            fontFamily: "monospace",
            fontSize: isMobile ? "11px" : "12px",
            flex: 1,
            caretColor: "#00ff41",
          }}
          placeholder="type a command..."
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
