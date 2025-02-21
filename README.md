# Full Stack TypeScript Application

A modern full-stack application built with React (TypeScript) for the frontend and Node.js/Express (TypeScript) for the backend.

## Project Structure

The project is organized into two main directories:

1. `client`: Contains the React frontend code.
2. `server`: Contains the Node.js/Express backend code.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (Make sure it's installed and running)

## Getting Started

### Backend Setup

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your_jwt_secret
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The client will start on `http://localhost:3000`

## Available Scripts

### Server

- `npm run dev`: Starts the development server with hot-reload
- `npm run build`: Builds the TypeScript code
- `npm start`: Runs the built code in production
- `npm run lint`: Runs ESLint
- `npm test`: Runs tests

### Client

- `npm start`: Starts the development server
- `npm test`: Runs tests
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Tech Stack

### Frontend
- React 19
- TypeScript
- React Router v7
- TailwindCSS
- React Query
- Axios
- Zustand (State Management)
- React Hook Form

### Backend
- Node.js
- Express
- TypeScript
- MongoDB/Mongoose
- JWT Authentication
- Winston (Logging)
- Vitest(Testing)
- Class Validator
- Helmet (Security)

## Project Structure

### Backend Structure
```bash
server/
├── src/
│   ├── controllers/    # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── config/         # Configuration files
│   ├── utils/          # Utility functions
│   ├── tests/          # Tests
│   ├── types/          # TypeScript types
│   └── index.ts        # App entry point
```

### Frontend Structure
```bash
client/
├── src/
│   ├── components/     # Reusable components
│   ├── context/        # Context providers
│   ├── pages/          # Page components
│   ├── hooks/          # Custom hooks
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   ├── store/          # State management
│   └── App.tsx         # Root component
├── public/             # Static assets
├── .env                # Environment variables
├── .gitignore          # Git ignore rules
├── package.json        # Project configuration
├── tsconfig.json       # TypeScript configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.