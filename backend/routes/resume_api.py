from flask import Blueprint,request,send_file,jsonify
from io import BytesIO
from core.resume_generator import generate_resume_pdf

resume_api = Blueprint("resume_api",__name__)

@resume_api.post("/generate-resume")
def generate():
    try:
        data = request.get_json(force=True)
        pdf  = generate_resume_pdf(data)

        filename = data.get("name","resume").replace(" ","_")+"_ATS.pdf"
        return send_file(BytesIO(pdf),as_attachment=True,download_name=filename)
    except Exception as e:
        return jsonify({"error":str(e)}),500
