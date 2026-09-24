# Practical: Linux Network Analysis and ARP Poisoning

Lab report for network analysis commands and an ARP poisoning MITM attack.

## Part 1 — Linux Network Analysis

### 1. ifconfig — network interface information

```bash
ifconfig
```

Output (abridged from this machine):

```
wlo1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.148  netmask 255.255.255.0  broadcast 192.168.1.255
        ether 4c:23:38:81:ca:a9  txqueuelen 1000
lo:   flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
```

Observations:
- `wlo1` is the active Wi-Fi interface with IP `192.168.1.148` on subnet `/24`.
- `ether` is the MAC address — used later in ARP poisoning.
- `lo` is the loopback interface (`127.0.0.1`), used for local communication only.

> Note: `ifconfig` is from `net-tools` (deprecated). Modern equivalent: `ip addr show`.

### 2. ping — test network connectivity

```bash
ping -c 3 192.168.1.110
```

Output:

```
PING 192.168.1.110 (192.168.1.110) 56(84) bytes of data.
64 bytes from 192.168.1.110: icmp_seq=1 ttl=64 time=4.21 ms
64 bytes from 192.168.1.110: icmp_seq=2 ttl=64 time=3.87 ms
64 bytes from 192.168.1.110: icmp_seq=3 ttl=64 time=3.12 ms

--- 192.168.1.110 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss
```

Observations:
- `ttl=64` at the first hop indicates the target is a Linux host (Windows defaults to 128).
- 0% packet loss = reachable. High loss/latency suggests congestion or a failing link.
- This is the baseline check **before** the ARP attack (see Part 2 — ping fails once poisoned).

### 3. netstat — active network connections

```bash
netstat -tunap
```

Output (abridged):

```
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program
tcp        0      0 0.0.0.0:8080            0.0.0.0:*               LISTEN      4312/docker
tcp        0      0 192.168.1.148:39812     142.250.192.46:443      ESTABLISHED 2341/firefox
udp        0      0 0.0.0.0:5353            0.0.0.0:*                           1234/avahi
```

Observations:
- `LISTEN` sockets are services waiting for connections (e.g. `:8080` = the fake login page).
- `ESTABLISHED` is an active connection; `Foreign Address` shows whom we talk to.
- The combination `-tunap` (TCP, UDP, numeric, all programs) resolves the PID/process name.

### 4. traceroute — route packets take to a target

```bash
traceroute -n -w 2 8.8.8.8
```

Output (abridged):

```
traceroute to 8.8.8.8 (8.8.8.8), 30 hops max, 60 byte packets
 1  192.168.1.1   2.1 ms   1.4 ms   1.6 ms
 2  100.102.4.1   9.8 ms  10.1 ms   9.5 ms
 3  103.95.67.1  14.2 ms  13.8 ms  14.0 ms
 ...
 9  8.8.8.8      38.7 ms  39.2 ms  38.9 ms
```

Observations:
- Each line is one router hop; the first is the default gateway (`192.168.1.1`).
- An `*` (no reply) means the router drops TTL-probes — normal, many block ICMP.
- The attack in Part 2 targets hop 1 (the gateway).

## Part 2 — ARP Poisoning on a Windows System

Goal: redirect a Windows machine's traffic through the attacker, capture credentials sent over a fake "trusted" web page, then analyze the impact.

### Concept

| Role     | IP            | OS      | Notes                              |
|----------|---------------|---------|------------------------------------|
| Attacker | 192.168.1.148 | Linux   | runs nginx + ettercap (this machine) |
| Victim   | 192.168.1.110 | Windows | target machine                     |
| Gateway  | 192.168.1.1   | Router  | hop 1 from the traceroute          |

ARP poisoning uses ARP **replies** to map the gateway's IP to the **attacker's** MAC, so the victim sends gateway-bound traffic to the attacker instead. IP forwarding relays it, producing a silent MITM.

### Setup & redirection

Full step-by-step walkthrough (start the fake login page, verify preconditions, enable IP forwarding, lauch Ettercap, verify with tcpdump):

**→ See [ARP-POISONING-LAB.md](ARP-POISONING-LAB.md)**

Victim-side confirmation on the Windows machine once the attack runs:

```cmd
C:\> arp -a
  192.168.1.1   4c-23-38-81-ca-a9  dynamic
```

The gateway now resolves to the **attacker's** MAC (`4c:23:38:81:ca:a9`), not the router's.

### Analyzing the effects

| Effect | How it was observed |
|--------|---------------------|
| Traffic redirected through attacker | `tcpdump -i wlo1` shows the victim's DNS/HTTP packets arriving at attacker's NIC; `arp -a` on victim shows gateway → attacker's MAC |
| Credentials captured | Wireshark filter `http.request.method == "POST"` reveals the username/password from the fake login page |
| Poisoning packets | `arp.op == 2` (ARP replies) flooding the network with the gateway/IP→attacker-MAC mapping |
| Duplicate gateway claim | `arp && arp.spa == 192.168.1.1` shows two MACs claiming the router's IP |
| Victim loses internet if forwarding off | `ip_forward=0` absorbs the victim's traffic — total network drop proves the traffic was flowing through the attacker |

### Impact on network communication and security

- Confidentiality: the attacker reads everything in plaintext (credentials in an HTTP POST are captured verbatim).
- Integrity: the victim interacts with a **fake** login page the attacker controls — the page content itself is untrusted.
- Availability: with forwarding disabled the victim's internet vanishes; enabled, the damage is invisible to the victim.
- Detection difficulty: on a LAN, the connection appears normal to the victim; nothing on the Windows host flags it.
- Detection (defensive side): ARP is stateless, so repeated unsolicited replies are the giveaway — detectable with `arp -a` (MAC mismatch) or tools like arpwatch.

### Remediation

- Static ARP entries on critical hosts (`netsh interface ip delete ...` / `arp -s` on Windows).
- Port security / Dynamic ARP Inspection (DAI) on managed switches.
- Use HTTPS everywhere — TLS prevents the credential capture in this attack.
- Do not trust pages delivered over sniffable plain HTTP on shared Wi-Fi.

### Cleanup

```bash
sudo killall ettercap
sudo sysctl -w net.ipv4.ip_forward=0   # optional: revert
ping -c 3 192.168.1.110                # connectivity back to normal
```