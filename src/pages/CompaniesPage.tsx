import { useMemo, useState, type JSX } from "react";
import {
  ExternalLink,
  Download,
  Eye,
  Globe,
  Star,
} from "lucide-react";

/* -------------------------
  Keep your Company type + data generator
  (I've reused your generateMockCompanies and helpers)
------------------------- */

export type Company = {
  id: string;
  name: string;
  industry: string;
  headquarters: string;
  website?: string;
  rating?: number; // 1..5
  fresherFriendly: boolean;
  interviewDump: string;
  peakHiringMonths: string[]; // e.g. ["Jan","Feb"]
  avgVacanciesPerMonth: number;
  typicalHiringDates: string[]; // YYYY-MM-DD
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// small deterministic generator (same as you had)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* copy your base arrays (trimmed) */
const BASE_COMPANY_NAMES = [
  "TCS",
  "Wipro",
  "Infosys",
  "HCL Technologies",
  "Tech Mahindra",
  "Cognizant",
  "Accenture",
  "Capgemini",
  "LTI",
  "Mindtree",
  "Oracle",
  "IBM",
  "Amazon",
  "Flipkart",
  "Reliance Digital",
  "Zeta",
  "Freshworks",
  "Zoho",
  "Paytm",
  "PhonePe",
  "Ola",
  "Swiggy",
  "Zomato",
  "Deloitte",
  "KPMG",
  "EY",
  "PWC",
  "Infoshell",
  "CodeCrafters",
  "ByteWave",
  "CloudNexus",
  "InfraWorks",
  "DataPulse",
  "NextGen Labs",
  "Greenfield Systems",
  "BlueOrbit",
  "UrbanSoft",
  "EduCore",
  "HealthAxis",
  "AgriGrow",
  "RetailOne",
];

const INDUSTRIES = [
  "IT Services",
  "Product",
  "E-commerce",
  "Finance",
  "Consulting",
  "Healthcare",
  "Education",
  "Logistics",
  "Manufacturing",
  "AgriTech",
];

function generateMockCompanies(count = 120): Company[] {
  const rand = mulberry32(12345);
  const list: Company[] = [];

  for (let i = 0; i < count; i++) {
    const base = BASE_COMPANY_NAMES[i % BASE_COMPANY_NAMES.length];
    const suffix = i >= BASE_COMPANY_NAMES.length ? ` ${Math.floor(i / 10)}` : "";
    const name = `${base}${suffix}`;
    const industry = INDUSTRIES[Math.floor(rand() * INDUSTRIES.length)];
    const hqCity = ["Bengaluru", "Hyderabad", "Chennai", "Pune", "Mumbai", "Delhi"][Math.floor(rand() * 6)];
    const website = `https://www.${name.replace(/\s+/g, "").toLowerCase()}.com`;
    const rating = Math.round((2 + rand() * 3) * 10) / 10; // 2.0 - 5.0
    const fresherFriendly = rand() > 0.45;

    const peakCount = 2 + Math.floor(rand() * 3);
    const peakHiringMonths: string[] = [];
    const used: Record<string, boolean> = {};
    while (peakHiringMonths.length < peakCount) {
      const m = MONTHS[Math.floor(rand() * MONTHS.length)];
      if (!used[m]) {
        used[m] = true;
        peakHiringMonths.push(m);
      }
    }

    const avgVacanciesPerMonth = Math.floor(5 + rand() * 150);

    const typicalHiringDates: string[] = [];
    const today = new Date(2025, 10, 20);
    for (let d = 0; d < 6; d++) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - d);
      const day = 1 + Math.floor(rand() * 28);
      date.setDate(day);
      typicalHiringDates.push(date.toISOString().split("T")[0]);
    }

    const interviewDump = `${name} focuses on ${["Aptitude", "Coding", "Behavioral", "Technical Round", "System Design"][Math.floor(rand() * 5)]}; typically 2 rounds.`;

    list.push({
      id: `cmp-${i + 1}`,
      name,
      industry,
      headquarters: hqCity,
      website,
      rating,
      fresherFriendly,
      interviewDump,
      peakHiringMonths,
      avgVacanciesPerMonth,
      typicalHiringDates,
    });
  }

  return list;
}

/* ---------- Small UI primitives ---------- */

function StatCard({ title, value, sub }: { title: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 flex-1 min-w-40">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
      {sub && <div className="text-sm text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

function Stars({ value }: { value?: number }) {
  const v = Math.round((value ?? 0) * 2) / 2;
  const full = Math.floor(v);
  const half = v - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-yellow-500" />
      ))}
      {half && <Star className="w-4 h-4 text-yellow-300" />}
    </div>
  );
}

