import urllib.request
import json

url = "http://127.0.0.1:8000/auth/register"
data = {
    "username": "testuser_v2",
    "email": "test_v2@example.com",
    "password": "testpass",
    "full_name": "Test User V2"
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
    print(f"HTTPError: {e.code} {e.read().decode('utf-8')}")
except Exception as e:
    print(e)
