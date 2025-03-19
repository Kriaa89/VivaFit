import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AppNavbar from "./home/AppNavbar";
import Footer from "./home/Footer";
import { getIdToken } from "../utils/auth";

/**
 * OnboardingForm component for collecting user fitness profile data
 * This component is shown after registration to collect essential user information
 */
const OnboardingForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Initial form state with default values
    const [formData, setFormData] = useState({
        age: "",
        weight: "",
        weightUnit: "kg",
        height: "",
        heightUnit: "cm",
        fitnessLevel: "beginner",
        fitnessGoal: "general fitness"
    });

    /**
     * Handle form input changes
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Submit form data to update user profile
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
    
        try {
            // Validate fields
            validateRequiredFields(formData);
            const profileData = validateAndParseFormData(formData);
            
            // Get auth token
            const token = await getIdToken();
            if (!token) {
                throw new Error("Authentication token is missing. Please log in again.");
            }
    
            // Submit profile data
            const response = await axios.patch(
                "http://localhost:8000/api/users/profile",
                profileData,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to update profile");
            }
    
            // Navigate immediately to dashboard without delay
            navigate("/dashboard");
            
        } catch (err) {
            setError(err.message || "An error occurred. Please try again.");
            console.error("Profile update error:", err);
        } finally {
            setLoading(false);
        }
    };

    const validateRequiredFields = (data) => {
        if (!data.age || !data.weight || !data.height) {
            throw new Error("Age, weight, and height are required fields");
        }
    };

    /**
     * Validate form data and convert string values to appropriate 
     */
    const validateAndParseFormData = (data) => {
        const age = parseInt(data.age);
        const weight = parseFloat(data.weight);
        const height = parseFloat(data.height);

        if (isNaN(age) || age <= 0 || age > 120) {
            throw new Error("Please enter a valid age (between 1 and 120)");
        }
        if (isNaN(weight) || weight <= 0) {
            throw new Error("Please enter a valid weight");
        }
        if (isNaN(height) || height <= 0) {
            throw new Error("Please enter a valid height");
        }

        return {
            age,
            weight,
            weightUnit: data.weightUnit,
            height,
            heightUnit: data.heightUnit,
            fitnessLevel: data.fitnessLevel,
            fitnessGoal: data.fitnessGoal
        };
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

                    {/* Alert messages */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Metrics Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Basic Metrics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="age" className="block text-gray-700 text-sm font-medium mb-2">
                                        Age <span className="text-red-500">*</span>
                                    </label>
                                    <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} placeholder="Your age" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                                </div>

                                <div className="col-span-2">
                                    <label htmlFor="weight" className="block text-gray-700 text-sm font-medium mb-2">
                                        Weight <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex space-x-2">
                                        <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} placeholder="Your weight" className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
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
                                        <input type="number" id="height" name="height" value={formData.height} onChange={handleChange} placeholder="Your height" className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
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

                        {/* Fitness Profile Section */}
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
                                        <option value="strength">Strength</option>
                                        <option value="flexibility">Flexibility</option>
                                        <option value="general fitness">General Fitness</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
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