import React, { useEffect, useRef, useState } from "react";

const COMMANDS = {
  whoami: () => "aswin - sre @ aswinsagar.com",
  date: () => new Date().toString(),
  uptime: () => `up ${Math.floor(Math.random() * 999)} days, running strong`,
  echo: (args) => args || "",
  help: () =>
    "commands: whoami, date, uptime, echo [text], clear, skills, about, experience, creative, testimonials, test, projects, work, contact, home, mail, linkedin, github, hello, pwd, ls",
  skills: () =>
    "aws · docker · k8s · terraform · gcp · linux · python · nodejs · grafana · prometheus",
  clear: () => "__CLEAR__",
  hello: () => "Hello, world!",
  pwd: () => "/srv/aswinsagar.com",
  ls: () => "about/  skills/  experience/  creative/  testimonials/  contact/  links/",
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

export default function TerminalWidget() {
  const cardRef = useRef(null);
  const [pos, setPos] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1280;
    const h = typeof window !== "undefined" ? window.innerHeight : 900;
    const mobile = w <= 768;
    return mobile
      ? { x: 12, y: Math.max(220, Math.floor(h * 0.52)) }
      : { x: 120, y: Math.max(h - 280, 320) };
  });
  const [history, setHistory] = useState([
    { type: "output", text: "Welcome to aswinsagar-shell v1.0.0" },
    { type: "output", text: "Type help for available commands." },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [cmdIdx, setCmdIdx] = useState(-1);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const bottomRef = useRef(null);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const inputValueRef = useRef("");

  const clampPos = (x, y) => {
    const width = cardRef.current?.offsetWidth || 320;
    const height = cardRef.current?.offsetHeight || 240;
    const minX = 8;
    const minY = 8;
    const maxX = Math.max(minX, window.innerWidth - width - 8);
    const maxY = Math.max(minY, window.innerHeight - height - 8);
    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  };

  const onMouseDown = (e) => {
    if (e.target === inputRef.current) return;
    isDragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  const onTouchStart = (e) => {
    if (e.target === inputRef.current) return;
    const t = e.touches[0];
    if (!t) return;
    isDragging.current = true;
    offset.current = { x: t.clientX - pos.x, y: t.clientY - pos.y };
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging.current) return;
      setPos(clampPos(e.clientX - offset.current.x, e.clientY - offset.current.y));
    };
    const onTouchMove = (e) => {
      if (!isDragging.current) return;
      const t = e.touches[0];
      if (!t) return;
      setPos(clampPos(t.clientX - offset.current.x, t.clientY - offset.current.y));
    };
    const onUp = () => {
      isDragging.current = false;
    };
    const onResize = () => {
      setPos((prev) => clampPos(prev.x, prev.y));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onUp);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("resize", onResize);
    };
  }, []);

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
        if (name === "mail") {
          window.location.href = externalUrl;
        } else {
          window.open(externalUrl, "_blank", "noopener,noreferrer");
        }
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
      const isEditable =
        tag === "input" || tag === "textarea" || target?.isContentEditable;
      if (isEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "Enter") {
        if (inputValueRef.current.trim()) {
          runCommand(inputValueRef.current);
        }
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
      onTouchStart={onTouchStart}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        zIndex: 23,
        width: "min(288px, calc(100vw - 24px))",
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "12px",
        overflow: "hidden",
        fontFamily: "monospace",
        fontSize: "12px",
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
        <span
          style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }}
        />
        <span
          style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e", display: "inline-block" }}
        />
        <span
          style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block" }}
        />
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginLeft: "8px" }}>
          root@aswinsagar.com ~ $
        </span>
      </div>

      <div
        ref={bodyRef}
        className="terminal-body"
        style={{ height: "135px", overflowY: "auto", padding: "9px 11px" }}
      >
        {history.map((line, i) => (
          <div key={`${line.type}-${i}`} style={{ marginBottom: "2px", lineHeight: 1.5 }}>
            {line.type === "input" ? (
              <span>
                <span style={{ color: "#00ff41" }}>$ </span>
                <span style={{ color: "#fff" }}>{line.text}</span>
              </span>
            ) : (
              <span style={{ color: "rgba(255,255,255,0.6)" }}>{line.text}</span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
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
            fontSize: "13px",
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
