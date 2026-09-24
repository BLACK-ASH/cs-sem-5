from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs
from datetime import datetime

USERS = {"admin": "secret123", "guest": "welcome1"}
LOG_FILE = "login_attempts.log"
MAX_FAILURES = 5
failures = {}

PAGE = """<!doctype html>
<html>
<head><title>IDS Login</title>
<style>
  body{font-family:sans-serif;display:flex;justify-content:center;padding-top:80px;background:#f0f2f5}
  .card{background:#fff;padding:30px 40px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,.15)}
  h1{font-size:20px;margin-top:0} input{margin:8px 0;padding:8px;width:100%;box-sizing:border-box}
  button{width:100%;padding:10px;background:#1877f2;color:#fff;border:0;border-radius:5px;cursor:pointer;margin-top:10px}
  .msg{margin-bottom:10px;padding:8px;border-radius:5px} .ok{background:#d4edda}.err{background:#f8d7da}
</style></head>
<body>
<div class="card">
  <h1>Intrusion Detection System - Login</h1>
  {msg}
  <form method="POST" action="/login">
    <input name="username" placeholder="Username" required autofocus>
    <input type="password" name="password" placeholder="Password" required>
    <button type="submit">Login</button>
  </form>
</div>
</body></html>"""


def log_attempt(ip, username, ok, flagged):
    line = "%s | %-15s | %-10s | %s%s" % (
        datetime.now().strftime("%Y-%m-%d %H:%M:%S"), ip,
        username, "SUCCESS" if ok else "FAILED",
        " | BRUTE-FORCE RATE LIMITED" if flagged else "")
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.respond("")

    def do_POST(self):
        params = parse_qs(self.rfile.read(int(self.headers.get("Content-Length", 0))).decode())
        username = (params.get("username") or [""])[0].strip()
        password = (params.get("password") or [""])[0]
        ip = self.client_address[0]

        ok = USERS.get(username) == password
        failures[ip] = failures.get(ip, 0) + 1 if not ok else 0
        flagged = failures[ip] >= MAX_FAILURES

        log_attempt(ip, username, ok, flagged)

        if ok:
            msg = '<div class="msg ok">Login successful. Welcome, %s!</div>' % username
        elif flagged:
            msg = '<div class="msg err">Too many failed attempts. Possible brute-force attack blocked.</div>'
        else:
            msg = '<div class="msg err">Invalid username or password.</div>'
        self.respond(msg)

    def respond(self, msg):
        body = PAGE.replace("{msg}", msg).encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/html")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    print("Login server on http://localhost:8000 (log: %s)" % LOG_FILE)
    HTTPServer(("", 8000), Handler).serve_forever()