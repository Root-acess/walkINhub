from flask import Flask
from flask_cors import CORS

from routes.resume_routes import resume_routes
from routes.ats_routes import ats_routes
from routes.extract_text_routes import extract_routes

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins":"*"}})

app.register_blueprint(resume_routes, url_prefix="/api")
app.register_blueprint(ats_routes, url_prefix="/api")
app.register_blueprint(extract_routes, url_prefix="/api")

if __name__ == "__main__":
    app.run(port=5001, debug=True)
