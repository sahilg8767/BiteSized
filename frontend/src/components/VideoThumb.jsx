import { useEffect, useRef } from "react";

// A muted, looping video that plays while on screen (keeps a grid/carousel of
// thumbnails smooth). We set `muted` imperatively because React's `muted`
// attribute is unreliable and browsers block autoplay on non-muted video.
const VideoThumb = ({ src, className = "" }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      className={className}
      style={{ background: "linear-gradient(135deg,#1e1e28,#0f0f16)" }}
    />
  );
};

export default VideoThumb;
