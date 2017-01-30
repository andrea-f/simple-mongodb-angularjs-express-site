## ABOUT ##
This is a bikes sorting, ordering and updating done with:
Backend:
Django or Node.js
Two mongo collections:
- users, for auth
- bikes
Frontend:
- Angular

## How to get up and running ##
# Prerequisites:
* Docker running

# Run
* Cd into backend_node and run: `docker build -t backend_image .`
* Cd into frontend and run: `docker build -t frontend_image .`
* In root directory of project run: `docker-compose up`
* Navigate to docker-machine ip address: `http://[DOCKER_MACHINE_IP]/index.html`
