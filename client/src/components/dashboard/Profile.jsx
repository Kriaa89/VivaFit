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
    const [uploading, setUploading] = useState(false);
    
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
        preferredWorkoutTimes: "",
        profilePhoto: ""
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
                        preferredWorkoutTimes: profileData.data.preferredWorkoutTimes || "",
                        profilePhoto: profileData.data.profilePhoto || ""
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

    // Handle photo upload
    const handlePhotoUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('profilePhoto', file);

            const token = await getIdToken();
            const response = await fetch('http://localhost:8000/api/users/upload-photo', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Failed to upload photo');
            
            const result = await response.json();
            setFormData(prev => ({ ...prev, profilePhoto: result.photoUrl }));
            setSuccessMessage("Profile photo updated successfully!");
        } catch (err) {
            setError('Failed to upload photo');
            console.error('Photo upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <DashboardNavbar />
            <main className="flex-grow pt-8">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6 flex-col sm:flex-row">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Your Profile
                            </h2>
                            <div className="relative">
                                {formData.profilePhoto ? (
                                    <img 
                                        src={formData.profilePhoto} 
                                        alt="Profile"
                                        className="h-24 w-24 rounded-full object-cover border-2 border-green-500 shadow-md transition-transform hover:scale-105"
                                    />
                                ) : (
                                    <div className="h-24 w-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105">
                                        <span className="text-2xl font-bold text-white">
                                            {formData.firstName?.charAt(0)}{formData.lastName?.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <label className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 cursor-pointer hover:bg-green-600 transition-colors shadow-md">
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        disabled={uploading}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </label>
                                {uploading && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Loading indicator */}
                        {loading && (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                            </div>
                        )}
                        
                        {/* Error message */}
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-sm">
                                <div className="flex items-center">
                                    <svg className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p>{error}</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Success message */}
                        {successMessage && (
                            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6 shadow-sm">
                                <div className="flex items-center">
                                    <svg className="h-6 w-6 mr-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p>{successMessage}</p>
                                </div>
                            </div>
                        )}
                        
                        {!loading && (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Personal Information Section */}
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors" 
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors" 
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
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Body Metrics
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors" 
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
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors" 
                                                />
                                                <select 
                                                    name="weightUnit" 
                                                    value={formData.weightUnit} 
                                                    onChange={handleChange} 
                                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition-colors"
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
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors" 
                                                />
                                                <select 
                                                    name="heightUnit" 
                                                    value={formData.heightUnit} 
                                                    onChange={handleChange} 
                                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition-colors"
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
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Fitness Profile
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="fitnessLevel" className="block text-gray-700 text-sm font-medium mb-2">
                                                Your Current Fitness Level
                                            </label>
                                            <select 
                                                id="fitnessLevel" 
                                                name="fitnessLevel" 
                                                value={formData.fitnessLevel} 
                                                onChange={handleChange} 
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition-colors"
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition-colors"
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
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                        Additional Preferences
                                    </h3>
                                    <div className="space-y-5">
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-24 transition-colors"
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-24 transition-colors"
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-24 transition-colors"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Submit Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
                                    <button 
                                        type="button" 
                                        onClick={handleCancel}
                                        className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition duration-300 shadow-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={saving} 
                                        className={`px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-md transition duration-300 shadow-sm flex items-center justify-center ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {saving ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Save Changes
                                            </>
                                        )}
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