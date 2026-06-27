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
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Play/pause based on how much of the card is visible.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.6) {
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: [0, 0.6, 1] }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
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
    <section className="relative h-[100dvh] w-full snap-start snap-always overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={food.video}
        className="h-full w-full object-cover"
        loop
        muted={muted}
        playsInline
        onClick={togglePlay}
      />

      {/* tap-to-play affordance when paused */}
      {!isPlaying && (
        <button
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
        onClick={onToggleMute}
        className="absolute right-4 top-4 z-10 rounded-full bg-black/40 p-2.5 text-white backdrop-blur"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <FaVolumeXmark /> : <FaVolumeHigh />}
      </button>

      {/* right action rail */}
      <div className="absolute bottom-28 right-3 z-10 flex flex-col items-center gap-5 text-white">
        <ActionButton
          onClick={() => onLike?.(food)}
          active={food.isLiked}
          icon={food.isLiked ? <FaHeart className="text-brand" /> : <FaRegHeart />}
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
          icon={food.isSaved ? <FaBookmark className="text-brand" /> : <FaRegBookmark />}
          count={food.savesCount}
        />
      </div>

      {/* bottom info + order */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 pb-6 text-white">
        {partner?.name && (
          <Link
            to={`/partner/${partnerId}`}
            className="inline-block text-sm font-semibold text-white/90 hover:underline"
          >
            @{partner.name}
          </Link>
        )}
        <h2 className="mt-1 text-lg font-bold">{food.name}</h2>
        {food.description && (
          <p className="mt-1 line-clamp-2 max-w-[80%] text-sm text-white/80">
            {food.description}
          </p>
        )}

        <div className="mt-3 flex items-center gap-3">
          <span className="text-xl font-extrabold">₹{food.price}</span>
          <button
            onClick={() => onAddToCart?.(food)}
            className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark active:scale-95"
          >
            <FaCartPlus /> Add to cart
          </button>
        </div>
      </div>
    </section>
  );
};

const ActionButton = ({ icon, count, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1">
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl backdrop-blur transition active:scale-90">
      {icon}
    </span>
    {typeof count === "number" && (
      <span className="text-xs font-medium">{count}</span>
    )}
  </button>
);

export default ReelCard;
