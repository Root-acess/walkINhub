import { useMemo, useState } from "react";

type Level = "junior" | "mid" | "senior";

const BASE_BEHAVIORAL_QUESTIONS: string[] = [
  "Tell me about yourself and why you're interested in this role.",
  "Describe a time you faced a major production issue. What did you do?",
  "Tell me about a time you disagreed with a teammate or manager. How did you handle it?",
  "Give an example of when you improved a process or automated something.",
  "Describe a time you had to learn a new tool or technology quickly.",
  "Tell me about a failure or mistake you made. What did you learn?",
  "How do you prioritize tasks when everything feels urgent?",
];

const LEVEL_FOCUS: Record<Level, string[]> = {
  junior: [
    "Fundamentals of OS, networking, and basic scripting",
    "CI/CD basics and version control (Git)",
    "Containers 101 (Docker fundamentals)",
    "Cloud basics (IAM, compute, storage, networking concepts)",
  ],
  mid: [
    "Designing CI/CD pipelines end-to-end",
    "Infrastructure as Code (Terraform / CloudFormation basics)",
    "Monitoring, alerting, and incident response",
    "Cost optimization / reliability trade-offs",
  ],
  senior: [
    "System design and architecture decisions",
    "Scaling, reliability (SLOs, SLIs, error budgets)",
    "Security, compliance, and governance",
    "Mentoring, technical leadership, and stakeholder communication",
  ],
};

const TECH_QUESTION_BANK: Record<string, string[]> = {
  docker: [
    "Explain the difference between a container and a virtual machine.",
    "How do you reduce Docker image size in a production environment?",
    "What are best practices for writing Dockerfiles for microservices?",
  ],
  kubernetes: [
    "Explain the difference between Deployment, StatefulSet, and DaemonSet.",
    "How would you debug a Pod stuck in CrashLoopBackOff?",
    "What are liveness and readiness probes and why are they important?",
  ],
  aws: [
    "Explain the difference between EC2, ECS, and EKS.",
    "How would you design a highly available web app in AWS?",
    "What is an IAM role and how is it different from a user?",
  ],
  azure: [
    "What are Azure Resource Groups and why are they useful?",
    "Explain the difference between Azure App Service and Azure Functions.",
  ],
  gcp: [
    "What is the difference between GKE, Cloud Run, and App Engine?",
  ],
  terraform: [
    "What is the difference between a module and a resource in Terraform?",
    "How do you manage Terraform state and remote backends?",
    "How do you structure Terraform code for multiple environments?",
  ],
  jenkins: [
    "How does a Jenkins pipeline work end-to-end?",
    "How do you secure Jenkins and sensitive credentials?",
  ],
  "github actions": [
    "Explain how GitHub Actions workflows, jobs, and steps work.",
    "How do you handle secrets in GitHub Actions?",
  ],
  monitoring: [
    "How do you decide what to monitor in a production system?",
    "Explain the difference between logs, metrics, and traces.",
  ],
  sre: [
    "What are SLIs, SLOs, and error budgets?",
    "How do you design incident management and on-call processes?",
  ],
};

const DEFAULT_TECH_TOPICS = [
  "CI/CD pipelines",
  "Containers & orchestration",
  "Cloud fundamentals (IAM, VPC/networking, compute, storage)",
  "Monitoring, logging, and alerting",
  "Security basics (least privilege, secrets management)",
];

const STOPWORDS = new Set([
  "the",
  "and",
  "or",
  "a",
  "an",
  "to",
  "for",
  "with",
  "in",
  "on",
  "of",
  "by",
  "is",
  "are",
  "be",
  "as",
  "that",
  "this",
  "will",
  "can",
  "should",
  "from",
  "we",
  "you",
  "your",
  "their",
  "at",
  "it",
  "role",
  "position",
  "engineer",
  "developer",
]);

// ---------------- Helpers ----------------

