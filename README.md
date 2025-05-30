# Order Management System

A full-stack order management system built with Angular and NestJS, containerized with Docker.

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd order-management
```
2. Start the application:
```bash
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:4200
- Backend: http://localhost:3000

## Prerequisites

- Docker and Docker Compose
- Node.js (v22 LTS or later)
- npm (v10 or later)

## Code Quality: Linting and Formatting

You can check and automatically fix code style issues using the root-level script:

```bash
npm run check
```

This script runs ESLint and Prettier for both the backend and frontend.

## Development

### Frontend (Angular)

The frontend is built with Angular 17 and uses standalone components. Key features:
- Modern Angular features (standalone components, signals)
- TypeScript for type safety
- SCSS for styling
- Angular Material for UI components

Development workflow:
- Source code is in `frontend/src/`
- Component-based architecture

### Backend (NestJS)

The backend is built with NestJS and provides a RESTful API. Key features:
- TypeScript for type safety
- DTOs for request/response validation
- Environment-based configuration
- Docker containerization

Development workflow:
- Source code is in `backend/src/`
- Module-based architecture

## Technology Stack

### Frontend
- Framework: Angular 17
- Language: TypeScript
- Styling: SCSS
- Package Manager: npm
- Container: Node.js 22 Alpine

### Backend
- Framework: NestJS
- Language: TypeScript
- Package Manager: npm
- Container: Node.js 22 Alpine

### Testing
- Frontend: Karma, Jasmine
- Backend: Jest

## Implementation Plan

For a detailed breakdown of implementation tasks and progress tracking, please refer to [TASKS.md](TASKS.md).