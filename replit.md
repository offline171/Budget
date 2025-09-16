# Overview

This is a personal budget management web application built with Node.js and Express. The app allows users to track their financial transactions, manage account balances, and monitor spending patterns. Users can create accounts, log transactions, set closing dates for billing cycles, and make payments toward their credit balances. The application provides a simple interface for personal financial management with user authentication and transaction ownership protection.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Framework
- **Express.js** with EJS templating engine for server-side rendering
- **Node.js** runtime environment
- **RESTful routing** structure with dedicated routers for different features (transactions, accounts, authentication)

## Authentication & Authorization
- **Passport.js** with local strategy for username/password authentication
- **bcryptjs** for password hashing and security
- **Express sessions** with PostgreSQL session store for persistent login state
- **Custom middleware** for route protection and ownership verification
- **Role-based access control** ensuring users can only access their own data

## Database Architecture
- **PostgreSQL** as the primary database with connection pooling
- **Database migrations** system for schema management
- **Money storage** using integer values (cents) to avoid floating-point precision issues
- **User-transaction relationship** with foreign key constraints for data integrity

## Data Models
- **Users table**: stores credentials, account balances (money and credit)
- **Transactions table**: stores financial transactions with user ownership, dates, and payment status
- **Session storage**: PostgreSQL-backed session management

## Security Features
- **Environment-based configuration** with production/development modes
- **SSL support** for production deployments
- **Input validation** for user registration and data entry
- **CSRF protection** through method override middleware
- **Secure session configuration** with proxy trust for cloud deployments

## Application Structure
- **Modular routing** with separate files for each feature area
- **Middleware-based architecture** for authentication and authorization
- **Error handling** with proper HTTP status codes and user feedback
- **Environment validation** with required checks for production deployment

# External Dependencies

## Core Framework Dependencies
- **Express.js 5.1.0** - Web application framework
- **EJS 3.1.10** - Templating engine for server-side rendering

## Database & Storage
- **pg 8.16.3** - PostgreSQL client for Node.js
- **connect-pg-simple 10.0.0** - PostgreSQL session store for Express
- **sqlite3 5.1.7** - Alternative database option (not actively used)

## Authentication & Security
- **passport 0.5.3** - Authentication middleware
- **passport-local 1.0.0** - Local username/password strategy
- **bcryptjs 3.0.2** - Password hashing library
- **express-session 1.18.2** - Session management middleware

## Utility Libraries
- **dotenv 17.2.1** - Environment variable management
- **moment 2.30.1** - Date manipulation and formatting
- **method-override 3.0.0** - HTTP method override for forms
- **uuid 11.1.0** - Unique identifier generation
- **wait-port 1.1.0** - Port availability checking utility

## Development & Deployment
- **cookie-session 2.1.1** - Alternative session management
- Environment variables for database connection and session secrets
- Production-ready configuration with SSL and proxy support
- Cloud deployment compatibility (Replit, Heroku)