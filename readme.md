# User Stories for Fitness & Workout Tracker

1️⃣ User Registration & Authentication  
As a user, I want to sign up and log in securely, so that I can access my personalized fitness plans.  
- User can register with email and password.  
- User can log in using credentials.  
- User authentication is managed with JWT firebase for session security.  
- Error messages are displayed for invalid login attempts.

2️⃣ Dashboard Overview  
As a user, when I log in, I want to see my workout progress, fitness goals, and recommended exercises, so that I can track my fitness journey easily.  
- The dashboard displays total workouts completed.  
- Goals and progress tracking are clearly visible.  
- Recommended workout routines appear based on the user’s profile and fitness goals.  
- Smartwatch sync status is visible (if connected).  
- A reminder or widget prompts the user to update their weekly weight if due.

3️⃣ Profile Management  
As a user, I want to update my personal information (age, weight, height, fitness level), so that my workout plans remain personalized and relevant.  
- Users can edit and save personal details such as name, age, weight, and fitness level.  
- Updates are reflected in workout recommendations and progress tracking.  
- A dedicated section allows users to view and manage their weekly weight logs and progress.

4️⃣ Tailored Workout Plans  
As a user, I want to receive workout plans based on my body type, available equipment, and fitness goals, so that I can follow a structured fitness routine.  
- User inputs include fitness level, goals, and available equipment.  
- The system generates a customized workout plan based on these inputs.  
- AI-generated insights are available as an optional, supportive feature.  
- Users can regenerate or modify the workout plan manually.

5️⃣ Exercise Exploration  
As a user, I want to browse exercises based on muscle groups and equipment, so that I can find exercises that suit my needs.  
- Filters are provided for muscle groups (e.g., arms, legs, back, etc.).  
- Filters are provided for equipment (e.g., dumbbells, resistance bands, etc.).  
- The app integrates with the ExerciseDB API to display detailed exercise information.

6️⃣ Workout Tracking  
As a user, I want to log my completed workouts, so that I can monitor my progress over time.  
- Users can mark workouts as complete.  
- Each workout is recorded in the database with relevant details.  
- Completed sessions are displayed on the dashboard and accessible in the workout history.

7️⃣ Goal Setting & Progress Visualization  
As a user, I want to set fitness goals and track my progress, so that I can stay motivated and see my improvements.  
- Users can set both short-term and long-term goals.  
- Graphical progress charts display metrics such as workout frequency, weight changes, and goal completion.  
- The system provides notifications for milestone achievements.

8️⃣ Weekly Weight Update & Weight Loss Tracking  
As a user, I want to update my weight on a weekly basis, so that I can monitor my weight loss or gain over time and adjust my fitness plan if needed.  
**Acceptance Criteria:**  
- The app prompts the user to enter their weight once a week via a dashboard reminder or notification.  
- Each weight entry is stored with a timestamp, allowing for historical tracking.  
- Graphs and charts visually display weight trends over time, highlighting progress toward target weight goals.  
- The app compares current weight entries against user-set goals and displays percentage progress (e.g., “You’ve lost 4% of your target weight!”).  
- Feedback or recommendations are provided based on the weight trend, with positive reinforcement for progress or suggestions for plan adjustments if progress stalls.

9️⃣ Smartwatch Integration  
As a user, I want to sync my workouts with my smartwatch, so that my progress is automatically updated.  
- An API connection is established with supported smartwatch devices (e.g., Apple Health, Fitbit).  
- Workout data is automatically imported from the smartwatch.  
- A manual sync option is available if automatic syncing fails.

🔟 Social & Community Features (Optional Future Feature)  
As a user, I want to connect with other users, share progress, and join challenges, so that I can stay motivated and accountable.  
- A community dashboard enables progress sharing among users.  
- Options to participate in group challenges are provided.  
- Users can connect with friends for workout comparisons and mutual motivation.

---

## What the User Sees After Login

**1️⃣ Dashboard:**  
- A personalized welcome message displaying the user's name.  
- A progress summary including total workouts completed and current fitness goals.  
- Recommended workout routines curated from the user's profile data, with optional AI insights available as a supporting feature.  
- A prominent “Start Workout” button for quick access.  
- A widget or reminder prompting the user to update their weekly weight, if due.

**2️⃣ Profile Section:**  
- Editable fields for personal details (e.g., age, weight, fitness level, and fitness goals).  
- A section dedicated to weekly weight logs and a visual summary of weight loss or gain over time.  
- A historical log of workouts and milestones achieved.

**3️⃣ Workout Plans:**  
- A list of tailored workout routines generated based on the user’s inputs.  
- An exercise library with filters for muscle groups and equipment for manual exploration.

**4️⃣ Progress Tracker:**  
- Graphs and analytics displaying overall fitness progress, including workout history with timestamps.  
- A dedicated area for visualizing weight trends and progress toward weight goals.

**5️⃣ Smartwatch Sync (if enabled):**  
- Display of the smartwatch connection status.  
- Information on the last sync, ensuring the user’s workout data is up-to-date.
