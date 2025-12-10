import re

TECH_KEYWORDS = [
    "AWS","Amazon Web Services","Azure","GCP","Google Cloud","Terraform","Ansible",
    "Kubernetes","K8s","Docker","Jenkins","GitHub Actions","GitLab CI","Git","Linux",
    "Ubuntu","Python","Node.js","NodeJS","Bash","CI/CD","Prometheus","Grafana",
    "ArgoCD","Monitoring","Automation","PowerShell","IIS","CDN","SQL Server",
    "Postgres","MySQL","Database","Security","DevOps","IaC","CloudFormation",
    "SRE","Docker Compose","Nginx","Grafana","React","Express","Java","Spring"
]

def extract_skills_from_jd(jd:str):
    if not jd: return []

    found = []
    text = jd.lower()

    for k in TECH_KEYWORDS:
        if k.lower() in text:
            found.append(k)

    acronyms = re.findall(r"\b[A-Z]{2,5}\b", jd)
    for a in acronyms:
        if a not in found: found.append(a)

    return list(dict.fromkeys(found))   # unique + ordered
