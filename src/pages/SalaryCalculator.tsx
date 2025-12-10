import { useMemo, useState } from "react";

type SkillInput = { name: string; level: number }; // level 1-5

const BASE_SALARY_MAP: Record<string, number> = {
  "devops engineer": 6.5, // LPA base for 0 YOE
  "backend developer": 5.8,
  "frontend developer": 5.5,
  "fullstack developer": 6.2,
  "sre engineer": 7.2,
  "cloud engineer": 6.8,
  "data engineer": 7.5,
  "machine learning engineer": 7.8,
  "cybersecurity engineer": 7.1,
};

const CITY_MULTIPLIER: Record<string, number> = {
  bangalore: 1.22,
  hyderabad: 1.18,
  pune: 1.15,
  mumbai: 1.25,
  chennai: 1.12,
  delhi: 1.2,
  remote: 1.1,
  tier2: 0.90,
  other: 1.0,
};

export default function SalaryCalculator() {
  const [role, setRole] = useState("DevOps Engineer");
  const [experience, setExperience] = useState(1);
  const [city, setCity] = useState("Bangalore");
  const [skills, setSkills] = useState<SkillInput[]>([
    { name: "AWS", level: 4 },
    { name: "Docker", level: 4 },
    { name: "Kubernetes", level: 3 },
    { name: "Terraform", level: 3 },
  ]);

  const avgSkillLevel = useMemo(
    () => skills.reduce((a, b) => a + b.level, 0) / skills.length,
    [skills]
  );

  const market = useMemo(() => {
    const base =
      BASE_SALARY_MAP[role.toLowerCase()] ||
      6.0;

    const expMultiplier = 1 + experience * 0.18; // 18% salary growth per YOE
    const skillMultiplier = 0.85 + avgSkillLevel * 0.07; // higher if strong skills
    const cityWeight = CITY_MULTIPLIER[city.toLowerCase()] || 1.0;

    const expected = base * expMultiplier * skillMultiplier * cityWeight;

    return {
      expected,
      low: expected * 0.85,
      high: expected * 1.20,
    };
  }, [experience, role, avgSkillLevel, city]);

  const addSkill = () =>
    setSkills([...skills, { name: "", level: 3 }]);

  const updateSkill = (i: number, field: "name" | "level", value: any) => {
    const updated = [...skills];
    // @ts-ignore
    updated[i][field] = value;
    setSkills(updated);
  };

  const removeSkill = (i: number) => {
    setSkills(skills.filter((_, idx) => idx !== i));
  };

  const negotiationTips = [
    "Show impact with numbers — reduction in cost, time, outages.",
    "Demonstrate ownership of CI/CD + reliability improvements.",
    "Prove you can solve problems without supervision.",
    "Align your ask with market average for role + city.",
    "Mention certifications + cloud cost optimizations.",
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">
        Salary Estimator & Negotiation Guide
      </h1>
      <p className="text-gray-600 text-sm">
        Estimate salary based on role, city, experience & skill level — designed for real hiring trends.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          <section className="bg-white p-5 rounded-lg shadow">
            <h2 className="font-semibold mb-3">Job Profile</h2>

            <input
              className="border rounded px-3 py-2 w-full mb-3"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Role (ex: DevOps Engineer)"
            />

            <div className="flex items-center gap-3">
              <label className="text-sm">Experience:</label>
              <input
                type="number"
                min={0}
                max={20}
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                className="border rounded px-3 py-1 w-20"
              />
              <span className="text-gray-600 text-sm">years</span>
            </div>

            <div className="mt-3">
              <label className="text-sm">City / Location</label>
              <select
                className="border rounded px-3 py-2 w-full mt-1"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                {Object.keys(CITY_MULTIPLIER).map((c) => (
                  <option key={c}>{c[0].toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </section>

          <section className="bg-white p-5 rounded-lg shadow">
            <h2 className="font-semibold mb-3">Skills & Level (1-5)</h2>

            {skills.map((skill, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={skill.name}
                  onChange={(e) =>
                    updateSkill(i, "name", e.target.value)
                  }
                  placeholder="Skill Name"
                  className="border rounded px-3 py-1 w-full"
                />

                <input
                  type="number"
                  min={1}
                  max={5}
                  value={skill.level}
                  onChange={(e) =>
                    updateSkill(i, "level", Number(e.target.value))
                  }
                  className="border rounded px-2 py-1 w-16 text-center"
                />

                <button
                  onClick={() => removeSkill(i)}
                  className="text-red-500 px-2 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              onClick={addSkill}
              className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-sm"
            >
              + Add Skill
            </button>
          </section>
        </div>

        {/* Output */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="font-semibold text-sm text-gray-600">Estimated Salary</h2>
            <div className="text-5xl font-bold text-blue-600 mt-3">
              {market.expected.toFixed(1)} LPA
            </div>
            <p className="text-xs mt-2 text-gray-500">
              Range based on India hiring averages
            </p>

            <div className="flex items-center justify-center gap-5 mt-6">
              <div>
                <p className="text-xs text-gray-500">Low Range</p>
                <p className="text-lg font-semibold text-red-600">
                  {market.low.toFixed(1)} LPA
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">High Range</p>
                <p className="text-lg font-semibold text-green-600">
                  {market.high.toFixed(1)} LPA
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white p-5 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Negotiation Tips</h3>
            <ul className="list-disc ml-5 text-sm space-y-1">
              {negotiationTips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
