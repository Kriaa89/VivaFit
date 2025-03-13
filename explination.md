# VivaFit Authentication System

## Overview
The VivaFit Authentication System is a comprehensive solution that integrates both frontend and backend components. It handles user registration, login, token issuance, and role-based access control, ensuring that only authenticated users can access protected features while providing a seamless user experience on the client side.

---

## Table of Contents
1. [Features](#features)
2. [System Architecture](#system-architecture)
3. [Installation and Setup](#installation-and-setup)
4. [Configuration](#configuration)
5. [Usage](#usage)
   - [Register a New User](#register-a-new-user)
   - [User Login](#user-login)
   - [Access Protected Endpoint](#access-protected-endpoint)
   - [Refresh Token](#refresh-token)
   - [Password Reset](#password-reset)
6. [Security Considerations](#security-considerations)
7. [API Endpoints](#api-endpoints)
8. [Workflows](#workflows)
9. [Testing](#testing)
10. [Contributing](#contributing)
11. [License](#license)

---

## Features
- **Frontend Integrated UI:** Responsive design with intuitive dashboards and real-time feedback.
- **Backend API Endpoints:** Robust RESTful services for authentication, token management, and user profile operations.
- **User Registration & Verification:** Secure registration with email/password and optional email verification.
- **JWT-Based Authentication:** Stateless session management using JSON Web Tokens.
- **Token Refresh & Logout:** Short-lived access tokens with accompanying refresh tokens.
- **Password Recovery:** Secure password reset workflow via email.
- **Role-Based Access Control (RBAC):** Define and enforce permissions based on user roles.
- **Audit Logging & Monitoring:** Detailed activity logs for security audits and performance monitoring.
- **Scalability:** Designed for high-volume authentication requests.
- **Integration-Ready:** RESTful APIs that work with mobile and web clients.

---

## System Architecture
The system is structured as a microservice:
- **Auth Server:** Core service (Node.js/Express) exposing authentication APIs.
- **Database:** Stores user profiles, hashed passwords, and token data (e.g., PostgreSQL, MongoDB).
- **Client Applications:** VivaFit web and mobile clients that interact with the Auth Server.
- **External Services:** Email/SMS services for verification and password reset.

### Authentication Flow Diagram
### Authentication Flow Diagram

```mermaid
graph LR
    A[User] -->|POST /auth/login| B[Auth Server]
    B -->|Verify credentials| C[Database]
    C -->|Credentials valid| B
    B -->|200 OK + JWT Tokens| A
    A -->|GET /protected/resource| B
    B -->|Validate JWT| B
    B -->|Return resource data| A

    classDef userStyle fill:#F6EAD3,stroke:#B58900,stroke-width:2px;
    classDef serverStyle fill:#DDF6FF,stroke:#268BD2,stroke-width:2px;
    classDef dbStyle fill:#DFFFD6,stroke:#859900,stroke-width:2px;

    class A userStyle;
    class B serverStyle;
    class C dbStyle;
Installation and Setup
Clone the Repository:
bash
Copier
git clone https://github.com/vivafit/auth-system.git
cd auth-system
Install Dependencies:
bash
Copier
npm install
Configure Environment Variables: Create a .env file with necessary variables (see Configuration).
Database Setup: Ensure your database is running and initialize the schema (e.g., using Sequelize migrations):
bash
Copier
npx sequelize db:migrate
Start the Server:
bash
Copier
npm start
The server will start on the port specified in the PORT variable (default is 3000).
Configuration
Key environment variables:

Variable	Description	Example
PORT	Port for the auth server	3000
DATABASE_URL	Database connection string	postgres://user:pass@host/db
JWT_SECRET	Secret key for signing JWT tokens	(long, random string)
JWT_EXPIRES_IN	JWT expiration time	15m
REFRESH_TOKEN_SECRET	Secret key for signing refresh tokens	(long, random string)
REFRESH_TOKEN_EXPIRES_IN	Refresh token expiration time	7d
EMAIL_SMTP_SERVER	SMTP server for sending emails	smtp.mailprovider.com
EMAIL_USER	SMTP username	no-reply@vivafit.com
EMAIL_PASS	SMTP password	********
CLIENT_URL	URL of the client application (for CORS/redirects)	https://app.vivafit.com
Note: Keep all secret keys confidential and do not commit them to version control.

Usage
Register a New User
Make a POST request to register a new user:

bash
Copier
curl -X POST https://api.vivafit.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{ "name": "Alice Example", "email": "alice@example.com", "password": "SecurePa$$123" }'
Expected Response: 201 Created on success.

User Login
Authenticate with your credentials:

bash
Copier
curl -X POST https://api.vivafit.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "alice@example.com", "password": "SecurePa$$123" }'
Expected Response: A JSON payload containing accessToken, refreshToken, and token expiry info.

Access Protected Endpoint
Access a secure endpoint by including the JWT:

bash
Copier
curl -X GET https://api.vivafit.com/profile \
  -H "Authorization: Bearer <JWT_TOKEN>"
Expected Response: 200 OK with user data, or an error if unauthorized.

Refresh Token
Obtain a new access token when the current one expires:

bash
Copier
curl -X POST https://api.vivafit.com/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{ "refreshToken": "<REFRESH_TOKEN>" }'
Expected Response: New access token (and optionally a new refresh token).

Password Reset
Request Reset:
bash
Copier
curl -X POST https://api.vivafit.com/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{ "email": "alice@example.com" }'
Reset Password:
bash
Copier
curl -X POST https://api.vivafit.com/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{ "resetToken": "<TOKEN_FROM_EMAIL>", "newPassword": "NewSecurePa$$456" }'
Security Considerations
Password Hashing: Passwords are hashed (e.g., using Bcrypt) before storage.
JWT Security: Access tokens have short lifespans and are signed with a strong secret.
Secure Token Storage: Tokens are stored securely (e.g., HTTP-only cookies).
Transport Security: All communication uses HTTPS with enforced TLS.
Input Validation & Sanitization: All inputs are validated and sanitized to prevent injection attacks.
Rate Limiting: Limits on login attempts help prevent brute-force attacks.
CORS & CSP: Configured to allow requests only from trusted origins and mitigate XSS.
Audit Logging: Logs critical operations for monitoring and security audits.
Regular Dependency Updates: Keep third-party libraries up-to-date to patch vulnerabilities.
API Endpoints
Endpoint	Method	Description	Auth Required?
/auth/register	POST	Register a new user account.	No
/auth/login	POST	Authenticate user and issue tokens.	No
/auth/refresh	POST	Refresh the access token using a refresh token.	No (refresh token required)
/auth/logout	POST	Log out the user (invalidate refresh token).	Yes
/auth/forgot-password	POST	Request a password reset email.	No
/auth/reset-password	POST	Reset password using the provided token.	No
/profile	GET	Protected endpoint to fetch user profile information.	Yes (access token required)
/admin/users	GET	Admin-only endpoint to list users (RBAC example).	Yes (admin role required)
Workflows
### User Registration Workflow
Submit Registration: User submits his/her details using a frontend form. The backend validates the input for duplicate emails and securely hashes passwords before creating the user profile.
Email Verification (Optional): The backend dispatches a verification token that the user activates using the client interface.

### User Login Workflow
Credentials Submission: The user logs in via the frontend, which sends credentials to the backend.
Authentication: The backend validates the credentials, issues JWT access and refresh tokens, and the frontend establishes a secure session with these tokens.

### Token Refresh & Session Management Workflow
Detect Expiration: The frontend monitors token expiry and triggers a request for a new access token.
Request New Token: The backend validates the refresh token and provides new tokens, ensuring continuous user sessions.

### Password Reset Workflow
Initiate Reset: The user triggers a password reset from the frontend, prompting the backend to send a secure reset token via email.
Reset Password: The user provides a new password along with the reset token in the frontend, and the backend updates the user credentials securely.
Testing
Run the test suite to verify functionality:

bash
Copier
npm test
This will execute unit and integration tests for registration, login, token refresh, and other features.

Contributing
Contributions are welcome! To contribute:

Issues: Open an issue on the repository for bugs or feature requests.
Pull Requests: Fork the repository and submit your pull request with proper tests.
Security: Report any security vulnerabilities privately for responsible disclosure.