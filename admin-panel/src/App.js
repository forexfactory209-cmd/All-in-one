import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard/pages/DashboardPage';
import PropertiesList from './pages/Properties/pages/PropertiesList';
import HotelsList from './pages/Hotels/pages/HotelsList';
import HotelDetailsPage from './pages/Hotels/pages/HotelDetailsPage';
import PropertyDetailsPage from './pages/Properties/pages/PropertyDetailsPage';
import RoomDetailsPage from './pages/Properties/pages/RoomDetailsPage';
import BookingsList from './pages/Bookings/pages/BookingsList';
import BookingDetailsPage from './pages/Bookings/pages/BookingDetailsPage';
import UsersList from './pages/Users/pages/UsersList';
import GuestProfilePage from './pages/Users/pages/GuestProfilePage';
import PaymentsList from './pages/Payments/pages/PaymentsList';
import DisputesList from './pages/Disputes/pages/DisputesList';
import NotificationsPage from './pages/Notifications/pages/NotificationsPage';
import ReportsPage from './pages/Reports/pages/ReportsPage';
import AnalyticsPage from './pages/Analytics/pages/AnalyticsPage';
import SettingsPage from './pages/Settings/pages/SettingsPage';
import CarsPage from './pages/Cars/CarsPage';
import CarBookingsPage from './pages/Cars/CarBookingsPage';
import ToursPage from './pages/Tours/ToursPage';
import './theme/DesignSystem.css';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/properties" element={<PropertiesList />} />
          <Route path="/hotels" element={<HotelsList />} />
          <Route path="/hotels/:id" element={<HotelDetailsPage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route path="/properties/room/:id" element={<RoomDetailsPage />} />
          <Route path="/bookings" element={<BookingsList />} />
          <Route path="/bookings/:id" element={<BookingDetailsPage />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/:id" element={<GuestProfilePage />} />
          <Route path="/payments" element={<PaymentsList />} />
          <Route path="/disputes/:id?" element={<DisputesList />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/services/cars" element={<CarsPage />} />
          <Route path="/services/car-bookings" element={<CarBookingsPage />} />
          <Route path="/services/tours" element={<ToursPage />} />
          <Route path="/reviews" element={<div>Reviews Page (Coming Soon)</div>} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
