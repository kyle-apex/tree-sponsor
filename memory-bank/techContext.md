# Technical Context

## Technology Stack

### Frontend

- **React**: UI library
- **Next.js**: React framework for SSR and routing
- **Material-UI**: Component library (based on imports and structure)
- **Emotion**: CSS-in-JS styling solution
- **MUI-RTE**: Rich text editor component

### Backend

- **Next.js API Routes**: Serverless functions for backend logic
- **Prisma ORM**: Database access layer
- **PostgreSQL**: Database (inferred from Prisma setup)
- **Authentication**: Custom auth system

### External Services

- **Google Maps/Mapbox**: For mapping functionality
- **Stripe**: Payment processing
- **AWS**: Likely used for image storage
- **Mailchimp**: Email marketing integration

## Development Environment

### Container Setup

- **Docker**: Development container configuration
- **DevContainer**: VSCode development container setup

### Testing

- **Jest**: Testing framework
- **React Testing Library**: Component testing

## Key Dependencies

Based on the project structure, the application likely depends on:

1. **Database-related**:

   - Prisma Client
   - PostgreSQL driver

2. **UI/Frontend**:

   - React
   - Next.js
   - Material-UI components
   - Emotion for styling
   - Form handling libraries

3. **Maps/Location**:

   - Google Maps JavaScript API
   - Mapbox GL
   - Geocoding services

4. **Authentication**:

   - JWT or session-based auth
   - Password hashing libraries

5. **Media Handling**:
   - Image processing libraries
   - File upload components
   - Storage integrations

## Technical Constraints

1. **Browser Compatibility**: Likely targeting modern browsers
2. **Responsive Design**: Supporting various device sizes
3. **Performance Considerations**: Optimizing for map rendering and image loading
4. **Security Requirements**: Protecting user data and authentication
5. **Accessibility**: Ensuring the application is usable by all users

## Development Workflow

The project appears to use:

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Jest for testing
- Docker for containerized development

This document will be updated as we learn more about the technical aspects of the project.
