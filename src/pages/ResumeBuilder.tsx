import { useState, type JSX } from "react";

type Experience = { title: string; org: string; from_to?: string; bullets: string[] };
type Project = { title: string; desc: string };
type Education = { degree: string; details: string };

export default function ResumeBuilder(): JSX.Element {
  const [name, setName] = useState("Hiralal Singh");
  const [title, setTitle] = useState("DevOps Engineer");
  const [contact, setContact] = useState("8984443551");
  const [email, setEmail] = useState("hiralals221@gmail.com");
  const [linkedin, setLinkedin] = useState("linkedin.com/in/hiralal-singh");
  const [github, setGithub] = useState("github.com/Root-acess");
  const [jdText, setJdText] = useState("");
  const [summary, setSummary] = useState("");
  const [skillsStr, setSkillsStr] = useState("");

  const [experiences] = useState<Experience[]>([
    {
      title: "DevOps Intern — Cloud Infrastructure",
      org: "Naresh i Technologies",
      from_to: "2024 – Present",
      bullets: [
        "Implemented CI/CD using Jenkins and GitHub Actions",
        "Automated infra with Terraform & Ansible",
      ],
    },
  ]);

  const [projects] = useState<Project[]>([
    {
      title: "Kubernetes Microservices CI/CD",
      desc: "Automated containerized microservice deployments with Jenkins and Kubernetes.",
    },
  ]);

  const [education] = useState<Education[]>([
    { degree: "Bachelor of Computer Applications (BCA)", details: "Baripada College | 2023–2025" },
  ]);

  const [strengths] = useState<string[]>([
    "Automation & Problem Solving",
    "Troubleshooting & Debugging",
  ]);

  const [loading, setLoading] = useState(false);

  async function generatePDF() {
    setLoading(true);
    try {
      const skills = skillsStr.split(",").map((s) => s.trim()).filter(Boolean);
      const payload = {
        name,
        title,
        contact,
        email,
        linkedin,
        github,
        jd_text: jdText,
        summary,
        skills,
        experiences,
        education,
        projects,
        strengths,
      };

      const res = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Failed to generate resume");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name.replace(/\s+/g, "_")}_ATS_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      alert("Error generating resume: " + (e.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ATS Resume Builder</h1>
        <button
          onClick={generatePDF}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {loading ? "Generating..." : "Generate PDF"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT: Form */}
        <div className="space-y-4">
          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Basic Info</h2>
            <div className="grid gap-2">
              <input className="border rounded px-3 py-2" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full name" />
              <input className="border rounded px-3 py-2" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title (e.g. DevOps Engineer)" />
              <input className="border rounded px-3 py-2" value={contact} onChange={(e)=>setContact(e.target.value)} placeholder="Phone" />
              <input className="border rounded px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
              <input className="border rounded px-3 py-2" value={linkedin} onChange={(e)=>setLinkedin(e.target.value)} placeholder="LinkedIn URL" />
              <input className="border rounded px-3 py-2" value={github} onChange={(e)=>setGithub(e.target.value)} placeholder="GitHub URL" />
            </div>
          </section>

          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Job Description</h2>
            <textarea
              className="border rounded p-2 w-full h-24"
              value={jdText}
              onChange={(e)=>setJdText(e.target.value)}
              placeholder="Paste Job Description here to align skills & summary"
            />
          </section>

          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Summary (optional)</h2>
            <textarea
              className="border rounded p-2 w-full h-20"
              value={summary}
              onChange={(e)=>setSummary(e.target.value)}
              placeholder="If empty, summary will be auto-generated using JD skills."
            />
          </section>

          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Skills (comma separated)</h2>
            <input
              className="border rounded px-3 py-2 w-full"
              value={skillsStr}
              onChange={(e)=>setSkillsStr(e.target.value)}
              placeholder="AWS, Terraform, Kubernetes, Jenkins"
            />
            <p className="text-xs text-gray-500 mt-1">
              If blank, skills are auto-extracted from the Job Description.
            </p>
          </section>
        </div>

        {/* RIGHT: Preview */}
        <div className="space-y-4">
          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Live Preview</h2>
            <div className="text-sm text-gray-800">
              <div className="text-xl font-bold">{name}</div>
              <div className="text-sm text-blue-600">{title}</div>
              <div className="text-xs text-gray-500 mt-1">
                {contact} · {email} · {github} · {linkedin}
              </div>

              <div className="mt-3">
                <h3 className="text-sm font-semibold">Summary</h3>
                <p className="text-sm text-gray-700">
                  {summary || "Auto-generated summary will be based on JD and skills when you generate PDF."}
                </p>
              </div>

              <div className="mt-3">
                <h3 className="text-sm font-semibold">Experience</h3>
                {experiences.map((ex, i) => (
                  <div key={i} className="mt-2">
                    <div className="text-sm font-medium">{ex.title}</div>
                    <div className="text-xs text-gray-500">
                      {ex.org} {ex.from_to && `• ${ex.from_to}`}
                    </div>
                    <ul className="list-disc ml-5 text-sm text-gray-700">
                      {ex.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Quick Actions</h2>
            <div className="flex gap-3">
              <button
                onClick={generatePDF}
                disabled={loading}
                className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
              >
                {loading ? "Generating..." : "Generate PDF"}
              </button>
              <button
                onClick={() => {
                  setSummary("");
                  setSkillsStr("");
                  setJdText("");
                }}
                className="px-3 py-2 border rounded text-sm"
              >
                Clear text sections
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
