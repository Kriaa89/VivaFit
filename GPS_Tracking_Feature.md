# GPS Tracking Feature for VivaFit

This document explains how the GPS Tracking feature in VivaFit works. The feature leverages free tools available for web apps and demonstrates concepts that are useful for students learning about geolocation, mapping, and distance calculation.

## Overview

The GPS Tracking feature records the user’s route as they walk, run, or cycle. It uses three key components:
- <span style="color:#007ACC;">**📍 HTML5 Geolocation API**</span> –  
  Captures the user’s real-time GPS coordinates.  
  Learn more: [MDN Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- <span style="color:#0F9D58;">**📏 Turf.js**</span> –  
  Performs accurate geospatial distance calculations using methods like the Haversine formula.  
  Learn more: [Turf.js Documentation](https://turfjs.org/)
- <span style="color:#FF5722;">**🗺️ React-Leaflet with OpenStreetMap**</span> –  
  Renders an interactive map to display the route with start/end markers.  
  Learn more: [React-Leaflet Docs](https://react-leaflet.js.org/)

## How It Works

### 1. Capturing GPS Coordinates

- Uses the **HTML5 Geolocation API** (<span style="color:#007ACC;">📍</span>) via `navigator.geolocation.watchPosition` to collect coordinates continuously.
- Each new coordinate (latitude and longitude) is appended to an array, representing the user’s progression.
- [Learn how it works](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)

### 2. Calculating Distance with Turf.js

- After capturing each coordinate, the system checks for at least two points.
- <span style="color:#0F9D58;">**Turf.js**</span> (<span style="color:#0F9D58;">📏</span>) calculates the distance between the two recent points:
  - Each coordinate is transformed into a "point" for computation.
  - Computation uses Turf’s `distance` function with options (e.g., `units: 'kilometers'`).
- Only movements larger than 1 meter (0.001 km) are considered.
- Speed is calculated in km/h from the total distance and elapsed time.
- [More on Turf.js](https://turfjs.org/)

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

- <span style="color:#FF5722;">**React-Leaflet**</span> (<span style="color:#FF5722;">🗺️</span>) renders an interactive map.
- A `TileLayer` from OpenStreetMap provides the base map.
- The coordinates array is processed (with proper lat/lng order) and passed to the `Polyline` component.
- Markers dynamically display the starting and ending positions.
- [React-Leaflet details](https://react-leaflet.js.org/)

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

- **Start Tracking** <span style="color:#34A853;">(▶️)</span>:  
  Clears previous data, starts the timer, and begins monitoring location.
- **Stop Tracking** <span style="color:#EA4335;">(⏹️)</span>:  
  Halts tracking and timers, allowing review of the route along with distance and speed metrics.
- Real-time cards show:
  - <span style="color:#34A853;">Distance</span> in kilometers.
  - <span style="color:#FBBC05;">Elapsed Time</span> (HH:MM:SS).
  - <span style="color:#4285F4;">Speed</span> in km/h.
- [See more UI ideas](https://tailwindcss.com/)

## New Enhancements

- <span style="color:#6A1B9A;">**Improved User Interface**</span> (<span style="color:#6A1B9A;">💅</span>):  
  Enhanced controls with a modern UI using Tailwind CSS. Smooth transitions and hover effects improve interactivity.
- <span style="color:#00897B;">**Instant Metrics Updates**</span> (<span style="color:#00897B;">⚡</span>):  
  Real-time recalculations update metrics immediately upon receiving new GPS data.
- <span style="color:#D81B60;">**Enhanced Map Interaction**</span> (<span style="color:#D81B60;">🔄</span>):  
  Updated markers on the map clearly indicate the starting point and current position for better visual guidance.
- [Discover our design approach](https://tailwindcss.com/docs)

## How Students Can Learn from This Feature

- **Geolocation API:**  
  Understand how to access and work with real-time location data.
- **Geospatial Calculations:**  
  Learn precise distance calculation with Turf.js.
- **Interactive Mapping:**  
  Gain skills in rendering dynamic maps using React-Leaflet and OpenStreetMap.
- **Real-Time Data Handling:**  
  Observe how timers and continuous updates work to keep computed metrics current.

## Final Thoughts

By combining free, open-source tools, VivaFit delivers a robust, location-aware feature. This setup not only enhances user engagement with real-time tracking and interactive maps but also serves as a valuable learning resource for developers exploring geolocation, mapping, and data visualization techniques.

Happy Tracking and Coding!