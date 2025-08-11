# SecureDocs Frontend

A modern, secure document storage and management platform built with React.

## Features

- 🔐 Secure authentication system
- 📁 File upload with drag & drop
- 🗂️ Smart folder organization
- 🔍 File search and filtering
- 📱 Responsive design
- 🐳 Docker ready

## Quick Start

### Development
```bash
npm install
npm start
```

### Docker Build
```bash
docker build -t secure-docs-frontend .
docker run -p 80:80 secure-docs-frontend
```

## Project Structure

```
src/
├── components/     # React components
├── pages/         # Page components
├── context/       # React context providers
├── hooks/         # Custom hooks
├── utils/         # Utility functions
└── styles/        # CSS files
```

## Tech Stack

- React 18
- React Router
- Tailwind CSS
- Lucide React Icons
- React Dropzone

## Environment Variables

Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_UPLOAD_URL=http://localhost:5000/upload
```

## License

MIT License
