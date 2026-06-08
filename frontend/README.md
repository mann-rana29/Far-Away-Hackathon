# Chokho Waste Management

Chokho is an AI-powered civic waste management platform designed for Dehradun, Haridwar, and Rishikesh. It streamlines the process of reporting, assigning, and resolving civic waste issues through a unified complaint-centric architecture.

## Overview

The platform consists of three primary portals customized for different user roles:

*   **Citizen Portal:** Allows residents to report waste complaints, upload photos, and track the resolution status of their reports.
*   **Worker Portal:** Provides sanitation workers with optimized daily route maps, active complaint assignments, and the ability to verify cleanups by uploading "after" photos.
*   **Admin Portal (Command Center):** A comprehensive dashboard for administrators to monitor live severity heatmaps, manage worker assignments, optimize routes, and oversee overall civic cleanliness and vehicle operations.

## Technology Stack

The frontend is built with modern web technologies:

*   **Framework:** Next.js (App Router)
*   **Styling:** Tailwind CSS
*   **UI Components:** Custom components built with Radix UI primitives and custom CSS styling
*   **Mapping:** React-Leaflet integrated securely for live heatmaps and route tracing
*   **Icons:** Lucide React

## Getting Started

### Prerequisites

You need Node.js and a package manager installed. The project recommends using `pnpm`.

### Installation

1. Clone the repository and navigate into the `frontend` directory.
2. Install the necessary dependencies:

```bash
pnpm install
```

### Running the Development Server

Start the application by running the dev environment:

```bash
pnpm run dev
```

Open `http://localhost:3000` in your browser to view the application.

## Project Structure

*   `/src/app`: Contains the routing logic and page layouts.
    *   `/admin`: Pages related to the administrative dashboard.
    *   `/citizen`: Pages related to the resident reporting interface.
    *   `/worker`: Pages related to sanitation worker route management.
*   `/src/components`: Reusable UI elements, layout wrappers, and map components.
*   `/src/lib`: Utility functions and mock data models used for frontend prototyping.
