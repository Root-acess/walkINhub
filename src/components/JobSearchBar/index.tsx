import React, { useState, useMemo } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface JobSearchBarProps {
  keyword: string;
  setKeyword: (value: string) => void;

  city: string;
  setCity: (value: string) => void;

  exp: string;
  setExp: (value: string) => void;

  cities: string[];
}

// PREDEFINED JOB ROLE SUGGESTIONS
const ROLE_SUGGESTIONS = [
  // --- Software Development ---
  "Software Developer",
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "React Developer",
  "Angular Developer",
  "Vue.js Developer",
  "Next.js Developer",
  "Node.js Developer",
  "Java Developer",
  "Python Developer",
  "Django Developer",
  "Flask Developer",
  "Spring Boot Developer",
  "C++ Developer",
  "C# Developer",
  "PHP Developer",
  "Laravel Developer",
  "Ruby on Rails Developer",
  "Golang Developer",
  "Flutter Developer",
  "Android Developer",
  "iOS Developer",
  "Mobile App Developer",

  // --- DevOps & Cloud ---
  "DevOps Engineer",
  "Senior DevOps Engineer",
  "Junior DevOps Engineer",
  "Cloud DevOps Engineer",
  "Platform Engineer",
  "Build & Release Engineer",
  "CI/CD Engineer",
  "Automation Engineer",
  "Infrastructure Engineer",
  "Infrastructure as Code Engineer",
  "Kubernetes Administrator",
  "Kubernetes Engineer",
  "Docker Engineer",
  "Jenkins Engineer",
  "Terraform Engineer",

  // --- Cloud Engineering ---
  "Cloud Engineer",
  "Cloud Architect",
  "AWS Engineer",
  "AWS Cloud Admin",
  "Azure Engineer",
  "Azure Cloud Admin",
  "GCP Engineer",
  "Cloud Security Engineer",
  "Cloud Support Engineer",
  "Cloud Operations Engineer",

  // --- SRE / Reliability ---
  "Site Reliability Engineer (SRE)",
  "Senior SRE",
  "Associate SRE",
  "Production Engineer",
  "Systems Reliability Engineer",

  // --- SysAdmin / Infra ---
  "Linux System Administrator",
  "Windows System Administrator",
  "System Administrator",
  "Network Engineer",
  "Network Administrator",
  "Virtualization Engineer",
  "VMWare Engineer",

  // --- Monitoring / Observability ---
  "Monitoring Engineer",
  "Observability Engineer",
  "Grafana Engineer",
  "Prometheus Engineer",
  "ELK Stack Engineer",
  "Splunk Engineer",

  // --- Data / AI ---
  "Data Analyst",
  "Data Engineer",
  "Data Scientist",
  "ML Engineer",
  "AI Engineer",
  "NLP Engineer",
  "Business Intelligence Analyst",
  "Power BI Developer",
  "Tableau Developer",

  // --- Testing / QA ---
  "QA Engineer",
  "Automation Tester",
  "Manual Tester",
  "Performance Tester",
  "Penetration Tester",
  "Security Tester",
  "SDET",

  // --- Cybersecurity ---
  "Cybersecurity Analyst",
  "SOC Analyst",
  "Information Security Analyst",
  "Network Security Engineer",

  // --- Business / Management ---
  "Business Analyst",
  "Product Manager",
  "Project Manager",
  "Scrum Master",
  "Program Manager",
  "Operations Executive",
  "Business Development Executive",

  // --- HR / Admin ---
  "HR Recruiter",
  "HR Associate",
  "Talent Acquisition Executive",
  "HR Coordinator",
  "Payroll Executive",
  "Admin Executive",

  // --- Customer Support / BPO ---
  "Customer Support Executive",
  "Customer Care Associate",
  "Customer Success Executive",
  "Voice Process Executive",
  "Non-Voice Process Executive",
  "Telecaller",
  "BPO Associate",
  "KYC Analyst",

  // --- Creative / Design ---
  "UI/UX Designer",
  "Graphic Designer",
  "Product Designer",
  "Motion Graphics Designer",
  "Video Editor",
  "3D Artist",
  "Animator",

  // --- Marketing / Sales ---
  "Sales Executive",
  "Sales Manager",
  "Digital Marketing Executive",
  "SEO Specialist",
  "Social Media Manager",
  "Google Ads Specialist",
  "Content Writer",
  "Copywriter",

  // --- Finance / Accounts ---
  "Accountant",
  "Accounts Executive",
  "Finance Analyst",
  "Audit Executive",
  "Tax Consultant",
  "Bookkeeper",

  // --- Operations & Back Office ---
  "Back Office Executive",
  "Data Entry Operator",
  "Document Verification Executive",
  "Operations Coordinator",
  "Supply Chain Executive",
];


export default function JobSearchBar({
  keyword,
  setKeyword,
  city,
  setCity,
  exp,
  setExp,
  cities,
}: JobSearchBarProps) {
  const [focus, setFocus] = useState(false);

  const filteredSuggestions = useMemo(() => {
    if (!keyword.trim()) return [];
    const q = keyword.toLowerCase();
    return ROLE_SUGGESTIONS.filter((role) =>
      role.toLowerCase().includes(q)
    ).slice(0, 6); // limit suggestions
  }, [keyword]);

  return (
    <div className="relative w-full bg-white shadow-lg rounded-xl p-5 md:p-6 border">
      {/* TITLE */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Filter className="w-5 h-5 text-blue-600" />
        Search Jobs
      </h2>

      {/* INPUT ROW */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* KEYWORD SEARCH */}
        <div className="relative flex items-center bg-gray-50 border rounded-lg px-3 py-2 gap-2 flex-1">
          <Search className="w-5 h-5 text-gray-500" />

          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setTimeout(() => setFocus(false), 150)}
            placeholder="Search job roles, companies, or skills…"
            className="w-full bg-transparent text-gray-700 text-sm focus:outline-none"
          />

          {/* AUTOCOMPLETE DROPDOWN */}
          <AnimatePresence>
            {focus && filteredSuggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-lg border z-10"
              >
                {filteredSuggestions.map((item) => (
                  <li
                    key={item}
                    onMouseDown={() => setKeyword(item)}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* CITY FILTER */}
        <div className="flex items-center bg-gray-50 border rounded-lg px-3 py-2 gap-2 md:w-56">
          <MapPin className="w-5 h-5 text-gray-500" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent text-gray-700 text-sm focus:outline-none"
          >
            <option value="All">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* SEARCH BUTTON */}
        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2 text-sm md:text-base">
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>

      {/* EXPERIENCE FILTERS */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
        <span className="font-medium">Experience:</span>

        {["All", "Fresher", "0–2 years", "1–3 years"].map((option) => (
          <button
            key={option}
            onClick={() => setExp(option)}
            className={`px-3 py-1 rounded-full border text-xs ${
              exp === option
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
