// src/pages/HomePage.tsx
import React, { useMemo, useState, useEffect } from "react";
import {
  MapPin,
  Briefcase,
  Bell,
  Heart as HeartIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "../assets/hero.svg";
import JobSearchBar from "../components/JobSearchBar/index";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  salary: string;
  type: string;
  date: string;
  short?: string;
};

type FeatureCard = {
  title: string;
  text: string;
  icon: React.ComponentType<any>;
};

const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "Real-Time Alerts",
    text: "Get instant notifications when new walk-ins are posted in your city.",
    icon: Bell,
  },
  {
    title: "Verified Companies",
    text: "Every listing is verified to ensure legitimate job opportunities.",
    icon: Briefcase,
  },
  {
    title: "City-Based Walk-Ins",
    text: "Browse walk-ins in Hyderabad, Bangalore, Chennai, Pune & more.",
    icon: MapPin,
  },
];

const LATEST_JOBS: Job[] = [
  {
    id: "hcl-001",
    title: "Tech Support Executive",
    company: "HCL Technologies",
    location: "Hyderabad",
    experience: "0–2 years",
    salary: "₹15,000 – ₹22,000",
    type: "Walk-In",
    date: "Today",
    short: "Customer support & troubleshooting. Freshers welcome.",
  },
  {
    id: "tcs-002",
    title: "Junior Software Developer",
    company: "TCS",
    location: "Chennai",
    experience: "0–1 year",
    salary: "₹25,000 – ₹40,000",
    type: "Walk-In",
    date: "Today",
    short: "Work with JavaScript/React. Immediate joining preferred.",
  },
  {
    id: "inf-003",
    title: "HR Recruitment Associate",
    company: "Infosys",
    location: "Bangalore",
    experience: "0–3 years",
    salary: "₹18,000 – ₹26,000",
    type: "Walk-In",
    date: "Yesterday",
    short: "Handle screening, interviews & coordination.",
  },
  {
    id: "tm-004",
    title: "Customer Support (Voice)",
    company: "Tech Mahindra",
    location: "Pune",
    experience: "0–2 years",
    salary: "₹16,000 – ₹24,000",
    type: "Walk-In",
    date: "2 days ago",
    short: "Voice process for product support.",
  },
  {
    id: "wip-005",
    title: "IT Helpdesk Associate",
    company: "Wipro",
    location: "Hyderabad",
    experience: "0–1 year",
    salary: "₹18,000 – ₹28,000",
    type: "Walk-In",
    date: "2 days ago",
    short: "Basic IT support & ticket handling.",
  },
  {
    id: "cog-006",
    title: "Process Executive (Non-Voice)",
    company: "Cognizant",
    location: "Bangalore",
    experience: "0–2 years",
    salary: "₹17,000 – ₹25,000",
    type: "Walk-In",
    date: "3 days ago",
    short: "Back-office process role for freshers.",
  },
];

const CITIES = ["Hyderabad", "Bangalore", "Chennai", "Pune", "Mumbai", "Delhi"];

