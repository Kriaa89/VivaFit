import React from 'react';
import { Container } from 'react-bootstrap';
import RouteTracker from './RouteTracker';
import DashboardNavbar from '../dashboard/DashboardNavbar';

export default function WorkoutTracker() {
  return (
    <>
      <DashboardNavbar />
      <Container className="mt-4">
        <h2 className="mb-4">Track Your Workout</h2>
        <p className="mb-4">
          Use this tracker to record your outdoor running, walking, or cycling routes. 
          The app will track your position, calculate distance traveled, and display your 
          route on the map in real-time.
        </p>
        <RouteTracker />
      </Container>
    </>
  );
}