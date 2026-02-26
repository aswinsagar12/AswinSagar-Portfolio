import { useEffect } from "react";

const useScrollReveal = (ref, options = { threshold: 0.15 }) => {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof window !== "undefined" && !("IntersectionObserver" in window)) {
      node.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, options);

    observer.observe(node);

    return () => observer.disconnect();
  }, [ref, options]);
};

export default useScrollReveal;
