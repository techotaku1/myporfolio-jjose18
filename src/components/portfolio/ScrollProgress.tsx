'use client';

import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      setProgress(total > 0 ? (scrollTop / total) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () =>{  window.removeEventListener('scroll', update); };
  }, []);

  return (
    <div
      className="scroll-progress-track"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="scroll-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
}
