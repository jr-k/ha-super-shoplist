# HA-SUPER-SHOPLIST

# Run with docker
```yaml
version: '3'
services:
  app:
    image: node:16
    volumes:
      - ./:/app
    working_dir: /app
    command: sh -c "npm install && NODE_ENV=production npm start"
    ports:
      - "${APP_PORT:-3000}:${APP_PORT:-3000}"
    environment:
      - APP_PORT=${APP_PORT:-3000}
      - REACT_APP_HASS_URL=
      - REACT_APP_HASS_TOKEN=
      - NODE_ENV=production
```

```bash
docker compose up
```
