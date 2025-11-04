import requests
import json


url = "http://localhost:8000/predict_url"

input_data = {"url": "https://paypal-login-secure.xyz"}

input_json = json.dumps(input_data)
response = requests.post(url, data=input_json)
print(response.text)
