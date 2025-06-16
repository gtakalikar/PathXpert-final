# PathXpert React Client

This is the frontend React application for PathXpert - Your Intelligent Path Navigation Assistant.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Connecting to the Backend

This React app is configured to connect to the PathXpert backend running on port 5000. Make sure your backend server is running before starting the React app.

The proxy setting in package.json is configured to forward API requests to the backend:

```json
"proxy": "http://localhost:5000"
```

## Features

- User authentication (login/register)
- Display test users from the backend
- Responsive design

## Project Structure

- `src/` - Source files
  - `App.js` - Main application component
  - `index.js` - Entry point
  - `App.css` - Styles for the application
- `public/` - Static files

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App 