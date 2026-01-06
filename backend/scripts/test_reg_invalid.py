import urllib.request
import json

url = "http://127.0.0.1:8000/auth/register"
# Invalid data: password too short
data = {
    "username": "testuser_invalid",
    "email": "test_invalid@example.com",
    "password": "123", 
    "full_name": "Test User Invalid"
}
req = urllib.request.Request(
    url,
    data=json.dumps(data).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(e)
