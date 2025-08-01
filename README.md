# Gym Workout Logger

A complete web application for tracking gym workouts with a beautiful, modern interface. Built with React.js, Node.js, and SQLite.

## Features

- **User Authentication**: Secure login system with JWT tokens
- **Workout Management**: Create, view, and delete workouts
- **Exercise Tracking**: Add exercises with sets, reps, weight, and rest time
- **Statistics Dashboard**: View workout statistics and progress
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Modern UI**: Beautiful interface with smooth animations

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT tokens
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project files**

2. **Install dependencies**

   ```bash
   npm install
   cd client && npm install
   ```

3. **Set up the database**

   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Default Login

- **Username**: `admin`
- **Password**: `admin123`

## Project Structure

```
gym/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Configuration files
│   │   └── prisma.js      # Prisma database service
│   ├── controllers/       # Business logic controllers
│   │   ├── AuthController.js
│   │   ├── WorkoutController.js
│   │   └── ExerciseController.js
│   ├── models/            # Data models
│   │   ├── User.js
│   │   ├── Workout.js
│   │   └── Exercise.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── workouts.js
│   │   └── exercises.js
│   └── index.js           # Express server
├── prisma/                # Prisma ORM
│   └── schema.prisma      # Database schema
├── package.json           # Root package.json
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/login` - User login

### Workouts

- `GET /api/workouts` - Get all workouts for user
- `POST /api/workouts` - Create new workout
- `GET /api/workouts/:id` - Get specific workout with exercises
- `DELETE /api/workouts/:id` - Delete workout

### Exercises

- `POST /api/workouts/:id/exercises` - Add exercise to workout
- `DELETE /api/exercises/:id` - Delete exercise

### Statistics

- `GET /api/stats` - Get workout statistics

## Features in Detail

### Dashboard

- View workout statistics (total workouts, exercises, reps, last workout)
- Create new workouts
- View all workouts with exercise counts and dates
- Delete workouts

### Workout Detail

- View individual workout information
- Add exercises with detailed information:
  - Exercise name
  - Sets and reps
  - Weight (optional)
  - Rest time
  - Notes
- Delete exercises
- View workout statistics (total volume, sets, etc.)

### User Interface

- Modern, responsive design
- Smooth animations and transitions
- Intuitive navigation
- Mobile-friendly interface
- Loading states and error handling

## Database Schema

### Users

- `id` (Primary Key)
- `username` (Unique)
- `password` (Hashed)
- `created_at`

### Workouts

- `id` (Primary Key)
- `user_id` (Foreign Key)
- `name`
- `date`
- `notes`

### Exercises

- `id` (Primary Key)
- `workout_id` (Foreign Key)
- `name`
- `sets`
- `reps`
- `weight`
- `rest_time`
- `notes`

## Development

### Running in Development Mode

```bash
npm run dev
```

This starts the backend server (port 6060) with hot reloading.

### Database Management

```bash
# Open Prisma Studio (database GUI)
npm run prisma:studio

# Generate Prisma client
npm run prisma:generate

# Push schema changes to database
npm run prisma:push

# Create and apply migrations
npm run prisma:migrate
```

### Running Backend Only

```bash
npm run server
```

### Running Frontend Only

```bash
npm run client
```

### Building for Production

```bash
npm run build
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- SQL injection protection
- CORS configuration
- Input validation

## Customization

### Adding New Exercise Types

You can easily add predefined exercise types by modifying the exercise form in `WorkoutDetail.js`.

### Styling

The application uses Tailwind CSS. You can customize the design by modifying:

- `client/src/index.css` - Global styles
- `client/src/App.css` - Component-specific styles
- `client/tailwind.config.js` - Tailwind configuration

### Database

The application uses SQLite with Prisma ORM for type safety and better database management. For production, you can easily switch to PostgreSQL or MySQL by updating the `DATABASE_URL` in the `.env` file and changing the provider in `prisma/schema.prisma`.

## Troubleshooting

### Common Issues

1. **Port already in use**

   - Change the port in `server/index.js` (line 8)
   - Update the proxy in `client/package.json`

2. **Database errors**

   - Delete the `gym.db` file and restart the server
   - The database will be recreated automatically

3. **CORS errors**
   - Ensure the backend is running on port 5000
   - Check the proxy configuration in `client/package.json`

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Feel free to submit issues and enhancement requests!
