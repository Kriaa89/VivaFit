import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  
import AppNavbar from "./home/AppNavbar";  // Fixed import path
import Footer from "./home/Footer";  // Fixed import path
import { getIdToken } from "../utils/auth";  // Fixed import path

const OnboardingForm = () => {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        age: "",
        weight: "",
        weightUnit: "kg",
        height: "",
        heightUnit: "cm",
        fitnessLevel: "beginner",
        fitnessGoal: "general fitness",
        workoutPreferences: "",
        dietaryRestrictions: "",
        preferredWorkoutTimes: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!formData.age || !formData.weight || !formData.height) {
            setError("Age, weight, and height are required.");
            setLoading(false);
            return;
        }

        const age = parseInt(formData.age);
        if (isNaN(age) || age < 13 || age > 70) {
            setError("Please enter a valid age between 13 and 70.");
            setLoading(false);
            return;
        }

        const weight = parseFloat(formData.weight);
        if (isNaN(weight) || weight <= 0) {
            setError("Please enter a valid weight.");
            setLoading(false);
            return;
        }

        const height = parseFloat(formData.height);
        if (isNaN(height) || height <= 0) {
            setError("Please enter a valid height.");
            setLoading(false);
            return;
        }

        try {
            const token = await getIdToken();
            const profileData = {
                age: formData.age,
                weight: formData.weight,
                weightUnit: formData.weightUnit,
                height: formData.height,
                heightUnit: formData.heightUnit,
                fitnessLevel: formData.fitnessLevel,
                fitnessGoal: formData.fitnessGoal,
                workoutPreferences: formData.workoutPreferences,
                dietaryRestrictions: formData.dietaryRestrictions,
                preferredWorkoutTimes: formData.preferredWorkoutTimes
            };
            await axios.patch("http://localhost:5000/api/user/profile", profileData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess("Profile updated successfully!");
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "An error occurred while updating your profile. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AppNavbar />
            <main className="flex-grow pt-16 bg-gray-100">
                <div className="max-w-3xl mx-auto mt-8 mb-10 bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Complete Your Profile</h2>
                    <p className="text-gray-600 text-center mb-8">
                        Welcome to VivaFit! To create your personalized fitness experience, please provide a few details about yourself.
                    </p>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            Profile updated successfully! Redirecting to your dashboard...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Basic Metrics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="age" className="block text-gray-700 text-sm font-medium mb-2">
                                        Age <span className="text-red-500">*</span>
                                    </label>
                                    <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} min="13" max="70" placeholder="Your age" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                                </div>

                                <div className="col-span-2">
                                    <label htmlFor="weight" className="block text-gray-700 text-sm font-medium mb-2">
                                        Weight <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex space-x-2">
                                        <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} step="0.1" min="0.1" placeholder="Your weight" required className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                                        <select name="weightUnit" value={formData.weightUnit} onChange={handleChange} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                            <option value="kg">kg</option>
                                            <option value="lb">lb</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-span-3">
                                    <label htmlFor="height" className="block text-gray-700 text-sm font-medium mb-2">
                                        Height <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex space-x-2">
                                        <input type="number" id="height" name="height" value={formData.height} onChange={handleChange} step="0.1" min="1" placeholder="Your height" required className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                                        <select name="heightUnit" value={formData.heightUnit} onChange={handleChange} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                            <option value="cm">cm</option>
                                            <option value="m">m</option>
                                            <option value="ft">ft</option>
                                            <option value="in">in</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Fitness Profile</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="fitnessLevel" className="block text-gray-700 text-sm font-medium mb-2">Your Current Fitness Level</label>
                                    <select id="fitnessLevel" name="fitnessLevel" value={formData.fitnessLevel} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                        <option value="beginner">Beginner - Just starting out</option>
                                        <option value="intermediate">Intermediate - Some experience</option>
                                        <option value="advanced">Advanced - Very experienced</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="fitnessGoal" className="block text-gray-700 text-sm font-medium mb-2">Primary Fitness Goal</label>
                                    <select id="fitnessGoal" name="fitnessGoal" value={formData.fitnessGoal} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                        <option value="weight loss">Weight Loss</option>
                                        <option value="muscle gain">Muscle Gain</option>
                                        <option value="endurance">Endurance</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="flexibility">Flexibility</option>
                                        <option value="general fitness">General Fitness</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Your Preferences</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="workoutPreferences" className="block text-gray-700 text-sm font-medium mb-2">Workout Preferences</label>
                                    <textarea id="workoutPreferences" name="workoutPreferences" value={formData.workoutPreferences} onChange={handleChange} rows="2" placeholder="E.g., Outdoor running, strength training, yoga, home workouts" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
                                </div>

                                <div>
                                    <label htmlFor="dietaryRestrictions" className="block text-gray-700 text-sm font-medium mb-2">Dietary Restrictions</label>
                                    <textarea id="dietaryRestrictions" name="dietaryRestrictions" value={formData.dietaryRestrictions} onChange={handleChange} rows="2" placeholder="E.g., Vegetarian, gluten-free, dairy-free, allergies" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
                                </div>

                                <div>
                                    <label htmlFor="preferredWorkoutTimes" className="block text-gray-700 text-sm font-medium mb-2">Preferred Workout Times</label>
                                    <input type="text" id="preferredWorkoutTimes" name="preferredWorkoutTimes" value={formData.preferredWorkoutTimes} onChange={handleChange} placeholder="E.g., Mornings, weekends, after work" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" disabled={loading} className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-md transition duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                {loading ? 'Saving...' : 'Complete Profile'}
                            </button>
                            <p className="text-sm text-gray-500 mt-2 text-center">
                                Required fields <span className="text-red-500">*</span>
                            </p>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default OnboardingForm;
