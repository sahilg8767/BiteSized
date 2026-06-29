import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import ReelFeed from "../components/ReelFeed";

// Public partner profile: shows the partner's reels as a feed. (Partner meta
// like name/address is enriched in Phase 4 with a dedicated endpoint.)
const PartnerProfile = () => {
  const { id } = useParams();
  const [partner, setPartner] = useState(null);

  const fetcher = () => api.get(`/api/food/partner/${id}`);

  useEffect(() => {
    api
      .get(`/api/food-partner/${id}`)
      .then(({ data }) => setPartner(data.foodPartner))
      .catch(() => {});
  }, [id]);

  return (
    <main className="relative">
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 mx-auto flex max-w-md items-center justify-between p-4">
        <Link
          to="/"
          className="pointer-events-auto rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium text-white backdrop-blur"
        >
          ← Home
        </Link>
        {partner?.name && (
          <span className="pointer-events-auto max-w-[60%] truncate text-right text-sm font-semibold text-white drop-shadow">
            @{partner.name}
          </span>
        )}
      </header>
      <ReelFeed fetcher={fetcher} emptyText="This partner has no reels yet" />
    </main>
  );
};

export default PartnerProfile;
