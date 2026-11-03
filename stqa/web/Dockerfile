FROM nginx:1.27-alpine

LABEL org.opencontainers.image.title="Aldercrest University student portal"
LABEL org.opencontainers.image.description="Aldercrest University student portal."
LABEL org.opencontainers.image.licenses="MIT"

RUN rm -f /etc/nginx/conf.d/default.conf /usr/share/nginx/html/50x.html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html/
RUN rm -f /usr/share/nginx/html/nginx.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
