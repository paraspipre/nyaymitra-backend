from flask import Flask
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/check")
async def check():
   return True

@app.route('/recommadlawyer')
@cross_origin()
async def recommand():
   pass

