# Aldercrest University — Student Portal

A university student portal built with HTML, CSS, and vanilla JavaScript, packaged
with nginx for containerised deployment. There is no backend and no front-end build
step.

## Run with Docker

Requires Docker and Docker Compose.

```bash
docker compose -f web/compose.yaml up -d --build
```

Open <http://localhost:8080>.

```bash
docker compose -f web/compose.yaml ps        # container and health status
docker compose -f web/compose.yaml logs -f   # nginx access and error logs
docker compose -f web/compose.yaml down      # stop and remove the container
```

To build and run the image without Compose:

```bash
docker build -t aldercrest/student-portal:1.0.0 web
docker run --rm -p 8080:80 aldercrest/student-portal:1.0.0
```

## Run without Docker

```bash
cd web
python3 -m http.server 8765
```

Then open <http://127.0.0.1:8765/>. Opening `web/index.html` directly also works.

## Sign in

| Username | Password |
| --- | --- |
| `student` | `student123` |

## Pages

| Page | URL | File |
| --- | --- | --- |
| Home | `/` | `web/index.html` |
| Login | `/login` | `web/login.html` |
| Students | `/students` | `web/students.html` |
| Services | `/elements` | `web/elements.html` |
| IT service desk | `/servicedesk` | `web/servicedesk.html` |
| Preferences | `/controls` | `web/controls.html` |
| Documents | `/upload` | `web/upload.html` |

Both `/students` and `/students.html` resolve to the same page.

## Deployment notes

- The container listens on port 80; `compose.yaml` publishes it as `8080`.
- `GET /healthz` returns `200 ok` for container, proxy, and load-balancer health checks.
- Terminate TLS at a reverse proxy or load balancer in front of the container.
- HTML is served with `Cache-Control: no-cache`; CSS, JS, SVG, and TXT are cached for one hour.
- Security headers (CSP, frame denial, MIME sniffing protection, referrer policy) are set in `web/nginx.conf`.
- The site is copied into the image at build time, so rebuild after changing content.

## Project layout

```
.
├── README.md               This file
├── defect.md               Seeded defect list (not published in the image)
├── stqa_all_practicals.zip Original source material (not published)
└── web/                    Website and deployment files
    ├── Dockerfile          nginx image definition
    ├── compose.yaml        Service, port, health check, and hardening
    ├── nginx.conf          Server block: routing, caching, gzip, headers
    ├── .dockerignore       Files excluded from the image build context
    ├── index.html          Home
    ├── login.html          Sign in
    ├── students.html       Student records
    ├── elements.html       Student services
    ├── servicedesk.html    IT service desk
    ├── controls.html       Course preferences
    ├── upload.html         Documents
    ├── 404.html            Not-found page
    ├── css/styles.css      Shared styling
    ├── js/                 Page scripts (including servicedesk.js)
    └── assets/             Images and documents
        ├── campus.svg
        ├── library.svg
        ├── favicon.svg
        ├── examination-guidelines.txt
        └── semester-assignment.txt
```
