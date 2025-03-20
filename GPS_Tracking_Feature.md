# GPS Tracking Feature for VivaFit

This document explains how the GPS Tracking feature in VivaFit works. The feature leverages free tools available for web apps and demonstrates concepts that are useful for students learning about geolocation, mapping, and distance calculation.

## Overview

The GPS Tracking feature records the user’s route as they walk, run, or cycle. It uses three key components:

1. **HTML5 Geolocation API**  
   Captures the user’s real-time GPS coordinates through the browser.

2. **Turf.js**  
   Calculates distances between coordinate points using accurate geospatial functions (e.g., the Haversine formula).

3. **React-Leaflet with OpenStreetMap**  
   Displays the user’s route on an interactive map and adds markers for the starting and ending points.

## How It Works

### 1. Capturing GPS Coordinates

- The **HTML5 Geolocation API** is used via `navigator.geolocation.watchPosition` to continuously capture the user's current location.
- Each new coordinate (latitude and longitude) is appended to an array.
- This array of coordinates represents the user’s path.

### 2. Calculating Distance with Turf.js

- After each new coordinate is captured, the feature checks if there are at least two points.
- Turf.js is then used to calculate the distance between the latest two coordinates:
  - A "point" is created for each coordinate.
  - Turf’s `distance` function computes the distance (in kilometers) using options (like `units: 'kilometers'`).
- To ensure accuracy, only distances over 1 meter (0.001 kilometers) are added to the total distance.
- The speed is calculated in km/h using the total distance and elapsed time.

#### Example Snippet:
```js
const from = turf.point([prevCoord[1], prevCoord[0]]);
const to = turf.point([newCoord[1], newCoord[0]]);
const options = { units: 'kilometers' };
const segmentDistance = turf.distance(from, to, options);

if (segmentDistance > 0.001) {  
  setDistance(prevDistance => {
    const newTotal = prevDistance + segmentDistance;
    if (elapsedTime > 0) {
      const speedKmh = (newTotal / (elapsedTime / 3600)).toFixed(2);
      setSpeed(speedKmh);
    }
    return newTotal;
  });
}
```

### 3. Displaying the Route on the Map with React-Leaflet

- **React-Leaflet** is used to render an interactive map in the RouteTracker component.
- An OpenStreetMap `TileLayer` provides the map tiles.
- The array of coordinates is transformed (if needed, swapping lat/lng) and passed to a `Polyline` component to render the route.
- Markers are added for the first and last coordinates.

#### Example Snippet:
```jsx
<MapContainer 
  center={currentPosition || coordinates[0]} 
  zoom={15} 
  style={{ height: '100%', width: '100%' }}
>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  {coordinates.length > 0 && (
    <>
      <Polyline 
        positions={coordinates.map(coord => [coord[0], coord[1]])} 
        color="#3B82F6" 
        weight={4} 
        opacity={0.8}
      />
      <Marker position={coordinates[0]} />
      <Marker position={coordinates[coordinates.length - 1]} />
    </>
  )}
  <SetViewOnLocation coords={coordinates.map(coord => [coord[0], coord[1]])} />
</MapContainer>
```

### 4. User Controls and Interface

- **Start Tracking:**  
  A button initiates the tracking process. It clears previous data, starts a timer (to measure elapsed time), and begins watching the user’s location.
- **Stop Tracking:**  
  Once stopped, the app halts the GPS watch and timer, allowing users to review their tracked route, total distance, and calculated speed.
- **Real-time Feedback:**  
  Distance (in kilometers), elapsed time (formatted as HH:MM:SS), and speed (in km/h) are displayed in visually distinctive cards to provide instant feedback.

## New Enhancements

- **Improved User Interface:**  
  The new controls are integrated with a visually appealing, motion-enhanced UI built with Tailwind CSS. Buttons feature smooth hover transitions and scaling effects to enhance user engagement.
- **Instant Metrics Updates:**  
  As soon as new GPS data is received, metrics are recalculated and updated in real time without page refreshes.
- **Enhanced Map Interaction:**  
  Building on the existing React-Leaflet implementation, the map now highlights both the starting point and the latest coordinate with updated markers, offering clearer route visualization.

## How Students Can Learn from This Feature

- **Geolocation API:**  
  Understand how browsers can access real-time location data.
- **Geospatial Calculations:**  
  Learn how Turf.js offers precise distance calculations using standard geographic formulas.
- **Interactive Mapping:**  
  See how React-Leaflet and OpenStreetMap work together to create dynamic maps—equipping you with skills to build location-based features.
- **Real-Time Data Handling:**  
  Observe how the feature integrates timers and continuous coordinate capture to recalculate metrics (like distance and speed) in real time.

## Final Thoughts

By combining these free tools, VivaFit provides an excellent example of how to build location-aware features without incurring extra costs. Integrate these techniques into your projects to enhance user engagement and usability by offering real-time progress tracking and interactive maps.

Happy Tracking and Coding!