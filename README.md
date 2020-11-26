# GeoVis

## Setup

I changed the setup so the frontend will be served by the flask server. 
You can run the frontend outside the docker container for development and put it inside the backend container for production use. 
The server endpoint the frontend uses is changed using environment variables.  

## Running

Build frontend:
```bash
cd frontend
npm install
npm run build
```
Docker-compose:
```bash
docker-compose up
```