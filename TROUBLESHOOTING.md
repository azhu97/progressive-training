# Troubleshooting: Server Connection Issues

## Problem: "Network error: Failed to fetch"

This error means the frontend cannot connect to the backend server.

## Solution Steps

### 1. Make sure the server is running

**From the `server` directory:**
```bash
cd server
npm run dev
```

You should see:
```
Server running on port 6000
Default login: admin / admin123
```

**OR from the root directory:**
```bash
npm run dev
```

### 2. Verify the server is accessible

Open your browser and go to:
```
http://localhost:6000/api/health
```

You should see:
```json
{"status":"ok","message":"Server is running"}
```

If you get an error or "This site can't be reached", the server is not running.

### 3. Check for server startup errors

Look at the terminal where you started the server. Common errors:

- **Database connection error**: Make sure `DATABASE_URL` is set in `server/.env`
- **Port already in use**: Another process might be using port 6000
- **Prisma client not generated**: Run `npx prisma generate` in the server directory

### 4. Verify the port matches

- **Server port**: Check `server/.env` - should be `PORT=6000`
- **Frontend API**: Check `client/src/api.js` - should be `http://localhost:6000/api`

### 5. Common fixes

**If port 6000 is in use:**
```bash
# Find what's using the port (macOS/Linux)
lsof -i :6000

# Kill the process if needed
kill -9 <PID>
```

**If Prisma client needs regeneration:**
```bash
cd server
npx prisma generate
```

**If database connection fails:**
- Check `server/.env` has `DATABASE_URL=file:./prisma/gym.db`
- Make sure `server/prisma/gym.db` exists

### 6. Start both frontend and backend

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

## Still having issues?

1. Check browser console (F12) for detailed error messages
2. Check server terminal for error logs
3. Verify both servers are running on different ports:
   - Backend: `http://localhost:6000`
   - Frontend: `http://localhost:3000` or `http://localhost:5173`
