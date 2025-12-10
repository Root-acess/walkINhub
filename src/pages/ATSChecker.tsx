import { useState, useMemo, type JSX } from "react";

/**
 * ATSChecker.tsx
 *
 * - Uses backend endpoints:
 *    POST /api/extract-text   (multipart/form-data) -> { text: "..." }
 *    POST /api/ats-score      (application/json)    -> { score, matched, missing, suggestions, breakdown }
 *
 * - If backend endpoints fail, component falls back to local client-side analysis
 *   (so it remains usable during development).
 *
 * Keep your styling & layout exactly as requested.
 */

// -----------------------------------------------------------------------------
// Config / Constants
// -----------------------------------------------------------------------------
const TECH_KEYWORDS = [
  "aws", "azure", "gcp", "terraform", "ansible", "kubernetes", "k8s", "docker",
  "jenkins", "github actions", "gitlab ci", "git", "linux", "ubuntu", "python",
  "node.js", "nodejs", "bash", "ci/cd", "prometheus", "grafana", "argocd",
  "monitoring", "automation", "powershell", "iis", "cdn", "sql server",
  "postgres", "mysql", "database", "security", "devops", "iac", "cloudformation",
  "sre", "nginx", "react", "java", "spring", "typescript", "react native",
  "graphql", "rest api",
];

const STOPWORDS = new Set([
  "the","and","or","a","an","to","for","with","in","on","of","by",
  "is","are","be","as","that","this","will","can","should","from",
  "we","you","your","their","at","it",
]);

