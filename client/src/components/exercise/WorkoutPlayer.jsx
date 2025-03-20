import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import DashboardNavbar from '../dashboard/DashboardNavbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WorkoutPlayer = () => {
    const { programId } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Workout state
    const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [completedExercises, setCompletedExercises] = useState([]);
    const timerRef = useRef(null);
    
    // Fetch program data
    useEffect(() => {
        const fetchProgram = async () => {
            if (!currentUser) return;
            
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8000/api/programs/${programId}`, {
                    headers: {
                        Authorization: `Bearer ${await currentUser.getIdToken()}`
                    }
                });
                
                if (response.data) {
                    // Sort workouts to ensure they're in a consistent order
                    const workouts = [...response.data.workouts].sort((a, b) => {
                        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                        return days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek);
                    });
                    
                    setProgram({...response.data, workouts});
                }
            } catch (err) {
                console.error('Error fetching program:', err);
                setError('Failed to load workout program. Please try again.');
                toast.error("Couldn't load workout program");
            } finally {
                setLoading(false);
            }
        };
        
        fetchProgram();
    }, [currentUser, programId]);
    
    // Handle timer
    useEffect(() => {
        if (isPlaying && !isPaused && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timerRef.current);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else if (timeLeft === 0 && isPlaying && !isPaused) {
            handleExerciseComplete();
        }
        
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, isPaused, timeLeft]);
    
    const getCurrentExercise = () => {
        if (!program || !program.workouts || program.workouts.length === 0) return null;
        if (currentWorkoutIndex >= program.workouts.length) return null;
        
        const currentWorkout = program.workouts[currentWorkoutIndex];
        if (!currentWorkout.exercises || currentWorkout.exercises.length === 0) return null;
        if (currentExerciseIndex >= currentWorkout.exercises.length) return null;
        
        return currentWorkout.exercises[currentExerciseIndex];
    };
    
    const startWorkout = () => {
        const exercise = getCurrentExercise();
        if (!exercise) return;
        
        setIsPlaying(true);
        setIsPaused(false);
        // Convert rest time to seconds for countdown
        setTimeLeft(exercise.restTime || 60);
        toast.info(`Starting: ${exercise.exerciseName}`);
    };
    
    const pauseWorkout = () => {
        setIsPaused(true);
        clearInterval(timerRef.current);
    };
    
    const resumeWorkout = () => {
        setIsPaused(false);
    };
    
    const skipRest = () => {
        setTimeLeft(0);
        clearInterval(timerRef.current);
        handleExerciseComplete();
    };
    
    const handleExerciseComplete = () => {
        const exercise = getCurrentExercise();
        if (!exercise) return;
        
        // Add to completed exercises
        setCompletedExercises(prev => [...prev, exercise.exerciseId]);
        
        // Move to next exercise or workout
        const currentWorkout = program.workouts[currentWorkoutIndex];
        
        if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
            // Move to next exercise in current workout
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            const nextExercise = currentWorkout.exercises[currentExerciseIndex + 1];
            setTimeLeft(nextExercise.restTime || 60);
            toast.success(`Exercise completed! Next: ${nextExercise.exerciseName}`);
        } else if (currentWorkoutIndex < program.workouts.length - 1) {
            // Move to next workout
            setCurrentWorkoutIndex(currentWorkoutIndex + 1);
            setCurrentExerciseIndex(0);
            const nextWorkout = program.workouts[currentWorkoutIndex + 1];
            const nextExercise = nextWorkout.exercises[0];
            setTimeLeft(nextExercise.restTime || 60);
            toast.success(`Workout completed! Starting ${nextWorkout.dayOfWeek}`);
        } else {
            // All workouts complete
            setIsPlaying(false);
            toast.success("Congratulations! You've completed the entire program!");
        }
    };
    
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    const getProgressPercentage = () => {
        if (!program || !program.workouts) return 0;
        
        // Calculate total exercises
        const totalExercises = program.workouts.reduce((total, workout) => 
            total + workout.exercises.length, 0);
        
        // Calculate completed percentage
        let completedCount = completedExercises.length;
        
        // Add all exercises before current workout
        for (let i = 0; i < currentWorkoutIndex; i++) {
            completedCount += program.workouts[i].exercises.length;
        }
        
        // Add exercises in current workout up to current exercise
        completedCount += currentExerciseIndex;
        
        return Math.round((completedCount / totalExercises) * 100);
    };
    
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <DashboardNavbar />
                <div className="container mx-auto py-8 px-4">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        <p className="ml-3 text-gray-600">Loading workout...</p>
                    </div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-gray-100">
                <DashboardNavbar />
                <div className="container mx-auto py-8 px-4">
                    <div className="p-4 text-red-600 flex flex-col justify-center items-center h-64">
                        <p>{error}</p>
                        <button 
                            onClick={() => navigate('/exercises')} 
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            Back to Exercises
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!program) {
        return (
            <div className="min-h-screen bg-gray-100">
                <DashboardNavbar />
                <div className="container mx-auto py-8 px-4">
                    <div className="p-4 text-gray-600 flex flex-col justify-center items-center h-64">
                        <p>No workout program found.</p>
                        <button 
                            onClick={() => navigate('/exercises')} 
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            Back to Exercises
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    const exercise = getCurrentExercise();
    
    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar />
            <div className="container mx-auto py-8 px-4">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">{program.programName}</h1>
                    <button 
                        onClick={() => navigate('/exercises')} 
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Exit Workout
                    </button>
                </div>
                
                {/* Progress bar */}
                <div className="bg-gray-200 h-4 rounded-full mb-8 overflow-hidden">
                    <div 
                        className="bg-green-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                </div>
                
                {/* Current workout & exercise */}
                {program.workouts.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <div className="mb-4">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                                {program.workouts[currentWorkoutIndex]?.dayOfWeek}
                            </span>
                        </div>
                        
                        {exercise ? (
                            <>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="md:w-1/3">
                                        <img 
                                            src={exercise.gifUrl} 
                                            alt={exercise.exerciseName} 
                                            className="w-full rounded-lg"
                                        />
                                    </div>
                                    
                                    <div className="md:w-2/3">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{exercise.exerciseName}</h2>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                            <div className="bg-gray-100 p-3 rounded-lg text-center">
                                                <p className="text-sm text-gray-500">Sets</p>
                                                <p className="text-xl font-bold text-gray-800">{exercise.sets}</p>
                                            </div>
                                            <div className="bg-gray-100 p-3 rounded-lg text-center">
                                                <p className="text-sm text-gray-500">Reps</p>
                                                <p className="text-xl font-bold text-gray-800">{exercise.reps}</p>
                                            </div>
                                            <div className="bg-gray-100 p-3 rounded-lg text-center">
                                                <p className="text-sm text-gray-500">Rest</p>
                                                <p className="text-xl font-bold text-gray-800">{exercise.restTime || 60}s</p>
                                            </div>
                                        </div>
                                        
                                        {isPlaying ? (
                                            <div className="mb-6 text-center">
                                                {timeLeft > 0 ? (
                                                    <>
                                                        <p className="text-lg text-gray-600 mb-2">Rest Timer</p>
                                                        <div className="text-5xl font-bold mb-4 text-blue-600">{formatTime(timeLeft)}</div>
                                                        
                                                        <div className="flex justify-center gap-4">
                                                            {isPaused ? (
                                                                <button 
                                                                    onClick={resumeWorkout} 
                                                                    className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                                                >
                                                                    Resume
                                                                </button>
                                                            ) : (
                                                                <button 
                                                                    onClick={pauseWorkout} 
                                                                    className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                                                >
                                                                    Pause
                                                                </button>
                                                            )}
                                                            
                                                            <button 
                                                                onClick={skipRest} 
                                                                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                                            >
                                                                Skip Rest
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-center">
                                                        <p className="text-lg text-gray-600 mb-2">Complete the exercise:</p>
                                                        <p className="text-xl font-bold mb-4">{exercise.sets} sets × {exercise.reps} reps</p>
                                                        
                                                        <button 
                                                            onClick={handleExerciseComplete} 
                                                            className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 font-bold"
                                                        >
                                                            Mark Complete & Continue
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center mt-8">
                                                <p className="text-lg text-gray-600 mb-4">Ready to start this exercise?</p>
                                                <button 
                                                    onClick={startWorkout} 
                                                    className="px-8 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 font-bold text-lg"
                                                >
                                                    Start Exercise
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Exercise list */}
                                <div className="mt-8 border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Workout Plan</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Exercise</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Sets</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Reps</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Rest</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {program.workouts[currentWorkoutIndex].exercises.map((ex, idx) => (
                                                    <tr 
                                                        key={ex.exerciseId + idx} 
                                                        className={`border-b ${idx === currentExerciseIndex ? 'bg-green-50' : ''}`}
                                                    >
                                                        <td className="px-4 py-3">
                                                            {completedExercises.includes(ex.exerciseId) ? (
                                                                <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 rounded-full">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                </span>
                                                            ) : idx === currentExerciseIndex ? (
                                                                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                                    </svg>
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-400 rounded-full">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                                    </svg>
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 font-medium">{ex.exerciseName}</td>
                                                        <td className="px-4 py-3">{ex.sets}</td>
                                                        <td className="px-4 py-3">{ex.reps}</td>
                                                        <td className="px-4 py-3">{ex.restTime || 60}s</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-lg text-gray-600">No exercises found in this workout.</p>
                                <button 
                                    onClick={() => navigate('/exercises')} 
                                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                >
                                    Back to Exercises
                                </button>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Completed message */}
                {getProgressPercentage() === 100 && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">
                                    Congratulations! You've completed this workout program.
                                </p>
                                <div className="mt-4">
                                    <button
                                        onClick={() => navigate('/exercises')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                                    >
                                        Return to Exercises
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default WorkoutPlayer;