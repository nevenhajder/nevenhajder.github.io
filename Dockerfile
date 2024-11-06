FROM nginx:latest

# By default nginx serves from this directory
ARG NGINX_ROOT="/usr/share/nginx/html"

# Copy static files into nginx server
COPY css ${NGINX_ROOT}/css
COPY images ${NGINX_ROOT}/images
COPY projects ${NGINX_ROOT}/projects
COPY index.html ${NGINX_ROOT}/index.html

# Is this required?
# EXPOSE 80

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]