export default function HomePage(): React.ReactElement {
  const [keyword, setKeyword] = useState<string>("");
  const [cityFilter, setCityFilter] = useState<string>("All");
  const [expFilter, setExpFilter] = useState<string>("All");
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Optional: persist saved bookmarks to localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("walkinhub.saved");
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("walkinhub.saved", JSON.stringify(saved));
    } catch {
      /* ignore */
    }
  }, [saved]);

  const toggleSave = (id: string) => {
    setSaved((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Simulate real fetch / loading state if you later swap to API
  useEffect(() => {
    // simulate a small loading effect on mount
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filteredJobs = useMemo(() => {
    return LATEST_JOBS.filter((job) => {
      const q = keyword.trim().toLowerCase();
      const matchesKeyword =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        (job.short ?? "").toLowerCase().includes(q);

      const matchesCity = cityFilter === "All" || job.location === cityFilter;

      const matchesExp =
        expFilter === "All" ||
        (expFilter === "Fresher" && job.experience.includes("0")) ||
        (expFilter === "0–2 years" && job.experience.includes("0–2")) ||
        (expFilter === "1–3 years" && job.experience.includes("1–3"));

      return matchesKeyword && matchesCity && matchesExp;
    });
  }, [keyword, cityFilter, expFilter]);

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-8 py-12 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-sm font-medium text-blue-600 uppercase tracking-wide mb-4 top-2">
            India’s walk-in job finder
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
            Find Verified{" "}
            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Walk-In{" "}
            </span>
            Jobs Near You Instantly
          </h1>

          <p className="text-gray-600 mt-4 text-lg max-w-xl">
            walkINhub curates verified walk-in interviews and sends real-time alerts from
            top companies across India — no spam, only relevant opportunities.
          </p>

          <div className="mt-6">
            <JobSearchBar
              keyword={keyword}
              setKeyword={setKeyword}
              city={cityFilter}
              setCity={setCityFilter}
              exp={expFilter}
              setExp={setExpFilter}
              cities={CITIES}
            />
          </div>

          <div className="mt-4 text-xs md:text-sm text-gray-500 flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500" aria-hidden />
            <span>
              Live: New walk-ins added today in{" "}
              <span className="font-semibold text-gray-700">
                Hyderabad, Bangalore, Chennai
              </span>
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center items-center"
        >
          <motion.img
            src={heroImage}
            alt="Illustration showing job seekers and interviews"
            className="w-80 sm:w-96 md:w-[420px] lg:w-[460px] xl:w-[520px]"
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            loading="lazy"
            role="img"
          />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-14 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Why Choose <span className="text-blue-600">walkINhub?</span>
          </h2>
          <p className="text-center text-gray-600 mt-2 max-w-2xl mx-auto">
            A platform built for job seekers to stay ahead with real-time walk-in alerts and verified openings.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {FEATURE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45 }}
                  className="p-6 bg-gray-50 rounded-xl shadow-sm border hover:shadow-md transition"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mt-4">{card.title}</h3>
                  <p className="text-gray-600 mt-2">{card.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* BROWSE BY CITY */}
      <section className="bg-blue-50 border-t border-b border-blue-100 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-3">
          <p className="font-medium text-gray-800 text-sm md:text-base">Browse walk-ins by city:</p>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCityFilter(c)}
                className={`px-3 py-1 rounded-full text-xs md:text-sm border ${
                  cityFilter === c ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {c}
              </button>
            ))}
            <button
              onClick={() => setCityFilter("All")}
              className="px-3 py-1 rounded-full text-xs md:text-sm border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              All
            </button>
          </div>
        </div>
      </section>

      {/* LATEST JOBS */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 text-center"
          >
            Latest Walk-In Opportunities
          </motion.h2>

          <p className="text-center text-gray-600 mt-2 max-w-2xl mx-auto">
            Updated daily with openings from top companies across India.
          </p>

          <div className="mt-6 text-sm text-gray-600 flex justify-between items-center">
            <span>
              Showing <span className="font-semibold">{filteredJobs.length}</span> of {LATEST_JOBS.length} jobs
            </span>
            <div className="text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
            }}
            className="grid md:grid-cols-3 gap-8 mt-8"
          >
            {loading ? (
              // simple skeleton placeholders
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 rounded-xl bg-white p-6 border animate-pulse" />
              ))
            ) : filteredJobs.length === 0 ? (
              <div className="col-span-3 text-center text-gray-600 py-16">No jobs found — try different keywords or filters.</div>
            ) : (
              filteredJobs.map((job) => (
                <motion.article
                  key={job.id}
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                  className="bg-white p-6 border rounded-xl shadow-sm hover:shadow-lg transition flex flex-col justify-between"
                  aria-labelledby={`job-${job.id}-title`}
                >
                  <div>
                    <h3 id={`job-${job.id}-title`} className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-blue-600 font-medium mt-1">{job.company}</p>
                    <p className="text-gray-500 mt-1 text-sm">📍 {job.location}</p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">{job.type}</span>
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">{job.experience}</span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">{job.salary}</span>
                    </div>

                    <p className="mt-3 text-xs text-gray-500">Posted: {job.date}</p>
                    <p className="mt-3 text-sm text-gray-700">{job.short}</p>
                  </div>

                  <div className="mt-4 flex gap-3 items-center">
                    <button
                      onClick={() => alert("Open details modal or navigate to job page (implement API).")}
                      className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-sm"
                    >
                      View Details & Walk-In Timing
                    </button>

                    <button
                      onClick={() => toggleSave(job.id)}
                      aria-pressed={!!saved[job.id]}
                      aria-label={saved[job.id] ? "Unsave job" : "Save job"}
                      className="p-2 rounded-md border hover:bg-gray-50"
                      title={saved[job.id] ? "Unsave" : "Save"}
                    >
                      <HeartIcon className={`w-5 h-5 ${saved[job.id] ? "text-pink-500" : "text-gray-400"}`} />
                    </button>
                  </div>
                </motion.article>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="bg-linear-to-r from-blue-600 to-indigo-600 py-14"
      >
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Never Miss a Walk-In Opportunity Again</h2>
          <p className="text-blue-100 text-lg mt-3">Join thousands of job seekers receiving instant walk-in alerts directly on their phone.</p>

          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="mt-6 px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100">
            Get Job Alerts Now
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}
