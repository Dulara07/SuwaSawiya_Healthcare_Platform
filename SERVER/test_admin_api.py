import requests

BASE = 'http://localhost:8000'

def main():
    resp = requests.post(f"{BASE}/auth/login/admin", data={"username":"admin","password":"admin123"})
    resp.raise_for_status()
    token = resp.json().get('access_token')
    print('token:', token)
    headers = {"Authorization": f"Bearer {token}"}
    r = requests.get(f"{BASE}/admin/dashboard", headers=headers)
    print('status', r.status_code)
    print(r.json())

if __name__ == '__main__':
    main()
