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
                  if (elapsedTime > 0) {
                    const speedKmh = (newTotalDistance / (elapsedTime / 3600)).toFixed(2);
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
    <div className="route-tracker">
      <div className="stats-container bg-light p-3 mb-3 rounded">
        <div className="row">
          <div className="col-md-4">
            <div className="stat-box text-center">
              <h4>Distance</h4>
              <p className="stat-value">{distance.toFixed(2)} km</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-box text-center">
              <h4>Time</h4>
              <p className="stat-value">{formatTime(elapsedTime)}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-box text-center">
              <h4>Speed</h4>
              <p className="stat-value">{speed} km/h</p>
            </div>
          </div>
        </div>
      </div>

      <div className="controls mb-3">
        {!tracking ? (
          <button 
            className="btn btn-success btn-lg w-100" 
            onClick={startTracking}
          >
            Start Tracking
          </button>
        ) : (
          <button 
            className="btn btn-danger btn-lg w-100" 
            onClick={stopTracking}
          >
            Stop Tracking
          </button>
        )}
      </div>

      <div className="map-container" style={{ height: '400px', width: '100%' }}>
        {(currentPosition || coordinates.length > 0) ? (
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
                  positions={getMapCoordinates()} 
                  color="blue" 
                  weight={4} 
                />
                <Marker position={getMapCoordinates()[0]} />
                <Marker position={getMapCoordinates()[getMapCoordinates().length - 1]} />
              </>
            )}
            
            <SetViewOnLocation coords={getMapCoordinates()} />
          </MapContainer>
        ) : (
          <div className="map-placeholder d-flex align-items-center justify-content-center bg-light" style={{ height: '100%' }}>
            <p className="text-muted">Start tracking to see your route on the map</p>
          </div>
        )}
      </div>
    </div>
  );
}