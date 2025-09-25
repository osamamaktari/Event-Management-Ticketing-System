# Event Ticketing Frontend Documentation

## Overview

The **Event Ticketing Frontend** is a modern, responsive, and interactive application built using **Vue 3** with **Composition API**, **Tailwind CSS**, and **Axios** for API communication.  
It communicates with a **Laravel backend** that handles authentication, ticket management, PDF generation, and QR codes.

The application supports:

- Browsing events
- Viewing event details
- Booking tickets
- Managing ticket types (for organizers)
- Downloading tickets as PDF
- QR code generation for tickets
- Validating tickets

> ⚠️ Note: This frontend is decoupled from the backend, meaning the backend serves only the API and PDF files. The frontend handles all rendering and UI.

---

## Table of Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Environment Variables](#environment-variables)
4. [Project Structure](#project-structure)
5. [Routing](#routing)
6. [Services (API)](#services-api)
7. [Components](#components)
8. [Pages](#pages)
9. [Notifications System](#notifications-system)
10. [PDF Download & QR Code](#pdf-download--qr-code)
11. [Styling](#styling)
12. [Development Workflow](#development-workflow)
13. [Contributing](#contributing)
14. [License](#license)

---

## Requirements

- Node.js >= 18
- npm >= 9 or yarn >= 3
- Access to backend Laravel API
- Optional: VS Code with Vue tooling

---

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd frontend

# Install dependencies
npm install
# or
yarn install

# Run development server
npm run dev
# or
yarn dev
```
