# VivaFit Front-End

## Project Overview
VivaFit is a modern fitness application that provides users with personalized workout experiences, real-time progress tracking, and tailored exercise plans. The front-end is designed to be engaging, responsive, and intuitive—targeted at fitness enthusiasts looking for a smart way to manage their workout journey.

## Front-End Architecture & Tech Stack
- **React** – Component-based UI library that powers dynamic views.
- **Vite** – Fast development server and build tool for optimized performance.
- **Tailwind CSS** – Utility-first CSS framework for rapid and consistent styling.
- **React Router Dom** – Enables client-side routing and navigation.
- **Axios** – For handling HTTP requests and API interactions.
- **Firebase** – Used for social authentication and real-time features.
- **Bootstrap** – Supplementary CSS framework for some layout elements.

The project is structured into clear directories:
- **src/components:** Reusable UI components (e.g., Navbar, Footer, Dashboard, Auth forms).
- **src/context:** Global state design with AuthContext.
- **src/services:** API integration using Axios.
- **src/firebase:** Firebase configuration and initialization.
- **src/pages:** Feature views, such as Home, About, and Dashboard.

## Features Overview

### User Authentication
- **Registration & Login:** Secure email/password based authentication with form validation.
- **Social Login:** Integration with Google via Firebase enabling one-click signup/sigin.
- **Protected Routes:** Ensuring secure access to member-only pages through route guards.

### Dashboard & Progress Tracking
- **Dashboard UI:** Displays user information, personalized greetings, and navigation to key features.
- **Graphical Progress Charts:** Placeholder graphs and charts (recommend integrating libraries like Chart.js or Recharts) to display workout progress, completion stats, and historical data.
- **Real-Time Updates:** Dynamic UI components automatically refreshing to show the latest fitness metrics.

### Tailored Workout Plans
- **Personalized Recommendations:** Workout plans are influenced by user preferences such as fitness level and desired goals.
- **Plan Adjustments:** Features allow users to update their target plans based on progress and feedback.

### Exercise Exploration
- **Search & Filter Options:** Users can browse through an exercise library with filter options like muscle groups and equipment.
- **API Integration Placeholder:** Designed to integrate with external exercise APIs to fetch detailed exercise demonstrations and tips.

### Profile Management
- **Editable User Information:** Users can update their personal details, view past activities, and adjust fitness preferences.
- **Historical Data:** Supports review of previous workout logs and progress history to assist in tracking overall fitness journey.

### Smartwatch Integration (If applicable)
- **Device Sync:** Although currently in early stages, the project is structured to allow future integration with wearable devices (e.g., Fitbit, Apple Watch) for automatic workout syncing.

## UI/UX Design & Color Scheme
- **Modern Visuals:** Uses vibrant gradients and dynamic imagery to create an energetic and motivating environment.
- **Responsive Design:** The interface adapts to different devices and screen sizes ensuring usability on mobile, tablet, and desktop.
- **Color Palette & Typography:** 
  - **Gradients:** Frequently used in hero sections and call-to-actions to drive user engagement.
  - **Neutral and Vibrant Accents:** Balances ease of reading with energetic hues that reflect the fitness theme.
  - **Icons & SVGs:** Custom SVG icons are embedded to complement texts and support intuitive navigation.
- **Design Principles:** The UI emphasizes clarity, simplicity, and accessibility, thereby creating a seamless user flow.

## Diagrams & Graphs
- **Component Diagram:** [Placeholder image] (Consider adding a diagram showing key components and their relationships.)
- **Workflow Diagrams:** [Placeholder for authentication or dashboard workflows]
- **Progress Charts:** Graphs and charts (using libraries like Chart.js) to represent weekly workouts, trends, and progress summaries.

## Usage Instructions & Setup
1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd VivaFit/client
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Run the Development Server**
   ```bash
   npm run dev
   ```
4. **Build for Production**
   ```bash
   npm run build
   ```
5. **Preview the Production Build**
   ```bash
   npm run preview
   ```

## Contributions & Future Enhancements
- **Future Improvements:**
  - Integration of live progress charts and workout statistics.
  - Enhanced accessibility features and internationalization.
  - Deeper social integration and smartwatch connectivity.
- **Contributions:**
  - Contributions are welcome! Please refer to our contribution guidelines and open an issue or pull request with your proposed improvements.

## Additional Notes
- Consistent code styling and best practices are enforced via ESLint.
- Tailwind CSS and Vite ensure rapid development and easy scalability.
- For further details, refer to inline documentation in the source code.

--- 

*Happy Training & Coding!*
