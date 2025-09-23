# Developer Test Assignment

**Assignment from:** Helmes  
**Completed by:** Sandra Örd

## Application
The application provides the user basic task management functionality:
* Create
* Update
* Complete
* Delete
* Sort
* Filter
* Search

## Project Structure
This project contains two parts:
- **Backend**: ASP.NET Core Web API ([`todo-backend`](./todo-backend))
- **Frontend**: Next.js React application ([`todo-frontend`](./todo-frontend))

## Technologies

- **Backend**: ASP.NET Core Web API
    - Chosen for strong typing, LINQ support, and good tooling for REST APIs.
- **Frontend**: Next.js (React) with TypeScript
    - Chosen for fast development and a modular component-based architecture.
- **Bootstrap + Material Icons**: Provides a clean, responsive UI with minimal custom styling.

## Prerequisites

Before running, ensure you have installed:
- [.NET SDK 8+](https://dotnet.microsoft.com/en-us/download)
- [Node.js 18+](https://nodejs.org/)

## Running the Application

### Backend

1. Open a terminal and navigate to the backend project.
    ```bash
    cd todo-assignment/todo-backend
    ```
2. Navigate to the web application project.
    ```bash
    cd webapp
    ```
3. Restore dependencies.
    ```bash
    dotnet restore
    ```
4. Build and run the project.
    ```bash
    dotnet run
    ```
5. Take note of the output URL (e.g. http://localhost:5221).
    ```bash
    Building...
    info: Microsoft.Hosting.Lifetime[14]
    Now listening on: http://localhost:5221
    ```
    The URL will be used to configure the frontend.

### Frontend

1. Open another terminal and navigate to the frontend project.
    ```bash
    cd todo-assignment/todo-frontend
    ```
2. Install dependencies.
    ```bash
    npm install
    ```
3. Set the backend URL environment variable.
    ```bash
    ## Use the URL from the backend output.
    ## e.g. export NEXT_PUBLIC_BACKEND_URL=http://localhost:5221
    export NEXT_PUBLIC_BACKEND_URL=[Backend URL]
    ```
4. Start the development server.
    ```bash
    npm run dev
    ```
5. Take note of the output for the local URL (e.g. http://localhost:3000).
    ```bash
    Next.js 15.5.3 (Turbopack)
    - Local:        http://localhost:3000
    - Network:      http://10.224.32.125:3000
    - Environments: .env
    ```
6. Open the local URL in your browser to access the application.

### Notes

* You must keep 2 terminals open (backend and frontend).
* The environment variable NEXT_PUBLIC_BACKEND_URL is required because the backend port may vary.