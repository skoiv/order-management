# Order Management System - Implementation Tasks

## Backend Tasks

### Testing
- [x] Write API endpoint integration tests

### Database Layer
- [x] Set up PostgreSQL database with TypeORM
- [x] Create Order entity with required fields

### Service Layer
- [x] Create Order module
- [x] Implement Order service with Create and Read operations
- [x] Create DTOs for order creation and retrieval
- [x] Implement unique order number validation
- [ ] Implement human-readable ID generation system

### Controller Layer
- [x] Create endpoint for creating new orders
- [ ] Create endpoint for retrieving and filtering orders (by country and description)

## Frontend Tasks

### Testing
- [x] Write frontend BDD component tests (Jasmine/Karma)

### Project Setup
- [x] Set up Angular project
- [x] Configure routing
- [x] Set up Angular Material
- [x] Create basic layout components

### Order Creation Form
- [x] Create form component with all required fields
- [x] Implement form validation
- [ ] Add duplicate order number validation
- [x] Create error handling and display

### Order List Component
- [ ] Create order list view
- [ ] Implement country filter
- [ ] Implement description text search
- [ ] Add Estonia orders first sorting
- [ ] Add payment due date ascending sorting

### Services and State Management
- [x] Create order service for API communication
- [x] Implement error handling
- [x] Set up proper TypeScript interfaces

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
- [ ] Set up own model for service layer
- [ ] Set up interceptor, mw or framework level logging or integrate 3rd party solution- [ ] Implement database migrations
- [ ] Add loading states
