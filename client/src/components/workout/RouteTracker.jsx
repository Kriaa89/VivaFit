import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to recenter map when position changes
function SetViewOnLocation({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      map.setView(coords[coords.length - 1], map.getZoom());
    }
  }, [coords, map]);
  return null;
}

export default function RouteTracker() {
  const [tracking, setTracking] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [distance, setDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [speed, setSpeed] = useState(0);
  const watchIdRef = useRef(null);
  const startTimeRef = useRef(null);
  const timerIdRef = useRef(null);
  const elapsedTimeRef = useRef(0);

  // Start tracking user location
  const startTracking = () => {
    if (tracking) return;
    
    // Clear previous data
    setCoordinates([]);
    setDistance(0);
    setElapsedTime(0);
    setSpeed(0);
    startTimeRef.current = new Date();
    
    // Start timer for elapsed time
    timerIdRef.current = setInterval(() => {
      const seconds = Math.floor((new Date() - startTimeRef.current) / 1000);
      setElapsedTime(seconds);
      elapsedTimeRef.current = seconds;
    }, 1000);
    
    // Use Geolocation API to watch position
    if ('geolocation' in navigator) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCoord = [latitude, longitude];
          
          setCurrentPosition(newCoord);
          
          setCoordinates(prevCoords => {
            const updatedCoords = [...prevCoords, newCoord];
            
            // Calculate distance if we have at least 2 points
            if (updatedCoords.length >= 2) {
              const lastIndex = updatedCoords.length - 1;
              const from = turf.point([updatedCoords[lastIndex-1][1], updatedCoords[lastIndex-1][0]]);
              const to = turf.point([updatedCoords[lastIndex][1], updatedCoords[lastIndex][0]]);
              const options = { units: 'kilometers' };
              
              const segmentDistance = turf.distance(from, to, options);
              
              // Only add distance if it's a reasonable movement (to filter GPS noise)
              if (segmentDistance > 0.001) {  // More than 1 meter
                setDistance(prevDistance => {
                  const newTotalDistance = prevDistance + segmentDistance;
                  
                  // Calculate current speed in km/h
                  if (elapsedTimeRef.current > 0) {
                    const speedKmh = (newTotalDistance / (elapsedTimeRef.current / 3600)).toFixed(2);
                    setSpeed(speedKmh);
                  }
                  
                  return newTotalDistance;
                });
              }
            }
            
            return updatedCoords;
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert(`Location error: ${error.message}`);
        },
        options
      );
      
      setTracking(true);
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  // Stop tracking
  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    
    setTracking(false);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, []);

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get map coordinates for react-leaflet (swap lat/lng)
  const getMapCoordinates = () => {
    return coordinates.map(coord => [coord[0], coord[1]]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Route Tracker
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Distance Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 rounded-lg p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Distance</span>
            </div>
            <div className="text-4xl font-bold mb-1">{distance.toFixed(2)}</div>
            <div className="text-blue-100">Kilometers</div>
          </div>

          {/* Time Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 rounded-lg p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Time</span>
            </div>
            <div className="text-4xl font-bold mb-1">{formatTime(elapsedTime)}</div>
            <div className="text-purple-100">Duration</div>
          </div>

          {/* Speed Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 rounded-lg p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Speed</span>
            </div>
            <div className="text-4xl font-bold mb-1">{speed}</div>
            <div className="text-green-100">km/h</div>
          </div>
        </div>

        <div className="mb-8">
          {!tracking ? (
            <button 
              onClick={startTracking}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
              Start Tracking
            </button>
          ) : (
            <button 
              onClick={stopTracking}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1v-4z" />
              </svg>
              Stop Tracking
            </button>
          )}
        </div>

        <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg" style={{ height: '500px' }}>
          {(currentPosition || coordinates.length > 0) ? (
            <MapContainer 
              center={currentPosition || coordinates[0]} 
              zoom={15} 
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {coordinates.length > 0 && (
                <>
                  <Polyline 
                    positions={getMapCoordinates()} 
                    color="#3B82F6" 
                    weight={4} 
                    opacity={0.8}
                  />
                  <Marker position={getMapCoordinates()[0]} />
                  <Marker position={getMapCoordinates()[getMapCoordinates().length - 1]} />
                </>
              )}
              
              <SetViewOnLocation coords={getMapCoordinates()} />
            </MapContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to Start Your Journey?</h3>
              <p className="text-gray-500">Click the Start Tracking button above to begin recording your route</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}