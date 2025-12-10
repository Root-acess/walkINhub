from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from io import BytesIO
import datetime
from .resume_skills import extract_skills_from_jd


def generate_resume_pdf(payload:dict) -> bytes:
    name   = payload.get("name","Your Name")
    title  = payload.get("title","")
    jd     = payload.get("jd_text","")
    summary= payload.get("summary","")
    skills = payload.get("skills",[]) or extract_skills_from_jd(jd)

    experiences = payload.get("experiences",[])
    education   = payload.get("education",[])
    strengths   = payload.get("strengths",[])
    projects    = payload.get("projects",[])
    contact     = payload.get("contact","")
    email       = payload.get("email","")
    github      = payload.get("github","")
    linkedin    = payload.get("linkedin","")

    buf = BytesIO()
    doc = SimpleDocTemplate(buf,pagesize=A4,leftMargin=40,rightMargin=40,topMargin=36,bottomMargin=36)
    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(name="HDR", fontSize=22,fontName="Helvetica-Bold",textColor="#0F172A"))
    styles.add(ParagraphStyle(name="SUB", fontSize=12,fontName="Helvetica-Bold",textColor="#2563EB"))
    styles.add(ParagraphStyle(name="TXT", fontSize=10.5,leading=14,textColor="#334155"))
    styles.add(ParagraphStyle(name="BUL", fontSize=10.5,leftIndent=12,leading=14))

    content=[]
    content.append(Paragraph(name.upper(),styles["HDR"]))
    content.append(Paragraph(title,styles["SUB"]))
    content.append(Paragraph(f"{contact} | {email} | {github} | {linkedin}",styles["TXT"]))
    content.append(Spacer(1,8))
    content.append(HRFlowable(width="100%",color="#CBD5E1"))
    content.append(Spacer(1,12))

    # Summary
    content.append(Paragraph("SUMMARY",styles["SUB"]))
    content.append(Paragraph(summary or f"Experienced in {', '.join(skills[:8])}",styles["TXT"]))

    # Skills
    content.append(Paragraph("TECHNICAL SKILLS",styles["SUB"]))
    content.append(Paragraph(", ".join(skills),styles["TXT"]))

    # Experience
    if experiences:
        content.append(Paragraph("EXPERIENCE",styles["SUB"]))
        for e in experiences:
            content.append(Paragraph(f"<b>{e['title']}</b> — {e['org']} {e.get('from_to','')}",styles["TXT"]))
            for b in e['bullets']: content.append(Paragraph("• "+b,styles["BUL"]))
            content.append(Spacer(1,5))

    # Education
    if education:
        content.append(Paragraph("EDUCATION",styles["SUB"]))
        for e in education: content.append(Paragraph(f"{e['degree']} — {e['details']}",styles["TXT"]))

    # Projects
    if projects:
        content.append(Paragraph("PROJECTS",styles["SUB"]))
        for p in projects:
            content.append(Paragraph(f"<b>{p['title']}</b>: {p['desc']}",styles["BUL"]))

    content.append(Spacer(1,16))
    content.append(Paragraph(f"Generated on {datetime.date.today()} by WalkINHub",styles["TXT"]))

    doc.build(content)
    buf.seek(0)
    return buf.read()
