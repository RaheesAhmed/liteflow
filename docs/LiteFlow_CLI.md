# LiteFlow CLI Command Structure

## Create New Project

lite new my-app
--template (default|full|enterprise)
--package-manager (npm|yarn|pnpm)
--typescript
--features (auth,db,pay,ui)

## Development Commands

lite dev # Start development server
lite build # Build for production
lite start # Start production server
lite test # Run tests
lite lint # Run linter

## Feature Management

lite add auth # Add authentication
lite add db # Add database
lite add pay # Add payments
lite add ui # Add UI components

## Database Commands

lite db push # Push schema changes
lite db pull # Pull schema changes
lite db migrate # Run migrations
lite db seed # Seed database

## Deployment Commands

lite deploy # Deploy application
--platform (aws|gcp|azure|docker)
--env (staging|production)
--region (us-east|eu-west|etc)

## Plugin Commands

lite plugin add # Add plugin
lite plugin remove # Remove plugin
lite plugin list # List plugins
lite plugin update # Update plugins

## Development Tools

lite dev tools # Launch dev tools
lite analyze # Bundle analysis
lite doctor # Project diagnosis
lite update # Update LiteFlow
