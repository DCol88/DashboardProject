from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'GlobalSharkAttacks'
COLLECTION_NAME = 'attacksList'

@app.route('/')
def index():
    return render_template("index.html")

@app.route("/GlobalSharkAttacks/attacksList")
def donor_projects():
    FIELDS = {
        '_id': False, 
        'Year': True,
        'Type': True,
        'Country': True,
        'Activity': True,
        'Sex': True,
        'Fatal (Y/N)': True,
        'Species': True 
    }

    with MongoClient(MONGODB_HOST,MONGODB_PORT) as conn:
        collection = conn[DBS_NAME][COLLECTION_NAME]
        projects = collection.find(projection = FIELDS, limit = 150)
        return json.dumps(list(projects))

if __name__ == "__main__":
    app.run(debug=True)