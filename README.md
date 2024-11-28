This project is a containerized React application built using Docker. It leverages **Nginx** to serve the React build and supports routing for single-page applications (SPAs). The project setup ensures ease of deployment and scalability.

---

## **Prerequisites**

Before you begin, ensure you have the following installed:

1. **Docker**  
   - [Docker Installation Guide](https://docs.docker.com/get-docker/)
2. **Docker Compose** (optional but recommended)  
   - [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)

---

## **Installation**

### 1. Clone the Repository
```bash
git clone https://github.com/naayifmuhammad/Dockerized-Bookstore-App.git
cd Dockerized-Bookstore-App
```

### 2. Build the Docker Image
Build the Docker image for the React application:
```bash
docker-compose build
```

---

## **Usage**

### 1. Start the Container
Run the container using:
```bash
docker-compose up
```
- This will start the application on port `3000` (default).  
- Open your browser and navigate to `http://localhost:3000`.

### 2. Stop the Container
To stop the running container, press `Ctrl+C` in the terminal or run:
```bash
docker-compose down
```

### 3. Rebuilding the Application
If you make changes to the source code and want to rebuild the application:
```bash
docker-compose build
docker-compose up
```

---

## **Configuration**

### Docker Compose Ports
The container serves the application on port `3000`.  
To change the port, update the `docker-compose.yml` file:
```yaml
ports:
  - "8080:3000"  # Change the host port from 3000 to 8080
```
Access the app via `http://localhost:8080` after restarting the container.

### Nginx Configuration
The Nginx configuration is located in the `nginx.conf` file. If changes are required, edit `nginx.conf` and rebuild the container:
```bash
docker-compose build
docker-compose up
```