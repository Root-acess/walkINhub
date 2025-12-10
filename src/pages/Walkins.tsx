import React, { useEffect, useMemo, useState } from "react";
import { MapPin, Search, Heart, ExternalLink, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
export type WalkIn = {
  id: string;
  title: string;
  company: string;
  location: string;
  date: string; // ISO string
  time?: string;
  type: "Walk-In" | "Drive-In" | "Interview" | "Interview Drive";
  experience?: string;
  salary?: string;
  short?: string;
  description?: string;
  venue?: string;
  contact?: string;
};

// --- Mock data (replace with API later) ---
const MOCK_WALKINS: WalkIn[] = [
  {
    id: "w1",
    title: "Tech Support Executive",
    company: "HCL Technologies",
    location: "Hyderabad",
    date: "2025-12-05",
    time: "10:00 AM - 5:00 PM",
    type: "Walk-In",
    experience: "0–2 years",
    salary: "₹15,000 - ₹22,000",
    short: "On-the-spot interviews. Bring resume and ID proof.",
    description:
      "We are hiring Tech Support Executives for voice process. Good communication and basic technical knowledge required.",
    venue: "HCL Campus, Madhapur, Hyderabad",
    contact: "hr@hcl.com",
  },
  {
    id: "w2",
    title: "Junior Software Developer",
    company: "TCS",
    location: "Chennai",
    date: "2025-12-03",
    time: "11:00 AM - 4:00 PM",
    type: "Walk-In",
    experience: "0–1 year",
    salary: "₹25,000 - ₹40,000",
    short: "Hiring freshers with strong problem-solving skills.",
    description:
      "Looking for passionate developers with good knowledge of DS & Algo, OOPs and basic web technologies.",
    venue: "TCS IT Park, Sholinganallur, Chennai",
    contact: "careers@tcs.com",
  },
  {
    id: "w3",
    title: "HR Recruitment Associate",
    company: "Infosys",
    location: "Bangalore",
    date: "2025-12-10",
    time: "9:30 AM - 3:00 PM",
    type: "Interview Drive",
    experience: "0–3 years",
    salary: "₹18,000 - ₹26,000",
    short: "Interview drive for entry-level HR associates.",
    description:
      "You will handle end-to-end recruitment activities including sourcing, screening and coordination.",
    venue: "Infosys Campus, Electronic City, Bangalore",
    contact: "recruitment@infosys.com",
  },
];

const CITIES = ["All", "Hyderabad", "Bangalore", "Chennai", "Pune", "Mumbai"];
const TYPES = ["All", "Walk-In", "Drive-In", "Interview", "Interview Drive"] as const;

// --- Utility: format date ---
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// --- FiltersBar ---
interface FiltersBarProps {
  query: string;
  setQuery: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  walkInType: string;
  setWalkInType: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
}

const FiltersBar: React.FC<FiltersBarProps> = ({
  query,
  setQuery,
  city,
  setCity,
  walkInType,
  setWalkInType,
  sort,
  setSort,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex flex-col md:flex-row gap-3 items-center">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-md px-3 py-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by role, company or skill"
            className="bg-transparent focus:outline-none w-full text-sm text-gray-800"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 items-center w-full md:w-auto">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 md:flex-none rounded-md border px-3 py-2 text-sm bg-white"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={walkInType}
            onChange={(e) => setWalkInType(e.target.value)}
            className="flex-1 md:flex-none rounded-md border px-3 py-2 text-sm bg-white"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="flex-1 md:flex-none rounded-md border px-3 py-2 text-sm bg-white"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="company">Company A → Z</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// --- WalkInCard ---
interface WalkInCardProps {
  walkin: WalkIn;
  onOpen: (w: WalkIn) => void;
  saved: boolean;
  onToggleSave: (id: string) => void;
}

const WalkInCard: React.FC<WalkInCardProps> = ({
  walkin,
  onOpen,
  saved,
  onToggleSave,
}) => {
  const venueOrLocation = walkin.venue ?? walkin.location;

  return (
    <article className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {walkin.title}
            </h3>
            <p className="text-sm text-blue-600 font-medium mt-1">
              {walkin.company}
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              {walkin.location}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-gray-500">
              {formatDate(walkin.date)}
            </span>
            <button
              onClick={() => onToggleSave(walkin.id)}
              aria-pressed={saved}
              aria-label={saved ? "Unsave walk-in" : "Save walk-in"}
              className="p-2 rounded-md border hover:bg-gray-50"
            >
              <Heart className={`w-4 h-4 ${saved ? "text-pink-500" : "text-gray-400"}`} />
            </button>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-700">
          {walkin.short || walkin.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 items-center text-xs">
          <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700">
            {walkin.type}
          </span>
          {walkin.experience && (
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {walkin.experience}
            </span>
          )}
          {walkin.salary && (
            <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
              {walkin.salary}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onOpen(walkin)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700"
        >
          View Details
        </button>
        <a
          href={`https://www.google.com/maps/search/${encodeURIComponent(
            venueOrLocation
          )}`}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-2 border rounded-md text-sm flex items-center gap-1.5 hover:bg-gray-50"
        >
          <Map className="w-4 h-4" />
          Directions
        </a>
      </div>
    </article>
  );
};

// --- DetailsModal ---
interface DetailsModalProps {
  walkin?: WalkIn;
  onClose: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ walkin, onClose }) => {
  if (!walkin) return null;

  const venueOrLocation = walkin.venue ?? walkin.location;

  return (
    <AnimatePresence>
      {walkin && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={onClose}
            className="absolute inset-0 bg-black/40"
          />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 z-10"
          >
            <header className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {walkin.title}
                </h3>
                <p className="text-sm text-blue-600">{walkin.company}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(walkin.date)}
                  {walkin.time ? ` • ${walkin.time}` : null}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 text-sm hover:text-gray-700"
              >
                Close
              </button>
            </header>

            <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Venue</h4>
                <p className="text-sm text-gray-700 mt-1">{venueOrLocation}</p>

                {walkin.contact && (
                  <>
                    <h4 className="text-sm font-medium text-gray-700 mt-4">
                      Contact
                    </h4>
                    <p className="text-sm text-gray-700 mt-1">
                      {walkin.contact}
                    </p>
                  </>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  About this role
                </h4>
                <p className="text-sm text-gray-700 mt-1">
                  {walkin.description || walkin.short}
                </p>

                {walkin.salary && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">
                      Salary
                    </h4>
                    <p className="text-sm text-gray-700 mt-1">
                      {walkin.salary}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <footer className="mt-6 flex justify-end gap-3">
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(
                  venueOrLocation
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 border rounded-md flex items-center gap-2 text-sm hover:bg-gray-50"
              >
                <Map className="w-4 h-4" />
                Open in Maps
              </a>

              {walkin.contact && (
                <a
                  href={`mailto:${walkin.contact}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 text-sm font-semibold hover:bg-blue-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  Contact HR
                </a>
              )}
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Main Page ---
const WalkInsPage: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [city, setCity] = useState<string>("All");
  const [walkInType, setWalkInType] = useState<string>("All");
  const [sort, setSort] = useState<string>("newest");
  const [open, setOpen] = useState<WalkIn | undefined>(undefined);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [showMap, setShowMap] = useState<boolean>(false);

  // Load saved from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("walkinhub.walkins.saved");
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  // Persist saved to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("walkinhub.walkins.saved", JSON.stringify(saved));
    } catch {
      // ignore
    }
  }, [saved]);

  const toggleSave = (id: string) =>
    setSaved((prev) => ({ ...prev, [id]: !prev[id] }));

  const filtered = useMemo(() => {
    let items = [...MOCK_WALKINS];

    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter((i) =>
        (i.title + i.company + (i.description ?? "") + (i.short ?? ""))
          .toLowerCase()
          .includes(q)
      );
    }

    if (city !== "All") {
      items = items.filter((i) => i.location === city);
    }

    if (walkInType !== "All") {
      items = items.filter((i) => i.type === walkInType);
    }

    if (sort === "newest") {
      items.sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (sort === "oldest") {
      items.sort(
        (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } else if (sort === "company") {
      items.sort((a, b) => a.company.localeCompare(b.company));
    }

    return items;
  }, [query, city, walkInType, sort]);

  const savedIds = Object.keys(saved).filter((id) => saved[id]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Walkins & Interview Drives
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Discover verified, city-filtered walk-in opportunities updated
            regularly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMap((s) => !s)}
            className="px-3 py-2 rounded-md border flex items-center gap-2 text-sm hover:bg-gray-50"
          >
            <Map className="w-4 h-4" />
            {showMap ? "Hide Map" : "Show Map"}
          </button>
          <button className="px-3 py-2 rounded-md border text-sm hover:bg-gray-50">
            Post a Walk-in
          </button>
        </div>
      </header>

      <section className="grid lg:grid-cols-3 gap-6">
        {/* Left: List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <FiltersBar
            query={query}
            setQuery={setQuery}
            city={city}
            setCity={setCity}
            walkInType={walkInType}
            setWalkInType={setWalkInType}
            sort={sort}
            setSort={setSort}
          />

          <div className="mt-4 grid md:grid-cols-2 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-gray-600 text-sm">
                No walk-ins found. Try changing filters or search query.
              </div>
            ) : (
              filtered.map((item) => (
                <WalkInCard
                  key={item.id}
                  walkin={item}
                  onOpen={setOpen}
                  saved={!!saved[item.id]}
                  onToggleSave={toggleSave}
                />
              ))
            )}
          </div>
        </div>

        {/* Right: Sidebar */}
        <aside className="hidden lg:block space-y-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h4 className="font-semibold text-gray-900 text-sm">
              Upcoming Cities
            </h4>
            <ul className="mt-3 text-sm text-gray-700 space-y-2">
              {CITIES.filter((c) => c !== "All").map((c) => (
                <li key={c} className="flex items-center justify-between">
                  <span>{c}</span>
                  <span className="text-xs text-gray-500">
                    {MOCK_WALKINS.filter((w) => w.location === c).length}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <h4 className="font-semibold text-gray-900 text-sm">
                Saved Walkins
              </h4>
              <ul className="mt-2 text-sm text-gray-700 space-y-1 max-h-40 overflow-y-auto">
                {savedIds.length === 0 ? (
                  <li className="text-gray-500 text-xs">
                    No saved walk-ins yet.
                  </li>
                ) : (
                  savedIds.map((id) => {
                    const item = MOCK_WALKINS.find((m) => m.id === id);
                    if (!item) return null;
                    return (
                      <li key={id} className="flex justify-between gap-2">
                        <span className="truncate">{item.title}</span>
                        <span className="text-xs text-gray-400">
                          {item.location}
                        </span>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </div>

          {showMap && (
            <div className="bg-white h-72 rounded-lg border flex items-center justify-center text-gray-500 text-sm">
              Map placeholder — integrate Google Maps / Leaflet here.
            </div>
          )}
        </aside>
      </section>

      <DetailsModal walkin={open} onClose={() => setOpen(undefined)} />
    </div>
  );
};

export default WalkInsPage;