/* small sparkline-like bars: convert typicalHiringDates to counts per month index */
function MiniSpark({ dates }: { dates: string[] }) {
  // map dates to counts
  const counts = dates.map(() => 1); // each date counts 1; for richer logic you'd bucket by month
  const max = Math.max(...counts, 1);
  return (
    <div className="flex items-end gap-1 h-6">
      {counts.map((c, i) => (
        <div
          key={i}
          title={dates[i]}
          style={{ height: `${(c / max) * 100}%` }}
          className="w-2 bg-blue-600 rounded-sm"
        />
      ))}
    </div>
  );
}

/* ---------- Main component ---------- */

export default function CompaniesPage(): JSX.Element {
  const data = useMemo(() => generateMockCompanies(120), []);
  const [query, setQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<{ key: keyof Company | "avgVacanciesPerMonth"; dir: "asc" | "desc" }>({ key: "name", dir: "asc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [selected, setSelected] = useState<Company | null>(null);

  const industries = useMemo(() => ["All", ...Array.from(new Set(data.map((d) => d.industry)))], [data]);

  const filtered = useMemo(() => {
    let rows = data.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter((r) =>
        `${r.name} ${r.industry} ${r.interviewDump}`
          .toLowerCase()
          .includes(q)
      );
    }
    if (industryFilter !== "All") rows = rows.filter((r) => r.industry === industryFilter);

    const key = sortBy.key;
    rows.sort((a, b) => {
      let va: any = (a as any)[key];
      let vb: any = (b as any)[key];
      if (key === "avgVacanciesPerMonth") {
        va = a.avgVacanciesPerMonth;
        vb = b.avgVacanciesPerMonth;
      }
      if (va == null) va = "";
      if (vb == null) vb = "";
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortBy.dir === "asc" ? -1 : 1;
      if (va > vb) return sortBy.dir === "asc" ? 1 : -1;
      return 0;
    });

    return rows;
  }, [data, query, industryFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Top KPIs
  const totalCompanies = data.length;
  const avgVacancies = Math.round(data.reduce((s, r) => s + r.avgVacanciesPerMonth, 0) / totalCompanies);
  const fresherPct = Math.round((data.filter((d) => d.fresherFriendly).length / totalCompanies) * 100);

  function toggleSort(key: typeof sortBy.key) {
    setSortBy((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));
  }

  function downloadCSV(rows = filtered) {
    const headers = [
      "id",
      "name",
      "industry",
      "headquarters",
      "website",
      "rating",
      "fresherFriendly",
      "interviewDump",
      "peakHiringMonths",
      "avgVacanciesPerMonth",
      "typicalHiringDates",
    ];
    const lines = [headers.join(",")];
    for (const r of rows) {
      const cols = [
        r.id,
        `"${r.name.replace(/"/g, '""')}"`,
        r.industry,
        r.headquarters,
        r.website ?? "",
        String(r.rating ?? ""),
        String(r.fresherFriendly),
        `"${r.interviewDump.replace(/"/g, '""')}"`,
        `"${r.peakHiringMonths.join("|")}"`,
        String(r.avgVacanciesPerMonth),
        `"${r.typicalHiringDates.join("|")}"`,
      ];
      lines.push(cols.join(","));
    }
    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `companies_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header + KPIs */}
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Companies — Hiring Insights</h1>
          <p className="text-sm text-gray-600 mt-1">Browse 100+ companies with hiring patterns, interview notes and vacancy trends.</p>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <StatCard title="Total companies" value={totalCompanies} />
          <StatCard title="Avg vacancies / month" value={avgVacancies} sub="Across all companies" />
          <StatCard title="Fresher-friendly" value={`${fresherPct}%`} sub="Companies hiring freshers" />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex gap-3 items-center">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search companies, industry, or notes"
                className="border rounded-md px-3 py-2 text-sm w-72 md:w-96"
              />
            </div>

            <select value={industryFilter} onChange={(e) => { setIndustryFilter(e.target.value); setPage(1); }} className="border rounded-md px-3 py-2 text-sm">
              {industries.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
            </select>

            <button onClick={() => downloadCSV()} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => { setPage(1); setPageSize(12); }} className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50 flex items-center gap-2">
              <Eye className="w-4 h-4" /> View All
            </button>

            <div className="text-sm text-gray-600">Rows:</div>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded-md px-2 py-1 text-sm">
              {[12, 24, 48].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md border overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-0 text-xs bg-gray-50 border-b p-3 font-semibold text-gray-700">
          <div className="col-span-1">#</div>
          <div className="col-span-3 cursor-pointer" onClick={() => toggleSort("name")}>Company {sortBy.key === "name" ? (sortBy.dir === "asc" ? "▲" : "▼") : null}</div>
          <div className="col-span-2 cursor-pointer" onClick={() => toggleSort("industry")}>Industry {sortBy.key === "industry" ? (sortBy.dir === "asc" ? "▲" : "▼") : null}</div>
          <div className="col-span-1">HQ</div>
          <div className="col-span-1 cursor-pointer" onClick={() => toggleSort("avgVacanciesPerMonth")}>Avg/mo {sortBy.key === "avgVacanciesPerMonth" ? (sortBy.dir === "asc" ? "▲" : "▼") : null}</div>
          <div className="col-span-2">Peak months</div>
          <div className="col-span-1">Recent hires</div>
          <div className="col-span-1 text-right pr-3">Actions</div>
        </div>

        <div>
          {pageData.map((c, idx) => (
            <div key={c.id} className={`grid grid-cols-12 gap-0 items-center p-4 border-b ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
              <div className="col-span-1 text-sm">{(page - 1) * pageSize + idx + 1}</div>

              <div className="col-span-3 flex items-center gap-3">
                {/* logo placeholder */}
                <div className="w-10 h-10 bg-linear-to-br from-blue-100 to-blue-50 rounded flex items-center justify-center text-blue-600 font-semibold">
                  {c.name.split(/\s/).map(s => s[0]).slice(0,2).join("")}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{c.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <Stars value={c.rating} />
                    <span className="ml-1">·</span>
                    <span>{c.fresherFriendly ? <span className="text-emerald-600 font-medium">Fresher</span> : <span className="text-gray-500">Experienced</span>}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-2 text-sm">{c.industry}</div>
              <div className="col-span-1 text-sm">{c.headquarters}</div>

              <div className="col-span-1 text-sm">{c.avgVacanciesPerMonth}</div>

              <div className="col-span-2 text-sm flex flex-wrap gap-1">
                {MONTHS.map((m) => {
                  const active = c.peakHiringMonths.includes(m);
                  return (
                    <span key={m} className={`px-2 py-1 rounded-full text-xs ${active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>{m}</span>
                  );
                }).slice(0,6)}
              </div>

              <div className="col-span-1">
                <MiniSpark dates={c.typicalHiringDates} />
              </div>

              <div className="col-span-1 text-right">
                <div className="flex items-center justify-end gap-2">
                  <a href={c.website} target="_blank" rel="noreferrer" title="Website" className="p-2 border rounded-md text-sm"><Globe className="w-4 h-4" /></a>
                  <button onClick={() => setSelected(c)} title="Details" className="p-2 border rounded-md text-sm"><Eye className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}

          {pageData.length === 0 && (
            <div className="p-6 text-center text-gray-500">No companies found — try adjusting filters.</div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} of {filtered.length} companies</div>

        <div className="flex items-center gap-2">
          <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1 border rounded disabled:opacity-50">First</button>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
          <div className="px-3 text-sm">{page} / {totalPages}</div>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">Last</button>
        </div>
      </div>

      {/* Details drawer/modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-4">
          <div onClick={() => setSelected(null)} className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-t-xl lg:rounded-lg p-6 max-w-3xl w-full z-10 shadow-xl">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selected.name}</h3>
                <div className="text-sm text-gray-600">{selected.industry} • {selected.headquarters}</div>
                <div className="mt-2 text-xs text-gray-500">{selected.interviewDump}</div>
              </div>

              <div className="flex gap-2 items-start">
                <a href={selected.website} target="_blank" rel="noreferrer" className="px-3 py-2 border rounded-md text-sm flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Website
                </a>
                <button onClick={() => setSelected(null)} className="px-3 py-2 text-sm text-gray-600">Close</button>
              </div>
            </header>

            <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Hiring Pattern</h4>
                <div className="mt-2 flex gap-2 items-center">
                  <div className="text-3xl font-semibold text-gray-900">{selected.avgVacanciesPerMonth}</div>
                  <div className="text-sm text-gray-500">avg vacancies / month</div>
                </div>

                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700">Peak hiring months</h5>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.peakHiringMonths.map(m => <span key={m} className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs">{m}</span>)}
                  </div>
                </div>

                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700">Recent hiring dates</h5>
                  <div className="mt-2 text-sm text-gray-600">{selected.typicalHiringDates.join(", ")}</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">Interview notes</h4>
                <p className="mt-2 text-sm text-gray-700">{selected.interviewDump}</p>

                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700">More</h5>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li><strong>Rating:</strong> {selected.rating ?? "—"} / 5</li>
                    <li><strong>Fresher friendly:</strong> {selected.fresherFriendly ? "Yes" : "No"}</li>
                    <li><strong>Website:</strong> <a className="text-blue-600" href={selected.website} target="_blank" rel="noreferrer">{selected.website}</a></li>
                  </ul>
                </div>
              </div>
            </section>

            <footer className="mt-6 text-right">
              <button onClick={() => downloadCSV([selected])} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">Export this company</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
