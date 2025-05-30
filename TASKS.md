# Order Management System - Implementation Tasks

## Backend Tasks

### Testing
- [ ] Write API endpoint integration tests

### Database Layer
- [ ] Set up PostgreSQL database with TypeORM
- [ ] Create Order entity with required fields
- [ ] Implement database migrations

### Service Layer
- [ ] Create Order module
- [ ] Implement Order service with Create and Read operations
- [ ] Create DTOs for order creation and retrieval
- [ ] Implement unique order number validation
- [ ] Implement human-readable ID generation system

### Controller Layer
- [ ] Create endpoint for creating new orders
- [ ] Create endpoint for retrieving and filtering orders (by country and description)

## Frontend Tasks

### Testing
- [ ] Write frontend BDD component tests (Jasmine/Karma)

### Project Setup
- [x] Set up Angular project
- [x] Configure routing
- [x] Set up Angular Material
- [ ] Create basic layout components

### Order Creation Form
- [ ] Create form component with all required fields
- [ ] Implement form validation
- [ ] Add duplicate order number validation
- [ ] Create error handling and display

### Order List Component
- [ ] Create order list view
- [ ] Implement country filter
- [ ] Implement description text search
- [ ] Add Estonia orders first sorting
- [ ] Add payment due date ascending sorting

### Services and State Management
- [ ] Create order service for API communication
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Set up proper TypeScript interfaces

## DevOps Tasks
- [x] Set up Docker configuration
- [x] Create docker-compose.yml
- [x] Configure development environment

## Documentation
- [x] Setup instructions
- [x] Development guidelines

## Future Considerations
- [ ] Implement pagination for order list
- [ ] API documentation (Swagger)
- [ ] Deployment instructions 
- [ ] Set up CI/CD pipeline
- [ ] Implement E2E tests
- [ ] Set up test coverage reporting