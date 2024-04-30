import requests
import json
# Define the URL endpoint you want to send the POST request to
url = 'http://localhost:5000/api/auth/altsignup'
from datetime import datetime


# Define the data you want to send in the POST request

with open("data.json", 'r', encoding='utf-8') as f:
   json_data = json.load(f)

for lawyer in json_data:
   data = {
      "name": lawyer["name"],
      "email": lawyer["email"],
      "regno": lawyer["regno"],
      "phone": lawyer["phone"],
      "date": datetime.strptime(lawyer["date"], "%d/%m/%Y"),
      "specialization": lawyer["spec"],
      "address": lawyer["loc"],
      "password": "password",
      "role": 1,
      "tags":lawyer["tags"]
   }

   # Send the POST request
   response = requests.post(url, data=data)

   # Check if the request was successful (status code 200)
   if response.status_code == 200:
      print("POST request successful!")
      print("Response:", response.text)
   else:
      print("POST request failed with status code:", response.status_code)
