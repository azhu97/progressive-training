# How to Start the Application

## Prerequisites

- Node.js and npm installed
- MongoDB database (local or cloud like MongoDB Atlas)

## Setup Steps

### 1. Install Dependencies

First, install root dependencies:

```bash
npm install
```

Then install client dependencies (including recharts for charts):

```bash
cd client
npm install
cd ..
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
touch .env
```

Add the following to `server/.env`:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

**For local MongoDB:**

```
MONGO_URI=mongodb://localhost:27017/progressive-training
```

**For MongoDB Atlas:**

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/progressive-training
```

### 3. Start the Application

From the root directory, you can start both server and client simultaneously:

```bash
npm run dev
```

This will:

- Start the backend server on `http://localhost:5000`
- Start the frontend dev server on `http://localhost:5173` (or another port if 5173 is taken)

### Alternative: Start Separately

**Start the server only:**

```bash
npm run server
```

**Start the client only:**

```bash
npm run client
```

## Access the Application

Once running, open your browser and navigate to:

- **Frontend:** http://localhost:5173 (or the port shown in terminal)
- **Backend API:** http://localhost:5000

## First Steps

1. Register a new account or login
2. Log some workouts using the form on the dashboard
3. View your progress charts for each exercise!