function normalizeText(s: string): string {
  return s
    .replace(/[^\w\s.\-/+]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function extractTopicsFromJD(jd: string): string[] {
  const norm = normalizeText(jd);
  if (!norm) return [];

  const tokens = norm.split(" ");
  const freq = new Map<string, number>();

  for (let i = 0; i < tokens.length; i++) {
    const t1 = tokens[i];
    if (!STOPWORDS.has(t1) && t1.length > 3) {
      freq.set(t1, (freq.get(t1) || 0) + 1);
    }

    if (i + 1 < tokens.length) {
      const t2 = tokens[i + 1];
      const bigram = `${t1} ${t2}`;
      if (![t1, t2].some((w) => STOPWORDS.has(w))) {
        freq.set(bigram, (freq.get(bigram) || 0) + 1);
      }
    }
  }

  const candidates = Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([k]) => k);

  // Deduplicate and keep readable length
  const unique: string[] = [];
  for (const c of candidates) {
    if (!unique.includes(c) && c.length <= 40) {
      unique.push(c);
    }
  }
  return unique;
}

function generateTechQuestions(techStack: string, topics: string[]): string[] {
  const stackTokens = techStack
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const picked: string[] = [];

  // Map stack tokens to bank keys
  const allKeys = Object.keys(TECH_QUESTION_BANK);
  for (const token of stackTokens) {
    for (const key of allKeys) {
      if (token.includes(key) || key.includes(token)) {
        picked.push(...TECH_QUESTION_BANK[key]);
      }
    }
  }

  // If nothing matched, still give some generic technical questions
  if (!picked.length) {
    picked.push(
      "Walk me through how you would design a CI/CD pipeline for this role.",
      "How do you ensure reliability and observability in a distributed system?",
      "How do you approach debugging flaky production issues?"
    );
  }

  // Add one question tying to JD topics
  if (topics.length) {
    picked.push(
      `Looking at this job description, which mentions "${topics[0]}", how have you worked with this in the past?`
    );
  }

  // Deduplicate
  return Array.from(new Set(picked));
}

function generatePrepPlan(level: Level, topics: string[]): string[] {
  const focus = LEVEL_FOCUS[level];
  const topicList = topics.slice(0, 4).join(", ") || "key topics from the JD";

  return [
    `Day 1 – Read JD deeply, highlight responsibilities, identify ${topicList}.`,
    `Day 2 – Revise fundamentals: ${focus[0] || "core concepts for this role"}.`,
    `Day 3 – Hands-on practice: implement or rehearse a small project related to ${focus[1] || "CI/CD & automation"}.`,
    `Day 4 – System design / architecture questions for this role level (${level}).`,
    "Day 5 – Behavioral questions: write STAR stories for 5–7 real situations.",
    "Day 6 – Mock interview: 45–60 mins with a friend or record yourself and review.",
    "Day 7 – Quick revision, prepare questions to ask the interviewer, sleep well.",
  ];
}

export default function InterviewPrep() {
  const [jobTitle, setJobTitle] = useState("DevOps Engineer");
  const [level, setLevel] = useState<Level>("mid");
  const [company, setCompany] = useState("");
  const [techStack, setTechStack] = useState("AWS, Docker, Kubernetes, Terraform, Jenkins");
  const [jdText, setJdText] = useState("");
  const [notes, setNotes] = useState("");

  const topicsFromJD = useMemo(() => extractTopicsFromJD(jdText), [jdText]);
  const techQuestions = useMemo(
    () => generateTechQuestions(techStack, topicsFromJD),
    [techStack, topicsFromJD]
  );
  const behavioralQuestions = useMemo(
    () => BASE_BEHAVIORAL_QUESTIONS,
    []
  );
  const plan = useMemo(
    () => generatePrepPlan(level, topicsFromJD),
    [level, topicsFromJD]
  );

  const combinedQuestions = useMemo(
    () => [...techQuestions, "", "--- Behavioral ---", ...behavioralQuestions],
    [techQuestions, behavioralQuestions]
  );

  function copyAllQuestions() {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(combinedQuestions.join("\n"));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Interview Prep Planner</h1>
          <p className="text-sm text-gray-600">
            Turn a job description + tech stack into focused topics, questions,
            and a one-week prep plan.
          </p>
        </div>

        <button
          onClick={copyAllQuestions}
          className="self-start md:self-auto px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
        >
          Copy All Questions
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT: Inputs */}
        <div className="space-y-4">
          {/* Role Info */}
          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-3 text-sm uppercase tracking-wide text-gray-700">
              Role Details
            </h2>
            <div className="space-y-2">
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job Title (e.g. DevOps Engineer)"
              />
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company (optional)"
              />
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="text-gray-600">Experience Level:</span>
                {(["junior", "mid", "senior"] as Level[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLevel(lvl)}
                    className={`px-3 py-1 rounded-full border text-xs capitalize ${
                      level === lvl
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Tech stack */}
          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2 text-sm uppercase tracking-wide text-gray-700">
              Tech Stack
            </h2>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="AWS, Docker, Kubernetes, Terraform, Jenkins"
            />
            <p className="text-xs text-gray-500 mt-1">
              Comma-separated. Used to generate role-specific technical questions.
            </p>
          </section>

          {/* JD */}
          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2 text-sm uppercase tracking-wide text-gray-700">
              Job Description (optional but recommended)
            </h2>
            <textarea
              className="w-full border rounded p-3 text-sm h-40 font-mono"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the JD here. We'll mine it for focus topics & specific questions."
            />
            <p className="text-xs text-gray-500 mt-1">
              We&apos;ll highlight frequent phrases and skills to focus your prep.
            </p>
          </section>

          {/* Personal notes */}
          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2 text-sm uppercase tracking-wide text-gray-700">
              Your Notes
            </h2>
            <textarea
              className="w-full border rounded p-3 text-sm h-24"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything the recruiter mentioned, salary range, interview rounds, etc."
            />
          </section>
        </div>

        {/* RIGHT: Output */}
        <div className="space-y-4">
          {/* Focus Areas */}
          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold text-sm mb-2 uppercase tracking-wide text-gray-700">
              Focus Areas
            </h2>
            <p className="text-xs text-gray-500 mb-2">
              Based on experience level and JD text.
            </p>
            <div className="space-y-2 text-sm">
              {LEVEL_FOCUS[level].map((item, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <p>{item}</p>
                </div>
              ))}
              <div className="mt-2">
                <p className="text-xs font-semibold text-gray-600 mb-1">
                  JD-extracted topics:
                </p>
                {topicsFromJD.length ? (
                  <div className="flex flex-wrap gap-2">
                    {topicsFromJD.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    Paste a job description to see auto-extracted topics, or
                    rely on generic devops/cloud focus areas.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Technical Questions */}
          <section className="bg-white p-4 rounded-lg shadow max-h-72 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-700">
                Technical Questions
              </h2>
              <span className="text-xs text-gray-400">
                {techQuestions.length} questions
              </span>
            </div>
            <ol className="list-decimal ml-4 space-y-1 text-xs text-gray-800">
              {techQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ol>
          </section>

          {/* Behavioral Questions */}
          <section className="bg-white p-4 rounded-lg shadow max-h-60 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-700">
                Behavioral Questions
              </h2>
              <span className="text-xs text-gray-400">
                {behavioralQuestions.length} questions
              </span>
            </div>
            <ol className="list-decimal ml-4 space-y-1 text-xs text-gray-800">
              {behavioralQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ol>
          </section>

          {/* 7-Day Plan */}
          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold text-sm mb-2 uppercase tracking-wide text-gray-700">
              7-Day Prep Plan
            </h2>
            <ol className="list-decimal ml-4 space-y-1 text-xs text-gray-800">
              {plan.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      <p className="mt-6 text-[11px] text-gray-500 text-center">
        Tip: After each mock interview, update your notes and refine your answers.
        Patterns in questions = patterns you should prepare deeper for.
      </p>
    </div>
  );
}
