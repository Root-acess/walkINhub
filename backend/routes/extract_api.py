from flask import Blueprint, request, jsonify
import pdfplumber

extract_api = Blueprint("extract_api", __name__)

@extract_api.route("/extract-text", methods=["POST"])
def extract_text():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        if not file.filename.lower().endswith(".pdf"):
            return jsonify({"error": "Only PDF supported"}), 400

        text = ""
        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                text += (page.extract_text() or "") + "\n"

        if len(text.strip()) < 40:
            return jsonify({"error": "Extraction weak — paste text manually"}), 400

        return jsonify({"text": text.strip()})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
