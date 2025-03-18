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

## UI/UX Design & Color Scheme
- **Modern Visuals:** Uses vibrant gradients and dynamic imagery to create an energetic and motivating environment.
- **Responsive Design:** The interface adapts to different devices and screen sizes ensuring usability on mobile, tablet, and desktop.
- **Color Palette & Typography:** 
  - **Gradients:** Frequently used in hero sections and call-to-actions to drive user engagement.
  - **Neutral and Vibrant Accents:** Balances ease of reading with energetic hues that reflect the fitness theme.
  - **Icons & SVGs:** Custom SVG icons are embedded to complement texts and support intuitive navigation.
- **Design Principles:** The UI emphasizes clarity, simplicity, and accessibility, thereby creating a seamless user flow.

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
