import { useEffect, useMemo, useState } from "react";

const AnimatedCount = ({ value = 0, duration = 800, decimals = 0, className = "" }) => {
  const finalValue = Number(value || 0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let frame;
    const start = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      setCurrent(finalValue * progress);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [finalValue, duration]);

  const formatted = useMemo(() => {
    return decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString();
  }, [current, decimals]);

  return <span className={className}>{formatted}</span>;
};

export default AnimatedCount;

