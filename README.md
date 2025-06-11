# QuickTask (Backend)

## Overview

This repository contains the source code for the QuickTask backend server. This robust and secure RESTful API, built with Node.js, Express, and PostgreSQL, provides all the necessary services for the QuickTask task management application. It handles user authentication, data persistence, and core business logic.

The frontend client for this application is maintained in a separate repository. You can find the frontend source code [here](https://github.com/nathanEvrardDaCunha/quickTasks_front).

---

## API Features

The backend exposes a comprehensive set of endpoints to support the application's functionality, following RESTful principles.

### **Authentication & Authorization**

-   **User Endpoint (`/api/users`):** Manages user creation, retrieval, updates, and deletion.
-   **Auth Endpoint (`/api/auth`):** Handles user login, session management, and password changes.
-   **Token Service:** Generates and validates stateless JSON Web Tokens (JWT) for secure communication. An authentication middleware protects sensitive routes.
-   **Password Recovery:** Sends temporary passwords to a registered user's email address for account recovery.

### **Core Functionality**

-   **Task Endpoint (`/api/task`):** Provides full CRUD (Create, Read, Update, Delete) operations for user tasks.
-   **Contact Endpoint (`/api/contact`):** Forwards user messages from the contact form to a designated support email.

### **System & Error Handling**

-   **Error Middleware:** A centralized middleware gracefully handles both expected and unexpected application errors, ensuring standardized error responses.
-   **Data Validation:** Implements rigorous validation and sanitization on all incoming client data to prevent common vulnerabilities and ensure data integrity.

---

## System Architecture & Technology

The backend is built on a modern, robust technology stack, architected for scalability and maintainability.

| Category       | Technology / Tool                           |
| -------------- | ------------------------------------------- |
| **Core**       | JavaScript, Node.js, Express.js, TypeScript |
| **Database**   | PostgreSQL                                  |
| **Security**   | jsonwebtoken                                |
| **Tooling**    | Git, npm                                    |
| **Deployment** | Docker                                      |

The application follows a layered architecture, separating concerns into distinct modules:

-   **Routes:** Define the API endpoints.
-   **Controllers:** Handle incoming requests and outgoing responses.
-   **Services:** Contain the core business logic.
-   **Models/Data Access Layer:** Manage all interactions with the PostgreSQL database.

---

## Local Development Setup

To run this project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/nathanEvrardDaCunha/quickTasks_back.git
    cd quickTasks_back
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project. Use the `.env.example` file as a template and populate it with your local configuration.

    ```env
    # App Configuration

    NODE_ENV=production
    APP_URL=https://your-public-frontend-domain.com
    APP_PORT=5003

    # Database Configuration

    DATABASE_USER=quickTask
    DATABASE_PASSWORD=your-strong-production-password
    DATABASE_NAME=quickTask
    DATABASE_HOST=db
    DATABASE_PORT=5432

    # Security

    BCRYPT_HASHING_ROUND=12

    # Json Web Token

    ACCESS_TOKEN=GENERATE_NEW_STRONG_TOKEN_FOR_PRODUCTION
    REFRESH_TOKEN=GENERATE_NEW_STRONG_TOKEN_FOR_PRODUCTION

    # Email Configuration

    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USER=example@gmail.com
    EMAIL_PASSWORD=your-production-email-app-password
    EMAIL_FROM=example@gmail.com
    ```

    _Ensure you have a local PostgreSQL instance running and have created the `quicktask` database._

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

## Deployment on Railway

The application is configured for deployment on Railway. Follow these steps to deploy your own instance:

1.  **Provision a PostgreSQL Database:**
    Within your Railway project, add a PostgreSQL service. Railway will automatically provide a `DATABASE_URL` environment variable to your backend service.

2.  **Configure Environment Variables:**
    In your backend service's "Variables" tab on Railway, configure the following:
    -   `APP_URL`: The public URL of your deployed **frontend** application
    -   `ACCESS_TOKEN_SECRET` & `REFRESH_TOKEN_SECRET`: Generate strong, unique secrets for production. Use a secure generator for this.
    -   `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM`: Your Gmail credentials for sending emails. It is highly recommended to use a Google "App Password" for this.

---

## Project Retrospective & Key Learnings

This project was a deep dive into backend development principles. The following outlines key challenges and the engineering solutions implemented.

-   **Standardizing API Responses:**

    -   **Challenge:** Initial endpoint development resulted in inconsistent response formats for successes and errors, complicating frontend integration.
    -   **Solution:** Generic response and error-handling functions were created. All successful responses now follow a unified structure and a global error-handling middleware ensures all errors return a standardized JSON object.

-   **Migrating from JavaScript to TypeScript:**

    -   **Challenge:** The initial JavaScript codebase lacked type safety, which increased the risk of runtime errors and made the project difficult to scale and maintain.
    -   **Solution:** The entire project was methodically migrated to TypeScript. This introduced strict type checking at compile time, drastically improving code quality, developer confidence, and maintainability.

-   **Code Modularity and Refactoring:**

    -   **Challenge:** Business logic within controllers became bloated as features grew, violating the single-responsibility principle.
    -   **Solution:** Logic was refactored out of controllers and into a separate **service layer**. This architectural change decoupled the HTTP request/response cycle from the core business logic, making the code cleaner and more reusable.

-   **Implementing Middleware:**
    -   **Challenge:** Implementing critical cross-cutting concerns like authentication required a deeper understanding of the Express.js request-response cycle.
    -   **Solution:** Extensive research and iterative development led to a robust token validation middleware. This middleware intercepts and validates the JWT on protected routes, cleanly separating authentication logic from the endpoint controllers.

---

## Conclusion

Developing the QuickTask backend provided invaluable experience in designing and building a secure, scalable, and maintainable RESTful API. The project solidified my skills in Node.js, Express, and TypeScript, while also reinforcing the importance of robust architecture, such as a layered design and standardized error handling.

The migration to TypeScript and the refactoring of business logic into a service layer were particularly impactful, highlighting the long-term benefits of maintainable and type-safe code. The knowledge gained from this project establishes a solid foundation for tackling more complex backend engineering challenges in the future.
