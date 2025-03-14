# VivaFit Authentication System

<div align="center">
  <img src="https://via.placeholder.com/600x150?text=VivaFit+Authentication+System" alt="VivaFit Authentication System">
</div>

---

## Overview
The VivaFit Authentication System is a comprehensive solution integrating both frontend and backend components. It handles user registration, login, token issuance, and role-based access control—ensuring that only authenticated users can access protected features while delivering a seamless user experience.

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
- **User Registration & Verification:** Secure registration using email/password and optional email verification.
- **JWT-Based Authentication:** Stateless session management using JSON Web Tokens.
- **Token Refresh & Logout:** Short-lived access tokens with refresh tokens ensure seamless sessions.
- **Password Recovery:** Secure password reset workflow via email.
- **Role-Based Access Control (RBAC):** Define and enforce permissions based on user roles.
- **Audit Logging & Monitoring:** Detailed activity logs for security audits and performance monitoring.
- **Scalability:** Designed for high-volume authentication requests.
- **Integration-Ready:** RESTful APIs that work with mobile and web clients.

---

## System Architecture
The system is structured as a microservice comprising:

- **Auth Server:** Core service (Node.js/Express) exposing authentication APIs.
- **Database:** Stores user profiles, hashed passwords, and token data (e.g., PostgreSQL, MongoDB).
- **Client Applications:** VivaFit web and mobile clients that interact with the Auth Server.
- **External Services:** Email/SMS services for verification and password reset.

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

# Technical Architecture for VivaFit

This document provides an overview of the VivaFit technical architecture following the MVC pattern. It covers both the client and server components along with the database. Each tool used is explained with key advantages.

---

## Overview

VivaFit is built using a modern, scalable architecture where:

- **Models** handle data and business rules.
- **Views** represent the user interface.
- **Controllers** mediate between models and views.

The system is divided into client and server components, connected via RESTful APIs.

---

## Visual Architecture Diagram

```mermaid
graph TD
  subgraph Server (MVC)
    A[Route: Express Router] --> B[Controller]
    B --> C[(Model: Mongoose)]
    B --> D[Firebase Admin]
    C -->|Query Data| B
    D -->|Token Verification| B
  end

  subgraph Client (React)
    E[🖥️ React Components (Pages)]
    F[⚙️ AuthContext & Custom Hooks]
    G[🔗 API Services]
    E --> F
    F --> G
    G -->|HTTP Requests| A
  end

classDef reactStyle fill:#DDF6FF,stroke:#268BD2,stroke-width:2px;
classDef serverStyle fill:#F6EAD3,stroke:#B58900,stroke-width:2px;
classDef dbStyle fill:#DFFFD6,stroke:#859900,stroke-width:2px;
class E,F,G reactStyle;
class A,B,D serverStyle;
class C dbStyle;
```

---

## Tools & Explanation

### Client (Frontend)

- **React & Vite**  
  - **React** (🖥️): JavaScript library for building dynamic UI.  
    - *Advantage:* Component-based, reusability and a vibrant ecosystem.
  - **Vite** (⚡): Fast development server and build tool.
    - *Advantage:* Lightning-fast hot module replacement (HMR) and optimized builds.

- **Tailwind CSS**  
  - Utility-first CSS framework for rapid styling.
    - *Advantage:* Highly customizable and consistent design without leaving your markup.  
  - **React Router Dom** for client-side routing.
    - *Advantage:* Seamless navigation between pages.

- **Axios (optional)**  
  - For making HTTP requests.
    - *Advantage:* Simplifies promise-based HTTP requests with additional features.

### Server (Backend)

- **Node.js & Express**  
  - **Node.js** (⚙️): JavaScript runtime for building scalable backend applications.
    - *Advantage:* Single language (JavaScript) across the entire stack.
  - **Express**: Minimal and flexible Node.js web framework.
    - *Advantage:* Fast to set up RESTful API endpoints with middleware support.

- **Firebase Admin SDK**  
  - Used for token verification and managing Firebase authentication.
    - *Advantage:* Secure and centralized user authentication management.

- **Mongoose**  
  - An ODM (Object Data Modeling) for MongoDB.
    - *Advantage:* Provides schema-based solution for application data and simplifies CRUD operations.

### Database

- **MongoDB**
  - NoSQL database to store user profiles, workout logs, and more.
    - *Advantage:* Flexible schema, scalability, and high performance for large datasets.

---

## Advantages Summary

- **Unified language:** JavaScript is used for both frontend and backend, simplifying development and maintenance.
- **Fast Iterations:**  
  - Vite and React’s HMR significantly speed up development cycles.
- **Scalable Architecture:**  
  - Using Express and MongoDB allows the system to handle a high volume of concurrent requests.
- **Robust Security:**  
  - Firebase Admin SDK combined with JWT ensures secure authentication and route protection.
- **UI Consistency & Customization:**  
  - Tailwind CSS provides a consistent, maintainable design system that can be rapidly iterated on.

---

This MVC-based architecture offers clarity in design, a clear separation of concerns, high maintainability, and scalability required to support the comprehensive features of VivaFit.