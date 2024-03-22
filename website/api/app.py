from flask import Flask
from api.routes import consultations, questions, responses, topics
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(consultations.bp)
app.register_blueprint(questions.bp)
app.register_blueprint(responses.bp)
app.register_blueprint(topics.bp)

if __name__ == '__main__':        
    app.run()
