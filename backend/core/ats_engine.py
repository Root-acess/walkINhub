import re

TECH_KEYWORDS = [
    "aws","azure","gcp","terraform","ansible","kubernetes","k8s","docker",
    "jenkins","github actions","gitlab ci","git","linux","ubuntu","python",
    "node.js","nodejs","bash","ci/cd","prometheus","grafana","argocd",
    "monitoring","automation","powershell","iis","cdn","sql server",
    "postgres","mysql","database","security","devops","iac","cloudformation",
    "sre","nginx","react","java","spring","typescript","graphql","rest api"
]

STOPWORDS = {"the","and","or","a","an","to","for","with","in","on","of","by",
             "is","are","be","as","that","this","can","should","from","your",
             "we","you","their","it","will"}


def normalize(txt):
    return re.sub(r"\s+"," ",re.sub(r"[^\w\s.\-/+]"," ",txt)).lower().strip()


def extract_keywords(jd):
    text = normalize(jd)
    tokens = text.split()

    # frequency counter
    freq = {}
    for i,t in enumerate(tokens):
        if t not in STOPWORDS and len(t) > 2:
            freq[t] = freq.get(t,0)+1

        if i+1 < len(tokens):
            b = f"{t} {tokens[i+1]}"
            if tokens[i+1] not in STOPWORDS:
                freq[b] = freq.get(b,0)+1

    core = sorted(freq.items(), key=lambda x: x[1], reverse=True)[:40]
    tech = [k for k in TECH_KEYWORDS if k in text]

    return list(dict.fromkeys(tech + [k for k,_ in core]))


def analyze_ats(jd, resume):
    keys = extract_keywords(jd)
    resume = normalize(resume)

    matched = []
    breakdown = []

    for kw in keys:
        occ = len(re.findall(rf"\b{re.escape(kw)}\b", resume))
        if occ > 0:
            matched.append(kw)
            breakdown.append({"keyword":kw,"found":True,"occurrences":occ})
        else:
            breakdown.append({"keyword":kw,"found":False,"occurrences":0})

    total = len(keys)
    score = round((len(matched)/total)*100) if total else 0

    missing = [k for k in keys if k not in matched]
    suggestions = [f"Add {m} to resume with example impact." for m in missing[:15]]

    return {
        "score":score,
        "matched":matched,
        "matchedCount":len(matched),
        "missing":missing,
        "suggestions":suggestions,
        "total":total,
        "breakdown":breakdown
    }
