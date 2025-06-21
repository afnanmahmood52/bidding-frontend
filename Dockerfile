# Stage 1: Build
FROM node:18 AS build
WORKDIR /app

# Accept backend URL from build args
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

COPY package.json package-lock.json ./
RUN npm install

COPY .env ./
COPY . .

# Inject env during build by replacing Vite env manually if needed
RUN echo "VITE_BACKEND_URL=$VITE_BACKEND_URL" > .env

RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
