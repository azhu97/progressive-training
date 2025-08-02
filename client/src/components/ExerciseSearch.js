import React, { useState, useEffect, useRef } from "react";
import { Search, X, ChevronDown } from "lucide-react";

const ExerciseSearch = ({
  onSelect,
  placeholder = "Search exercises...",
  value = "",
}) => {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Update query when value prop changes (for controlled input)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Common gym exercises database
  const exerciseDatabase = [
    // Chest Exercises
    { name: "Bench Press", category: "Chest", muscle: "Pectoralis Major" },
    {
      name: "Incline Bench Press",
      category: "Chest",
      muscle: "Pectoralis Major",
    },
    {
      name: "Decline Bench Press",
      category: "Chest",
      muscle: "Pectoralis Major",
    },
    { name: "Dumbbell Press", category: "Chest", muscle: "Pectoralis Major" },
    {
      name: "Incline Dumbbell Press",
      category: "Chest",
      muscle: "Pectoralis Major",
    },
    {
      name: "Decline Dumbbell Press",
      category: "Chest",
      muscle: "Pectoralis Major",
    },
    { name: "Push-Ups", category: "Chest", muscle: "Pectoralis Major" },
    { name: "Dips", category: "Chest", muscle: "Pectoralis Major" },
    { name: "Chest Flyes", category: "Chest", muscle: "Pectoralis Major" },
    {
      name: "Incline Chest Flyes",
      category: "Chest",
      muscle: "Pectoralis Major",
    },
    {
      name: "Decline Chest Flyes",
      category: "Chest",
      muscle: "Pectoralis Major",
    },
    { name: "Cable Crossovers", category: "Chest", muscle: "Pectoralis Major" },
    {
      name: "Machine Chest Press",
      category: "Chest",
      muscle: "Pectoralis Major",
    },

    // Back Exercises
    { name: "Pull-Ups", category: "Back", muscle: "Latissimus Dorsi" },
    { name: "Chin-Ups", category: "Back", muscle: "Latissimus Dorsi" },
    { name: "Lat Pulldown", category: "Back", muscle: "Latissimus Dorsi" },
    { name: "Barbell Rows", category: "Back", muscle: "Latissimus Dorsi" },
    { name: "Dumbbell Rows", category: "Back", muscle: "Latissimus Dorsi" },
    { name: "T-Bar Rows", category: "Back", muscle: "Latissimus Dorsi" },
    { name: "Cable Rows", category: "Back", muscle: "Latissimus Dorsi" },
    { name: "Seated Cable Rows", category: "Back", muscle: "Latissimus Dorsi" },
    { name: "Deadlift", category: "Back", muscle: "Erector Spinae" },
    { name: "Romanian Deadlift", category: "Back", muscle: "Erector Spinae" },
    { name: "Good Mornings", category: "Back", muscle: "Erector Spinae" },
    { name: "Face Pulls", category: "Back", muscle: "Rear Deltoids" },
    { name: "Reverse Flyes", category: "Back", muscle: "Rear Deltoids" },

    // Shoulder Exercises
    { name: "Military Press", category: "Shoulders", muscle: "Deltoids" },
    { name: "Overhead Press", category: "Shoulders", muscle: "Deltoids" },
    {
      name: "Dumbbell Shoulder Press",
      category: "Shoulders",
      muscle: "Deltoids",
    },
    { name: "Arnold Press", category: "Shoulders", muscle: "Deltoids" },
    { name: "Lateral Raises", category: "Shoulders", muscle: "Deltoids" },
    { name: "Front Raises", category: "Shoulders", muscle: "Deltoids" },
    { name: "Rear Delt Flyes", category: "Shoulders", muscle: "Deltoids" },
    { name: "Upright Rows", category: "Shoulders", muscle: "Deltoids" },
    { name: "Shrugs", category: "Shoulders", muscle: "Trapezius" },
    { name: "Face Pulls", category: "Shoulders", muscle: "Rear Deltoids" },

    // Bicep Exercises
    { name: "Barbell Curls", category: "Arms", muscle: "Biceps" },
    { name: "Dumbbell Curls", category: "Arms", muscle: "Biceps" },
    { name: "Hammer Curls", category: "Arms", muscle: "Biceps" },
    { name: "Preacher Curls", category: "Arms", muscle: "Biceps" },
    { name: "Concentration Curls", category: "Arms", muscle: "Biceps" },
    { name: "Cable Curls", category: "Arms", muscle: "Biceps" },
    { name: "Incline Curls", category: "Arms", muscle: "Biceps" },
    { name: "Spider Curls", category: "Arms", muscle: "Biceps" },
    { name: "21s", category: "Arms", muscle: "Biceps" },

    // Tricep Exercises
    { name: "Close-Grip Bench Press", category: "Arms", muscle: "Triceps" },
    { name: "Tricep Dips", category: "Arms", muscle: "Triceps" },
    { name: "Skull Crushers", category: "Arms", muscle: "Triceps" },
    { name: "Tricep Pushdowns", category: "Arms", muscle: "Triceps" },
    { name: "Overhead Tricep Extensions", category: "Arms", muscle: "Triceps" },
    { name: "Diamond Push-Ups", category: "Arms", muscle: "Triceps" },
    { name: "Rope Pushdowns", category: "Arms", muscle: "Triceps" },
    { name: "Dumbbell Kickbacks", category: "Arms", muscle: "Triceps" },

    // Leg Exercises
    { name: "Squats", category: "Legs", muscle: "Quadriceps" },
    { name: "Front Squats", category: "Legs", muscle: "Quadriceps" },
    { name: "Back Squats", category: "Legs", muscle: "Quadriceps" },
    { name: "Leg Press", category: "Legs", muscle: "Quadriceps" },
    { name: "Leg Extensions", category: "Legs", muscle: "Quadriceps" },
    { name: "Leg Curls", category: "Legs", muscle: "Hamstrings" },
    { name: "Romanian Deadlift", category: "Legs", muscle: "Hamstrings" },
    { name: "Stiff-Legged Deadlift", category: "Legs", muscle: "Hamstrings" },
    { name: "Lunges", category: "Legs", muscle: "Quadriceps" },
    { name: "Walking Lunges", category: "Legs", muscle: "Quadriceps" },
    { name: "Bulgarian Split Squats", category: "Legs", muscle: "Quadriceps" },
    { name: "Step-Ups", category: "Legs", muscle: "Quadriceps" },
    { name: "Calf Raises", category: "Legs", muscle: "Calves" },
    { name: "Seated Calf Raises", category: "Legs", muscle: "Calves" },
    { name: "Hip Thrusts", category: "Legs", muscle: "Glutes" },
    { name: "Glute Bridges", category: "Legs", muscle: "Glutes" },
    { name: "Donkey Kicks", category: "Legs", muscle: "Glutes" },

    // Core Exercises
    { name: "Planks", category: "Core", muscle: "Abdominals" },
    { name: "Side Planks", category: "Core", muscle: "Obliques" },
    { name: "Crunches", category: "Core", muscle: "Abdominals" },
    { name: "Sit-Ups", category: "Core", muscle: "Abdominals" },
    { name: "Russian Twists", category: "Core", muscle: "Obliques" },
    { name: "Mountain Climbers", category: "Core", muscle: "Abdominals" },
    { name: "Leg Raises", category: "Core", muscle: "Abdominals" },
    { name: "Hanging Leg Raises", category: "Core", muscle: "Abdominals" },
    { name: "Ab Wheel Rollouts", category: "Core", muscle: "Abdominals" },
    { name: "Dead Bug", category: "Core", muscle: "Abdominals" },
    { name: "Bird Dog", category: "Core", muscle: "Abdominals" },

    // Cardio
    { name: "Running", category: "Cardio", muscle: "Full Body" },
    { name: "Cycling", category: "Cardio", muscle: "Full Body" },
    { name: "Rowing", category: "Cardio", muscle: "Full Body" },
    { name: "Elliptical", category: "Cardio", muscle: "Full Body" },
    { name: "Jump Rope", category: "Cardio", muscle: "Full Body" },
    { name: "Burpees", category: "Cardio", muscle: "Full Body" },
    { name: "Mountain Climbers", category: "Cardio", muscle: "Full Body" },
    { name: "High Knees", category: "Cardio", muscle: "Full Body" },
    { name: "Jumping Jacks", category: "Cardio", muscle: "Full Body" },
  ];

  useEffect(() => {
    if (query.length > 0) {
      const filtered = exerciseDatabase.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(query.toLowerCase()) ||
          exercise.category.toLowerCase().includes(query.toLowerCase()) ||
          exercise.muscle.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredExercises(filtered.slice(0, 10)); // Limit to 10 results
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      // Show all exercises when query is empty and input is focused
      setFilteredExercises(exerciseDatabase.slice(0, 20)); // Show first 20 exercises
      setSelectedIndex(-1);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking inside the dropdown
      if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
        return;
      }
      setIsOpen(false);
      setIsFocused(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredExercises.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && filteredExercises[selectedIndex]) {
        handleSelect(filteredExercises[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (exercise) => {
    setQuery(exercise.name);
    setIsOpen(false);
    setIsFocused(false);
    setSelectedIndex(-1);
    onSelect(exercise.name);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    onSelect("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onBlur={() => {
            // Don't immediately close on blur to allow clicking on dropdown items
            // The click outside handler will handle closing
          }}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {isOpen && isFocused && filteredExercises.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {query.length === 0 && (
            <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-b border-gray-200">
              Popular Exercises
            </div>
          )}
          {filteredExercises.map((exercise, index) => (
            <div
              key={`${exercise.name}-${index}`}
              onClick={() => handleSelect(exercise)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                index === selectedIndex ? "bg-blue-50" : ""
              }`}
            >
              <div className="font-medium text-gray-900">{exercise.name}</div>
              <div className="text-sm text-gray-500">
                {exercise.category} • {exercise.muscle}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen &&
        isFocused &&
        query.length > 0 &&
        filteredExercises.length === 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="px-4 py-2 text-gray-500">
              No exercises found. Try a different search term.
            </div>
          </div>
        )}
    </div>
  );
};

export default ExerciseSearch;
