from flask import Blueprint, request, jsonify
from core.ats_engine import analyze_ats   # ← FIXED NAME

ats_api = Blueprint("ats_api", __name__)

@ats_api.route("/ats-score", methods=["POST"])
def ats_score():
    try:
        data = request.get_json(force=True)
        jd = data.get("jd", "")
        resume = data.get("resume", "")

        if not jd or not resume:
            return jsonify({"error": "JD and Resume text required"}), 400

        result = analyze_ats(jd, resume)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
