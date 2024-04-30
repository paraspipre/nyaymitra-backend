from flask import Flask , request
from flask_cors import CORS, cross_origin
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import spacy
import numpy as np
from pymongo import MongoClient

#create instance of the SpaCy NLP model
nlp = spacy.load("en_core_web_sm")
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/check")
async def check():
   return True

client = MongoClient('mongodb+srv://paras:paras@cluster0.uaueb.mongodb.net')

@app.route('/recommadlawyer', methods=['POST'])
@cross_origin()
async def recommand():
   data = request.json
   text = data.get('text')
   # def preprocess_text(text):
   #  doc = nlp(text)
   #  lemmatized_tokens = [token.lemma_ for token in doc if token.is_alpha and token.lemma_ not in nlp.Defaults.stop_words]
   #  return ' '.join(lemmatized_tokens)

   # processed_fir = preprocess_text(text)

   print(text)
   print(client)


   #create document of fir data and lawyers data
   # documents = [processed_fir] + list(df['tags'])

   # #vectorization

   # #1 TF-IDF and Cosine similarity
   # vectorizer = TfidfVectorizer()
   # tfidf_matrix = vectorizer.fit_transform(documents)


   # #cosine similarity
   # similarities = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1:])[0]

   # print("#"*100)
   # print("Using TF-IDF")
   # print("Similarity Score")
   # print(sorted(similarities, reverse=True)[:11])
   # print("\n")
   # sorted_indices = np.argsort(similarities)[::-1]
   # top_n_indices = sorted_indices[:10]
   # recommended_lawyers = df.iloc[top_n_indices]
   # print(recommended_lawyers)