import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardNavbar from '../dashboard/DashboardNavbar';
import { useAuth } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const ExercisesList = () => {
    const { currentUser } = useAuth();
    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMuscle, setSelectedMuscle] = useState('all');
    const [targetMuscles, setTargetMuscles] = useState([]);
    
    const [showProgramBuilder, setShowProgramBuilder] = useState(false);
    const [programName, setProgramName] = useState('');
    const [weeklyProgram, setWeeklyProgram] = useState({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    });
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [selectedExercises, setSelectedExercises] = useState({});
    const [savingProgram, setSavingProgram] = useState(false);
    const [savedPrograms, setSavedPrograms] = useState([]);
    const [showSavedPrograms, setShowSavedPrograms] = useState(false);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await axios.get("http://exercisedb-api.vercel.app/api/v1/exercises?offset=100&limit=100");
                const exerciseList = response.data.data.exercises;
                setExercises(exerciseList);
                setFilteredExercises(exerciseList);

                const muscles = [...new Set(exerciseList.flatMap(ex => ex.targetMuscles))];
                setTargetMuscles(muscles);
            } catch (err) {
                setError('Failed to fetch exercises');
                toast.error("Failed to load exercises. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, []);

    useEffect(() => {
        const fetchSavedPrograms = async () => {
            if (!currentUser) return;
            
            try {
                const response = await axios.get('http://localhost:8000/api/programs', {
                    headers: {
                        Authorization: `Bearer ${await currentUser.getIdToken()}`
                    }
                });
                setSavedPrograms(response.data);
            } catch (err) {
                toast.error("Failed to load your saved programs");
            }
        };

        if (showSavedPrograms) {
            fetchSavedPrograms();
        }
    }, [currentUser, showSavedPrograms]);

    useEffect(() => {
        if (selectedMuscle === 'all') {
            setFilteredExercises(exercises);
        } else {
            const filtered = exercises.filter(exercise =>
                exercise.targetMuscles.includes(selectedMuscle)
            );
            setFilteredExercises(filtered);
        }
    }, [selectedMuscle, exercises]);

    const toggleExerciseSelection = (exercise) => {
        setSelectedExercises(prev => {
            const newSelection = { ...prev };
            if (newSelection[exercise.exerciseId]) {
                delete newSelection[exercise.exerciseId];
            } else {
                newSelection[exercise.exerciseId] = {
                    exerciseId: exercise.exerciseId,
                    exerciseName: exercise.name,
                    sets: 3,
                    reps: 10,
                    restTime: 60,
                    gifUrl: exercise.gifUrl
                };
            }
            return newSelection;
        });
    };

    const addSelectedExercisesToDay = () => {
        const selectedExercisesArray = Object.values(selectedExercises);
        if (selectedExercisesArray.length === 0) {
            toast.warning("Please select at least one exercise");
            return;
        }

        setWeeklyProgram(prev => ({
            ...prev,
            [selectedDay]: [...prev[selectedDay], ...selectedExercisesArray]
        }));

        setSelectedExercises({});
        toast.success(`Exercises added to ${selectedDay}`);
    };

    const removeExerciseFromDay = (day, exerciseId) => {
        setWeeklyProgram(prev => ({
            ...prev,
            [day]: prev[day].filter(ex => ex.exerciseId !== exerciseId)
        }));
        toast.info(`Exercise removed from ${day}`);
    };

    const updateExerciseInDay = (day, exerciseId, field, value) => {
        setWeeklyProgram(prev => ({
            ...prev,
            [day]: prev[day].map(ex => 
                ex.exerciseId === exerciseId ? { ...ex, [field]: value } : ex
            )
        }));
    };

    const saveProgram = async () => {
        if (!programName.trim()) {
            toast.error("Please enter a program name");
            return;
        }

        const hasExercises = Object.values(weeklyProgram).some(day => day.length > 0);
        if (!hasExercises) {
            toast.error("Please add at least one exercise to your program");
            return;
        }

        try {
            setSavingProgram(true);
            
            const workouts = Object.entries(weeklyProgram)
                .filter(([_, exercises]) => exercises.length > 0)
                .map(([day, exercises]) => ({
                    dayOfWeek: day,
                    exercises: exercises
                }));

            const programData = {
                programName,
                workouts
            };

            await axios.post('http://localhost:8000/api/programs', programData, {
                headers: {
                    Authorization: `Bearer ${await currentUser.getIdToken()}`
                }
            });

            toast.success("Workout program saved successfully!");
            
            setProgramName('');
            setWeeklyProgram({
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: [],
                Saturday: [],
                Sunday: []
            });
            setShowProgramBuilder(false);
            
            if (showSavedPrograms) {
                const programsResponse = await axios.get('http://localhost:8000/api/programs', {
                    headers: {
                        Authorization: `Bearer ${await currentUser.getIdToken()}`
                    }
                });
                setSavedPrograms(programsResponse.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save program. Please try again.");
        } finally {
            setSavingProgram(false);
        }
    };

    const deleteProgram = async (programId) => {
        if (!confirm("Are you sure you want to delete this program?")) {
            return;
        }
        
        try {
            await axios.delete(`http://localhost:8000/api/programs/${programId}`, {
                headers: {
                    Authorization: `Bearer ${await currentUser.getIdToken()}`
                }
            });
            
            toast.success("Program deleted successfully");
            setSavedPrograms(prev => prev.filter(program => program._id !== programId));
        } catch (err) {
            toast.error("Failed to delete program");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <DashboardNavbar />
                <div className="container mx-auto py-8 px-4">
                    <div className="p-4 text-gray-600 flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                        <p className="ml-3">Loading exercises...</p>
                    </div>
                </div>
                <ToastContainer position="bottom-right" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100">
                <DashboardNavbar />
                <div className="container mx-auto py-8 px-4">
                    <div className="p-4 text-red-600 flex justify-center items-center h-64">
                        <p>{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="ml-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
                <ToastContainer position="bottom-right" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar />
            <div className="container mx-auto py-8 px-4">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Explore Exercises</h1>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center">
                            <label htmlFor="muscleFilter" className="mr-2 text-gray-700">Filter by muscle:</label>
                            <select
                                id="muscleFilter"
                                value={selectedMuscle}
                                onChange={(e) => setSelectedMuscle(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="all">All Muscles</option>
                                {targetMuscles.map(muscle => (
                                    <option key={muscle} value={muscle}>{muscle}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => {
                                    setShowProgramBuilder(!showProgramBuilder);
                                    setShowSavedPrograms(false);
                                }}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                            >
                                {showProgramBuilder ? "Hide Program Builder" : "Create Weekly Program"}
                            </button>
                            <button 
                                onClick={() => {
                                    setShowSavedPrograms(!showSavedPrograms);
                                    setShowProgramBuilder(false);
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            >
                                {showSavedPrograms ? "Hide My Programs" : "View My Programs"}
                            </button>
                        </div>
                    </div>
                </div>

                {showProgramBuilder && (
                    <div className="bg-gray-50 border border-gray-300 rounded-lg shadow-md p-8 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Weekly Program Builder</h2>
                        
                        <div className="mb-4">
                            <label htmlFor="programName" className="block text-sm font-medium text-gray-700 mb-1">
                                Program Name
                            </label>
                            <input
                                type="text"
                                id="programName"
                                value={programName}
                                onChange={(e) => setProgramName(e.target.value)}
                                placeholder="e.g., My Strength Program"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                        
                        <div className="mb-6">
                            <div className="flex items-center gap-4 mb-4">
                                <label htmlFor="daySelect" className="text-sm font-medium text-gray-700">
                                    Select Day:
                                </label>
                                <select
                                    id="daySelect"
                                    value={selectedDay}
                                    onChange={(e) => setSelectedDay(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    {Object.keys(weeklyProgram).map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={addSelectedExercisesToDay}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                    disabled={Object.keys(selectedExercises).length === 0}
                                >
                                    Add Selected Exercises to {selectedDay}
                                </button>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Weekly Schedule</h3>
                            <div className="border rounded-lg overflow-hidden">
                                <div className="bg-gray-100 px-4 py-2 grid grid-cols-7 gap-1 text-sm font-medium">
                                    {Object.keys(weeklyProgram).map(day => (
                                        <div key={day} className="text-center py-1">{day}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1 p-2 bg-white">
                                    {Object.entries(weeklyProgram).map(([day, exercises]) => (
                                        <div key={day} className="border rounded p-2 flex flex-col h-full">
                                            <div className="text-center text-sm font-medium text-gray-500 mb-2">
                                                {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
                                            </div>
                                            {exercises.length > 0 && (
                                                <ul className="space-y-2 flex-1 overflow-y-auto max-h-40">
                                                    {exercises.map(ex => (
                                                        <li key={ex.exerciseId} className="text-xs p-2 bg-gray-50 rounded">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="font-medium truncate">{ex.exerciseName}</span>
                                                                <button 
                                                                    onClick={() => removeExerciseFromDay(day, ex.exerciseId)}
                                                                    className="text-red-500 hover:text-red-700"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                            <div className="flex flex-col space-y-1">
                                                                <div className="flex items-center">
                                                                    <label className="mr-2">Sets:</label>
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        max="10"
                                                                        value={ex.sets}
                                                                        onChange={(e) => updateExerciseInDay(day, ex.exerciseId, 'sets', parseInt(e.target.value) || 1)}
                                                                        className="w-16 border border-gray-300 rounded px-2 py-1"
                                                                    />
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <label className="mr-2">Reps:</label>
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        max="100"
                                                                        value={ex.reps}
                                                                        onChange={(e) => updateExerciseInDay(day, ex.exerciseId, 'reps', parseInt(e.target.value) || 1)}
                                                                        className="w-16 border border-gray-300 rounded px-2 py-1"
                                                                    />
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <label className="mr-2">Rest:</label>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        max="300"
                                                                        value={ex.restTime}
                                                                        onChange={(e) => updateExerciseInDay(day, ex.exerciseId, 'restTime', parseInt(e.target.value) || 0)}
                                                                        className="w-16 border border-gray-300 rounded px-2 py-1"
                                                                    />
                                                                    <span className="ml-1 text-xs">sec</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end">
                            <button
                                onClick={saveProgram}
                                disabled={savingProgram}
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
                            >
                                {savingProgram ? 'Saving...' : 'Save Program'}
                            </button>
                        </div>
                    </div>
                )}

                {showSavedPrograms && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Workout Programs</h2>
                        
                        {savedPrograms.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600">You don't have any saved workout programs yet.</p>
                                <button
                                    onClick={() => {
                                        setShowSavedPrograms(false);
                                        setShowProgramBuilder(true);
                                    }}
                                    className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Create Your First Program
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {savedPrograms.map(program => (
                                    <div key={program._id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl font-semibold text-gray-800">{program.programName}</h3>
                                            <div className="flex items-center space-x-2">
                                                <Link 
                                                    to={`/workout/${program._id}`}
                                                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 text-sm flex items-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Start
                                                </Link>
                                                <button
                                                    onClick={() => deleteProgram(program._id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            {program.workouts.map(workout => (
                                                <div key={workout._id} className="border-t pt-2">
                                                    <h4 className="font-medium text-gray-700">{workout.dayOfWeek}</h4>
                                                    <ul className="mt-1">
                                                        {workout.exercises.map(exercise => (
                                                            <li key={exercise._id} className="text-sm text-gray-600 flex items-center justify-between py-1">
                                                                <span>{exercise.exerciseName}</span>
                                                                <span>{exercise.sets} sets × {exercise.reps} reps</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {!showSavedPrograms && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredExercises.length > 0 ? (
                            filteredExercises.map(exercise => (
                                <div key={exercise.exerciseId} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg">
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">{exercise.name}</h3>
                                            {showProgramBuilder && (
                                                <button 
                                                    onClick={() => toggleExerciseSelection(exercise)}
                                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                                >
                                                    {selectedExercises[exercise.exerciseId] ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600 mb-1">
                                            <strong>Muscles:</strong> {exercise.targetMuscles.join(', ')}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <strong>Body Parts:</strong> {exercise.bodyParts.join(', ')}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            <strong>Equipment:</strong> {exercise.equipments.join(', ')}
                                        </div>
                                        <div className="mt-3">
                                            <button 
                                                onClick={() => toggleExerciseSelection(exercise)}
                                                className={`w-full py-2 text-sm font-medium rounded-md transition-colors ${
                                                    selectedExercises[exercise.exerciseId] 
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {selectedExercises[exercise.exerciseId] ? 'Selected' : 'Select for Workout'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-600">
                                No exercises found for the selected muscle.
                            </div>
                        )}
                    </div>
                )}
            </div>
            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default ExercisesList;