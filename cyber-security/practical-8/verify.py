import threading, urllib.request, urllib.parse, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import server

def post(u, p):
    data = urllib.parse.urlencode({"username": u, "password": p}).encode()
    req = urllib.request.Request("http://localhost:8000/login", data=data)
    with urllib.request.urlopen(req) as r:
        return r.read().decode()

try: os.remove(server.LOG_FILE)
except FileNotFoundError: pass

srv = server.HTTPServer(("", 8000), server.Handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()

ok = post("admin", "secret123")
bad = post("admin", "wrong")
assert "Login successful" in ok, ok
assert "Invalid username or password" in bad, bad
with open(server.LOG_FILE) as f:
    log = f.read()
assert "SUCCESS" in log and "FAILED" in log, log
print("PASS\n" + log)
srv.shutdown()