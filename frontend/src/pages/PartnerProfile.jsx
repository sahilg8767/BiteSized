import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import ReelFeed from "../components/ReelFeed";

// Public partner profile: shows the partner's reels as a feed. (Partner meta
// like name/address is enriched in Phase 4 with a dedicated endpoint.)
const PartnerProfile = () => {
  const { id } = useParams();
  const [partnerName, setPartnerName] = useState("");

  const fetcher = () => api.get(`/api/food/partner/${id}`);

  // grab a name from the first reel's populated partner if available
  useEffect(() => {
    api
      .get(`/api/food/partner/${id}`)
      .then(({ data }) => {
        const first = data.foodItems?.[0];
        if (first?.foodPartner?.name) setPartnerName(first.foodPartner.name);
      })
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
        {partnerName && (
          <span className="pointer-events-auto text-sm font-semibold text-white drop-shadow">
            @{partnerName}
          </span>
        )}
      </header>
      <ReelFeed fetcher={fetcher} emptyText="This partner has no reels yet" />
    </main>
  );
};

export default PartnerProfile;