// -----------------------------------------------------------------------------
// Helpers (same as your earlier logic)
// -----------------------------------------------------------------------------
function normalizeText(s: string): string {
  return s
    .replace(/[^\w\s.\-/+]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function extractCandidateKeywords(jd: string): string[] {
  const norm = normalizeText(jd);
  if (!norm) return [];

  const foundTech = new Set<string>();
  for (const t of TECH_KEYWORDS) {
    const tn = t.toLowerCase();
    if (norm.includes(tn)) foundTech.add(tn);
  }

  const tokens = norm.split(" ");
  const freq = new Map<string, number>();

  for (let i = 0; i < tokens.length; i++) {
    const t1 = tokens[i];
    if (!STOPWORDS.has(t1) && t1.length > 2) {
      freq.set(t1, (freq.get(t1) || 0) + 1);
    }

    if (i + 1 < tokens.length) {
      const t2 = tokens[i + 1];
      const bigram = `${t1} ${t2}`;
      if (![t1, t2].some(w => STOPWORDS.has(w))) {
        freq.set(bigram, (freq.get(bigram) || 0) + 1);
      }
    }

    if (i + 2 < tokens.length) {
      const t2 = tokens[i + 1];
      const t3 = tokens[i + 2];
      const trigram = `${t1} ${t2} ${t3}`;
      if (![t1, t2, t3].some(w => STOPWORDS.has(w))) {
        freq.set(trigram, (freq.get(trigram) || 0) + 1);
      }
    }
  }

  const candidates = Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([k]) => k);

  return Array.from(new Set([...Array.from(foundTech), ...candidates]));
}

// Local fallback analyzer (runs if backend is unavailable)
function localAnalyze(jd: string, resumeText: string, minKeywordFrequency = 1) {
  const candidates = extractCandidateKeywords(jd);
  const resumeNorm = normalizeText(resumeText || "");
  const breakdown = [];
  const matched = [];

  for (const kw of candidates) {
    const kwNorm = normalizeText(kw);
    if (!kwNorm) {
      breakdown.push({ keyword: kw, found: false, occurrences: 0 });
      continue;
    }

    let found = false;
    let occ = 0;

    try {
      const phraseRegex = new RegExp("\\b" + kwNorm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "gi");
      const phraseMatches = resumeNorm.match(phraseRegex);
      if (phraseMatches && phraseMatches.length >= minKeywordFrequency) {
        found = true;
        occ = phraseMatches.length;
      } else {
        const tokens = kwNorm.split(" ").filter(Boolean);
        const tokenFound = tokens.every(t =>
          new RegExp("\\b" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i").test(resumeNorm)
        );
        if (tokenFound) {
          found = true;
          occ = tokens.reduce((acc, t) => {
            const r = new RegExp("\\b" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "gi");
            const m = resumeNorm.match(r);
            return acc + (m ? m.length : 0);
          }, 0);
        }
      }
    } catch (e) {
      // ignore regex errors and mark not found
    }

    if (found) matched.push(kw);
    breakdown.push({ keyword: kw, found, occurrences: occ });
  }

  const total = candidates.length;
  const matchedCount = matched.length;

  let weightedMatch = 0;
  let totalWeight = 0;
  for (const b of breakdown) {
    const baseWeight = TECH_KEYWORDS.includes(b.keyword.toLowerCase()) ? 1.2 : 1.0;
    if (b.found) weightedMatch += baseWeight;
    totalWeight += baseWeight;
  }
  const score = totalWeight === 0 ? 0 : Math.round((weightedMatch / totalWeight) * 100);
  const missing = breakdown.filter(b => !b.found).map(b => b.keyword);

  const suggestions = missing.slice(0, 15).map(skill =>
    `Add experience/skill: "${skill}" — e.g. "Worked on ${skill} for 6+ months; implemented X that improved Y by Z%."`
  );

  return { score, total, matched, matchedCount, missing, breakdown, suggestions };
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
export default function ATSChecker(): JSX.Element {
  const [jd, setJd] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [minKeywordFrequency, setMinKeywordFrequency] = useState<number>(1);

  const [analysis, setAnalysis] = useState<any>(() => ({
    score: 0,
    total: 0,
    matched: [],
    matchedCount: 0,
    missing: [],
    breakdown: [],
  }));

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [runningAnalysis, setRunningAnalysis] = useState(false);

  const jdCandidates = useMemo(() => extractCandidateKeywords(jd), [jd]);

  // ---------- File upload -> backend extract-text ----------
  async function uploadFileToServer(file: File | null) {
    if (!file) return;
    setFileError(null);

    if (file.size > 15 * 1024 * 1024) {
      setFileError("File too large (>15MB). Please paste text instead.");
      return;
    }

    setFileLoading(true);
    try {
      // Try backend extraction first
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/extract-text", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        // If server returned 404 or a server error, throw to go to fallback
        const textErr = await res.text().catch(() => null);
        throw new Error(textErr || `Server extraction failed (${res.status})`);
      }

      const json = await res.json();
      if (!json || typeof json.text !== "string") {
        throw new Error("Invalid response from server when extracting text.");
      }

      setResumeText(prev => (prev ? prev + "\n\n" + json.text : json.text));
    } catch (err: any) {
      // fallback: tell user to paste or client-side attempt (we do not attempt client-side PDF parsing here)
      setFileError(err?.message || "PDF extraction failed. Please paste resume text instead.");
    } finally {
      setFileLoading(false);
    }
  }

  // ---------- Analyze (ask backend, fallback to localAnalyze) ----------
  async function runAnalysis() {
    setRunningAnalysis(true);
    setFileError(null);

    // Minimal validation
    if (!jd.trim()) {
      setFileError("Please paste the Job Description first.");
      setRunningAnalysis(false);
      return;
    }
    if (!resumeText.trim()) {
      setFileError("Please paste your resume text or upload a resume first.");
      setRunningAnalysis(false);
      return;
    }

    // Try backend /api/ats-score
    try {
      const res = await fetch("/api/ats-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd, resume: resumeText }),
      });

      if (!res.ok) {
        // fallback to local
        throw new Error("Backend ATS service not available, falling back to local analysis.");
      }

      const json = await res.json();
      // Expecting shape: { score, matched, missing, suggestions, breakdown, total, matchedCount }
      setAnalysis({
        score: json.score ?? 0,
        total: json.total ?? (json.matched?.length ?? 0) + (json.missing?.length ?? 0),
        matched: json.matched ?? [],
        matchedCount: json.matched?.length ?? json.matchedCount ?? 0,
        missing: json.missing ?? [],
        breakdown: json.breakdown ?? [],
      });

      setSuggestions(json.suggestions ?? (json.missing ?? []).slice(0, 15).map((m:any) => `Add ${m}`));
    } catch (err) {
      // Local fallback analysis
      const local = localAnalyze(jd, resumeText, minKeywordFrequency);
      setAnalysis({
        score: local.score,
        total: local.total,
        matched: local.matched,
        matchedCount: local.matchedCount,
        missing: local.missing,
        breakdown: local.breakdown,
      });
      setSuggestions(local.suggestions);
      // Optionally show a non-blocking note about fallback
      setFileError((prev) => {
        // preserve prior errors
        return prev ? prev : "Using local fallback analysis because backend /api/ats-score failed.";
      });
    } finally {
      setRunningAnalysis(false);
    }
  }

  function downloadReport() {
    const report = {
      generatedAt: new Date().toISOString(),
      score: analysis.score,
      totalKeywords: analysis.total,
      matchedCount: analysis.matchedCount,
      matched: analysis.matched,
      missing: analysis.missing,
      suggestions,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ats_report_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">ATS Checker — Job vs Resume</h1>
      <p className="text-sm text-gray-600 mb-8">
        Paste the job description and your resume (or upload a PDF). Get an instant ATS match score + suggestions.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT: Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block font-semibold mb-2">Job Description</label>
            <textarea
              value={jd}
              onChange={e => setJd(e.target.value)}
              rows={10}
              className="w-full border rounded-lg p-4 text-sm font-mono"
              placeholder="Paste the full job description here..."
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Resume Text <span className="text-xs text-gray-500 font-normal">(or upload below)</span>
            </label>
            <textarea
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              rows={8}
              className="w-full border rounded-lg p-4 text-sm font-mono"
              placeholder="Paste your resume text here..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                id="resumeFile"
                type="file"
                accept=".pdf,.txt"
                className="hidden"
                onChange={(e) => uploadFileToServer(e.target.files?.[0] ?? null)}
              />
              <label
                htmlFor="resumeFile"
                className="px-5 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition"
              >
                Upload Resume (PDF / TXT)
              </label>

              {fileLoading && (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span>Extracting text...</span>
                </div>
              )}

              <button
                onClick={runAnalysis}
                disabled={runningAnalysis}
                className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                {runningAnalysis ? "Analyzing..." : "Analyze"}
              </button>
            </div>

            {fileError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {fileError}
              </div>
            )}

            <div className="flex items-center gap-3 text-sm">
              <label>Min occurrences to count keyword:</label>
              <input
                type="number"
                min={1}
                value={minKeywordFrequency}
                onChange={e => setMinKeywordFrequency(Math.max(1, Number(e.target.value) || 1))}
                className="w-16 border rounded px-2 py-1"
              />

              <button onClick={downloadReport} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-4">
                Download JSON Report
              </button>

              <button
                onClick={() => {
                  if (suggestions.length && navigator.clipboard) {
                    navigator.clipboard.writeText(suggestions.join("\n"));
                  }
                }}
                className="px-4 py-2 border rounded hover:bg-gray-50 ml-2"
              >
                Copy Suggestions
              </button>

              <button onClick={() => { setJd(""); setResumeText(""); setAnalysis({score:0,total:0,matched:[],matchedCount:0,missing:[],breakdown:[]}); setSuggestions([]); }} className="px-4 py-2 border rounded hover:bg-gray-50 ml-2">
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6 shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-gray-500">ATS Match Score</div>
                <div className="text-5xl font-bold text-blue-600">
                  {analysis.score ?? 0}<span className="text-3xl">%</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Keywords Matched</div>
                <div className="text-2xl font-semibold">
                  {analysis.matchedCount ?? 0} / {analysis.total ?? 0}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-sm mb-2">Top Keywords from JD</h3>
              <div className="flex flex-wrap gap-2">
                {jdCandidates.slice(0, 20).map((k, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      (analysis.matched || []).includes(k)
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-sm mb-2">Missing Keywords (Add These!)</h3>
              {analysis.missing && analysis.missing.length === 0 ? (
                <p className="text-green-600 font-medium">All key terms found!</p>
              ) : (
                <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
                  {(analysis.missing || []).slice(0, 15).map((m: any, i: number) => (
                    <div key={i} className="bg-red-50 text-red-700 px-2 py-1 rounded">
                      {m}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow">
            <h3 className="font-semibold mb-3">Actionable Suggestions</h3>
            {suggestions.length === 0 ? (
              <p className="text-sm text-gray-600">Your resume already covers the main keywords OR run analysis to get suggestions.</p>
            ) : (
              <ol className="text-xs space-y-2">
                {suggestions.map((s, i) => (
                  <li key={i} className="bg-blue-50 p-2 rounded">{s}</li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>

      <p className="mt-10 text-xs text-gray-500 text-center">
        Pro tip: Place missing keywords in your <strong>Summary</strong>, <strong>Skills</strong>, and <strong>Experience</strong> sections with metrics.
      </p>
    </div>
  );
}
