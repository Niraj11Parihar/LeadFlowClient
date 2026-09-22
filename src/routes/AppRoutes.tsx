import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LeadsPage } from '../pages/LeadsPage';
import { LeadCreatePage } from '../pages/LeadCreatePage';
import { LeadDetailsPage } from '../pages/LeadDetailsPage';
import { LeadEditPage } from '../pages/LeadEditPage';
import { KanbanPage } from '../pages/KanbanPage';
import { CompaniesPage } from '../pages/CompaniesPage';
import { TasksPage } from '../pages/TasksPage';
import { ActivitiesPage } from '../pages/ActivitiesPage';
import { SettingsPage } from '../pages/SettingsPage';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="leads/new" element={<LeadCreatePage />} />
        <Route path="leads/:id" element={<LeadDetailsPage />} />
        <Route path="leads/:id/edit" element={<LeadEditPage />} />
        <Route path="kanban" element={<KanbanPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="activities" element={<ActivitiesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
