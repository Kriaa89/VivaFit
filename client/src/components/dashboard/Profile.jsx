import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getIdToken } from "../../utils/auth";
import Footer from "../home/Footer";
import DashboardNavbar from "./DashboardNavbar";

/**
 * Profile component for viewing and editing user profile information
 */
const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    
    // Profile form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
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

    // Load user profile data
    useEffect(() => {
        async function fetchUserProfile() {
            try {
                setLoading(true);
                const token = await getIdToken();
                
                if (!token) {
                    throw new Error("No authentication token available");
                }
                
                const response = await fetch("http://localhost:8000/api/users/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error("Failed to fetch profile data");
                }
                
                const profileData = await response.json();
                
                if (profileData.success && profileData.data) {
                    // Set form data from profile
                    setFormData({
                        firstName: profileData.data.firstName || "",
                        lastName: profileData.data.lastName || "",
                        email: profileData.data.email || "",
                        age: profileData.data.age || "",
                        weight: profileData.data.weight || "",
                        weightUnit: profileData.data.weightUnit || "kg",
                        height: profileData.data.height || "",
                        heightUnit: profileData.data.heightUnit || "cm",
                        fitnessLevel: profileData.data.fitnessLevel || "beginner",
                        fitnessGoal: profileData.data.fitnessGoal || "general fitness",
                        workoutPreferences: profileData.data.workoutPreferences || "",
                        dietaryRestrictions: profileData.data.dietaryRestrictions || "",
                        preferredWorkoutTimes: profileData.data.preferredWorkoutTimes || ""
                    });
                } else {
                    throw new Error(profileData.message || "Failed to load profile data");
                }
            } catch (err) {
                console.error("Profile loading error:", err);
                setError(err.message || "An error occurred while loading your profile");
            } finally {
                setLoading(false);
            }
        }
        
        fetchUserProfile();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setSaving(true);

        try {
            // Get auth token
            const token = await getIdToken();
            if (!token) {
                throw new Error("Authentication token is missing. Please log in again.");
            }

            // Prepare data to send
            const profileData = { ...formData };

            // Convert numeric fields
            if (profileData.age) profileData.age = parseInt(profileData.age);
            if (profileData.weight) profileData.weight = parseFloat(profileData.weight);
            if (profileData.height) profileData.height = parseFloat(profileData.height);

            // Submit profile data
            const response = await fetch(
                "http://localhost:8000/api/users/profile",
                {
                    method: "PATCH",
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(profileData)
                }
            );

            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to update profile");
            }

            // Show success message
            setSuccessMessage("Profile updated successfully!");
            
            // Auto-hide success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
            
        } catch (err) {
            setError(err.message || "An error occurred. Please try again.");
            console.error("Profile update error:", err);
        } finally {
            setSaving(false);
        }
    };
    
    // Navigate back to dashboard
    const handleCancel = () => {
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <DashboardNavbar />
            <main className="flex-grow pt-16">
                
                
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Your Profile</h2>
                        
                        {/* Loading indicator */}
                        {loading && (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                            </div>
                        )}
                        
                        {/* Error message */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}
                        
                        {/* Success message */}
                        {successMessage && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                {successMessage}
                            </div>
                        )}
                        
                        {!loading && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information Section */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="firstName" className="block text-gray-700 text-sm font-medium mb-2">
                                                First Name
                                            </label>
                                            <input 
                                                type="text" 
                                                id="firstName" 
                                                name="firstName" 
                                                value={formData.firstName} 
                                                onChange={handleChange} 
                                                required 
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                                            />
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="lastName" className="block text-gray-700 text-sm font-medium mb-2">
                                                Last Name
                                            </label>
                                            <input 
                                                type="text" 
                                                id="lastName" 
                                                name="lastName" 
                                                value={formData.lastName} 
                                                onChange={handleChange} 
                                                required 
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                                            />
                                        </div>
                                        
                                        <div className="md:col-span-2">
                                            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                                                Email (cannot be changed)
                                            </label>
                                            <input 
                                                type="email" 
                                                id="email" 
                                                name="email" 
                                                value={formData.email} 
                                                disabled 
                                                className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md text-gray-500" 
                                            />
                                            <p className="mt-1 text-xs text-gray-500">Email address cannot be changed as it's linked to your account</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Body Metrics Section */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Body Metrics</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label htmlFor="age" className="block text-gray-700 text-sm font-medium mb-2">
                                                Age
                                            </label>
                                            <input 
                                                type="number" 
                                                id="age" 
                                                name="age" 
                                                value={formData.age} 
                                                onChange={handleChange} 
                                                min="13" 
                                                max="120" 
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="weight" className="block text-gray-700 text-sm font-medium mb-2">
                                                Weight
                                            </label>
                                            <div className="flex space-x-2">
                                                <input 
                                                    type="number" 
                                                    id="weight" 
                                                    name="weight" 
                                                    value={formData.weight} 
                                                    onChange={handleChange} 
                                                    min="20" 
                                                    step="0.1" 
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                                                />
                                                <select 
                                                    name="weightUnit" 
                                                    value={formData.weightUnit} 
                                                    onChange={handleChange} 
                                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                >
                                                    <option value="kg">kg</option>
                                                    <option value="lb">lb</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="md:col-span-3">
                                            <label htmlFor="height" className="block text-gray-700 text-sm font-medium mb-2">
                                                Height
                                            </label>
                                            <div className="flex space-x-2">
                                                <input 
                                                    type="number" 
                                                    id="height" 
                                                    name="height" 
                                                    value={formData.height} 
                                                    onChange={handleChange} 
                                                    step="0.1" 
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                                                />
                                                <select 
                                                    name="heightUnit" 
                                                    value={formData.heightUnit} 
                                                    onChange={handleChange} 
                                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                >
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
                                            <label htmlFor="fitnessLevel" className="block text-gray-700 text-sm font-medium mb-2">
                                                Your Current Fitness Level
                                            </label>
                                            <select 
                                                id="fitnessLevel" 
                                                name="fitnessLevel" 
                                                value={formData.fitnessLevel} 
                                                onChange={handleChange} 
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            >
                                                <option value="beginner">Beginner - Just starting out</option>
                                                <option value="intermediate">Intermediate - Some experience</option>
                                                <option value="advanced">Advanced - Very experienced</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="fitnessGoal" className="block text-gray-700 text-sm font-medium mb-2">
                                                Primary Fitness Goal
                                            </label>
                                            <select 
                                                id="fitnessGoal" 
                                                name="fitnessGoal" 
                                                value={formData.fitnessGoal} 
                                                onChange={handleChange} 
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            >
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
                                
                                {/* Preferences Section */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Additional Preferences</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="workoutPreferences" className="block text-gray-700 text-sm font-medium mb-2">
                                                Workout Preferences (optional)
                                            </label>
                                            <textarea 
                                                id="workoutPreferences" 
                                                name="workoutPreferences" 
                                                value={formData.workoutPreferences} 
                                                onChange={handleChange} 
                                                placeholder="E.g., I prefer HIIT workouts, outdoor running, etc."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-24"
                                            ></textarea>
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="dietaryRestrictions" className="block text-gray-700 text-sm font-medium mb-2">
                                                Dietary Restrictions (optional)
                                            </label>
                                            <textarea 
                                                id="dietaryRestrictions" 
                                                name="dietaryRestrictions" 
                                                value={formData.dietaryRestrictions} 
                                                onChange={handleChange} 
                                                placeholder="E.g., vegetarian, gluten-free, etc."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-24"
                                            ></textarea>
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="preferredWorkoutTimes" className="block text-gray-700 text-sm font-medium mb-2">
                                                Preferred Workout Times (optional)
                                            </label>
                                            <textarea 
                                                id="preferredWorkoutTimes" 
                                                name="preferredWorkoutTimes" 
                                                value={formData.preferredWorkoutTimes} 
                                                onChange={handleChange} 
                                                placeholder="E.g., mornings before work, evenings, etc."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-24"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Submit Buttons */}
                                <div className="flex flex-col md:flex-row gap-4 justify-end pt-4">
                                    <button 
                                        type="button" 
                                        onClick={handleCancel}
                                        className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={saving} 
                                        className={`px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition duration-300 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default Profile;