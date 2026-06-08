# Chokho AI Backend

The Chokho AI Backend is a robust Spring Boot application designed to handle the core operations of the Chokho Waste Management platform. It provides RESTful APIs to manage users, track geographic areas, report and verify waste complaints, coordinate waste collection routes, and manage vehicle assignments.

## Architecture & Technology Stack

The project relies on a standard Java-based enterprise stack tailored for spatial data processing and secure media handling.

*   **Language:** Java 17
*   **Framework:** Spring Boot (WebMVC, Data JPA, Security)
*   **Database:** PostgreSQL with PostGIS extension for spatial data operations.
*   **ORM:** Hibernate with Hibernate Spatial (`hibernate-spatial`) for handling geometric and geographic data types.
*   **Security:** Spring Security with JSON Web Tokens (JJWT) for stateless, role-based authentication.
*   **Media Management:** Cloudinary SDK for robust image upload and storage.
*   **Metadata Processing:** Metadata-Extractor for parsing image EXIF data (used in image-based verification workflows).
*   **Utilities:** Lombok for boilerplate reduction in models and DTOs.
*   **Build Tool:** Maven

## Core Modules & Features

The application is modularized into several core domains, driven by entities and domain-driven design principles:

*   **User Management & Security:** Handles authentication, authorization, and role management (e.g., Citizens, Workers, Admins). It secures endpoints using JWT filters.
*   **Complaint System:** The central workflow of the application. Citizens can report waste complaints with image uploads, while workers are assigned to resolve them.
*   **Geospatial Tracking:** Uses `GeoLocation` and `Area` models to map complaints, define regional boundaries, and optimize worker operations.
*   **Verification Engine:** Associates uploaded media (before and after cleanup images) with complaints. It extracts and validates metadata to ensure the authenticity of the cleanup geographically.
*   **Logistics & Routing:** Manages `Vehicle` assignments and sequences `Route` operations for optimized waste retrieval based on active complaints.

## Project Structure

The codebase follows a standard multi-layer Spring Boot structure:

*   `/configs` - System configurations, including CORS settings, Bean definitions, and Cloudinary setup.
*   `/controllers` - REST API endpoints handling incoming HTTP requests and responses.
*   `/dto` - Data Transfer Objects for validating incoming request payloads and formatting API responses.
*   `/enums` - Fixed constants representing roles, complaint statuses, and vehicle states.
*   `/models` - JPA Entities mapping to the PostgreSQL database tables.
*   `/repositories` - Spring Data JPA interfaces for database interactions and custom spatial queries.
*   `/security` - JWT utilities, security filter chains, and custom user detail services.
*   `/services` - Core business logic, acting as the intermediary between controllers and repositories.

## Configuration Requirements

To run the application, you need to configure the following environment properties (typically inside `application.properties` or `application.yml`):

1.  **Database Connection:**
    *   PostgreSQL URL (e.g., `jdbc:postgresql://localhost:5432/chokho_db`)
    *   Database Username and Password
    *   Hibernate dialect configured to support PostGIS.

2.  **JWT Authentication:**
    *   A secure cryptographic secret for signing JSON Web Tokens.
    *   Token expiration configurations.

3.  **Cloudinary Provider:**
    *   `cloud_name`, `api_key`, and `api_secret` provided by your Cloudinary dashboard for image processing.

## Running Locally

1. Ensure PostgreSQL and PostGIS are installed and running locally with the requisite database created.
2. Clone the repository and navigate to the backend directory.
3. Use the Maven wrapper to build and start the application:

```bash
./mvnw clean install
./mvnw spring-boot:run
```

The application will typically start on port 8080 or your configured server port.
