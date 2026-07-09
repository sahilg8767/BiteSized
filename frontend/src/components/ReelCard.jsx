import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaBookmark,
  FaRegBookmark,
  FaVolumeHigh,
  FaVolumeXmark,
  FaPlay,
  FaCartPlus,
} from "react-icons/fa6";
import VideoThumb from "./VideoThumb";

// One full-screen reel: video autoplays when it scrolls into view, pauses when
// it leaves. Tap toggles play/pause. Overlay shows the dish info + actions.
const ReelCard = ({
  food,
  muted,
  onToggleMute,
  onLike,
  onSave,
  onComment,
  onAddToCart,
}) => {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // IntersectionObserver to toggle visibility state on the card container
  useEffect(() => {
    const container = cardRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Trigger play/pause when visibility changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      video.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isVisible]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || !isVisible) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const partner = food.foodPartner;
  const partnerId = partner?._id || partner;

  return (
    <section ref={cardRef} className="relative h-[100dvh] w-full snap-start snap-always overflow-hidden bg-black">
      {isVisible ? (
        <video
          ref={videoRef}
          src={food.video}
          className="h-full w-full object-cover"
          loop
          muted={muted}
          playsInline
          autoPlay
          onClick={togglePlay}
        />
      ) : (
        <div className="h-full w-full bg-zinc-950 flex items-center justify-center relative">
          <VideoThumb src={food.video} className="h-full w-full object-cover opacity-35 blur-xs" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          </div>
        </div>
      )}

      {/* tap-to-play affordance when paused */}
      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
          aria-label="Play"
        >
          <span className="rounded-full bg-black/40 p-5 backdrop-blur">
            <FaPlay className="text-3xl text-white" />
          </span>
        </button>
      )}

      {/* darkening gradient so overlay text stays readable */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* mute toggle */}
      <button
        type="button"
        onClick={onToggleMute}
        className="absolute right-4 top-4 z-10 rounded-full bg-black/40 p-2.5 text-white backdrop-blur"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <FaVolumeXmark /> : <FaVolumeHigh />}
      </button>

      {/* right action rail */}
      <div className="absolute bottom-28 right-4 z-20 flex flex-col items-center gap-4 text-white">
        <ActionButton
          onClick={() => onLike?.(food)}
          active={food.isLiked}
          icon={food.isLiked ? <FaHeart className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" /> : <FaRegHeart />}
          count={food.likeCount}
        />
        <ActionButton
          onClick={() => onComment?.(food)}
          icon={<FaRegComment />}
          count={food.commentsCount}
        />
        <ActionButton
          onClick={() => onSave?.(food)}
          active={food.isSaved}
          icon={food.isSaved ? <FaBookmark className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" /> : <FaRegBookmark />}
          count={food.savesCount}
        />
      </div>

      {/* bottom info + order */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-5 pb-8 text-white">
        {partner?.name && (
          <Link
            to={`/partner/${partnerId}`}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md border border-white/10 hover:bg-white/20 transition duration-200"
          >
            @{partner.name}
          </Link>
        )}
        <h2 className="mt-2 text-xl font-extrabold tracking-tight">{food.name}</h2>
        {food.description && (
          <p className="mt-1 line-clamp-2 max-w-[85%] text-xs font-medium text-white/80 leading-relaxed">
            {food.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="text-xl font-black text-white">₹{food.price}</span>
          <button
            type="button"
            onClick={() => onAddToCart?.(food)}
            className="pointer-events-auto flex-1 flex items-center justify-center rounded-xl bg-brand py-3 text-xs font-extrabold text-white shadow-md shadow-brand/20 transition hover:bg-brand-dark active:scale-95 duration-200 cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
};

const ActionButton = ({ icon, count, onClick, active }) => (
  <button type="button" onClick={onClick} className="flex flex-col items-center gap-1 group">
    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/45 hover:bg-black/60 border border-white/10 text-xl backdrop-blur-md transition-all duration-300 group-hover:scale-110 active:scale-90 cursor-pointer">
      {icon}
    </span>
    {typeof count === "number" && (
      <span className="text-[11px] font-bold text-white/90 drop-shadow-sm">{count}</span>
    )}
  </button>
);

export default ReelCard;
