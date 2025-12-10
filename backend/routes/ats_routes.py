from flask import Blueprint, request, jsonify
from core.ats_engine import analyze_ats  # <-- file we create below

ats_routes = Blueprint("ats_routes", __name__)

@ats_routes.route("/ats-score", methods=["POST"])
def ats_score_api():
    data = request.get_json()
    jd = data.get("jd", "").strip()
    resume = data.get("resume", "").strip()

    if not jd or not resume:
        return jsonify({"error": "JD and Resume text required"}), 400

    result = analyze_ats(jd, resume)
    return jsonify(result)
