import { useState } from "react";

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    if (replace) {
      const modes = history.slice(0, history.length - 1)
      modes.push(newMode)
      setHistory(modes)
    } else {
      setHistory(prev => [...prev, newMode]);
    }
  }

  function back() {
    setHistory(prev => prev.length === 1 ? [...prev] : [...prev.slice(0, prev.length - 1)]);
  }

  return { mode: history[history.length - 1], transition, back };
};

