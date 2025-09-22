# Developer Test Assignment

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
This project contains two main parts?
- **Backend**: ASP.NET Core Web API (`todo-backend)
- **Frontend**: Next.js React application (`todo-frontend)

## Technologies

- **Backend**: ASP.NET Core Web API
    - Chosen for strong typing, LINQ support, and good tooling for REST APIs.
- **Frontend**: Next.js (React) with TypeScript
    - Chosen for fast development, server-side rendering, and component-based UI.
- **Bootstrap + Material Icons**: Provides a clean UI with minimal custom styling.

## Prerequisities

Before running, ensure you have installed:
- [.NET SDK 8+](https://dotnet.microsoft.com/en-us/download)
- [Node.js 18+](https://nodejs.org/)
- `npm` (comes with Node.js)

## Running the Application

### Start the Backend

Open a terminal.

Navigate to the repository level of the project (todo-assignment).

```bash
# Navigate to the WebApp project
cd todo-backend/webapp
# Restore dotnet
dotnet restore
# Build and run the project
dotnet run
```

Pay attention to the output of the `dotnet run` command.

```bash
Building...
info: Microsoft.Hosting.Lifetime[14]
Now listening on: http://localhost:5221
```

**Save the url** for later use.



### Start the Frontend

Open another terminal.

Navigate back to the repository level of the project (todo-assignment).

```bash
cd ../..
```

```bash
# Navigate to the frontend
cd todo-frontend
# Set the backend url environment variable
# e.g. NEXT_PUBLIC_BACKEND_URL=http://localhost:5221
NEXT_PUBLIC_BACKEND_URL=[Backend link from before]
# Install dependencies
npm install
# Start the development server
npm run dev
```

Pay attention to the output of the `npm run dev` command.

```bash
> todo-frontend@0.1.0 dev
> next dev --turbopack

 Port 3000 is in use by process 27060, using available port 3001 instead.
   Next.js 15.5.3 (Turbopack)
   - Local:        http://localhost:3001
   - Network:      http://192.168.1.109:3001

```

Navigate to the Local url provided to reach the application.

### Notes

* You must keep 2 terminals open (backend and frontend).
* The environment variable NEXT_PUBLIC_BACKEND_URL is required because the backend port may vary.