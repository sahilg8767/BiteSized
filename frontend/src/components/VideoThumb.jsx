import { useEffect, useRef } from "react";

// A muted, looping video that only plays while on screen (keeps a grid/carousel
// of thumbnails smooth). Used for restaurant covers and trending reels.
const VideoThumb = ({ src, className = "" }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      className={className}
    />
  );
};

export default VideoThumb;
