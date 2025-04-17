# Kopsify

The Kopsify vinyl recommendation service. This application connects to a custom API to provide personalized vinyl recommendations based on a user's Discogs collection, using inventory from Kops Records.

## Features

- Home page with user-friendly interface for entering Discogs username
- Recommendations page displaying personalized vinyl suggestions
- Responsive grid layout adapting from 4 columns on desktop to 1 column on mobile
- Filter and search functionality for recommendations
- Collection insights panel displaying interesting facts about your music taste
- Visual styling matching the Kops Records website aesthetic

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation (UI) # TODO: Add Intallation README for Backend

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kopsify-ui.git
cd kopsify-ui
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. The application will be available at `http://localhost:3001` (or another port if 3001 is in use).

## UI Project Structure

```
kopsify/
├── public/                # Static files and assets
├── src/
│   ├── components/        # React components
│   │   ├── layout/        # Layout components (Header, Footer)
│   │   ├── ui/            # UI components (RecordCard, FilterBar, etc.)
│   │   └── pages/         # Page components (Home, Recommendations)
│   ├── hooks/             # Custom React hooks
│   ├── styles/            # Global styles and theme
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main application component
│   └── index.js           # Application entry point
└── package.json           # Project dependencies and scripts
```

## Content Security Policy Compliance

This application has been designed to adhere to strict Content Security Policy (CSP) requirements:

1. **No External Scripts**: All JavaScript is included as part of the build process, with no external script tags.
2. **Self-Hosted Assets**: All assets (images, fonts, etc.) are served from the same origin, avoiding external dependencies.
3. **No Inline Styles or Scripts**: All styles are in separate CSS files, and no inline JavaScript is used.
4. **Relative URLs**: All URLs for API calls and assets use relative paths to ensure they work regardless of deployment environment.

The application connects to the backend API using the proxy configuration in package.json, which forwards API requests without cross-origin issues during development.

## API Integration

The frontend connects to the existing API endpoint:

```
GET /api/recommendations/:username
```

This endpoint returns personalized vinyl recommendations based on the provided Discogs username.

## License

This project is licensed under the MIT License - see the LICENSE file for details.