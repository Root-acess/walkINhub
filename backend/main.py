from flask import Flask
from flask_cors import CORS

from routes.resume_api import resume_api
from routes.ats_api import ats_api
from routes.extract_api import extract_api  # MUST WORK NOW

app = Flask(__name__)
CORS(app)

app.register_blueprint(resume_api, url_prefix="/api")
app.register_blueprint(ats_api, url_prefix="/api")
app.register_blueprint(extract_api, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True, port=5001)
