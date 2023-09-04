# Stage 1: Development
FROM node:18-alpine AS development
ENV NODE_ENV=development
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["yarn", "start"]

# Stage 2: Builder
FROM node:18-alpine AS builder
ENV NODE_ENV=production
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
ARG REACT_APP_HASS_URL
ARG REACT_APP_HASS_TOKEN
ARG REACT_APP_PUBLIC_URL
ENV REACT_APP_HASS_URL=$REACT_APP_HASS_URL
ENV REACT_APP_HASS_TOKEN=$REACT_APP_HASS_TOKEN
ENV REACT_APP_PUBLIC_URL=$REACT_APP_PUBLIC_URL
RUN yarn build

# Stage 3: Production with nginx
FROM nginx:1.21.0-alpine AS production
ENV NODE_ENV=production
COPY --from=builder /app/build /usr/share/nginx/html
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
