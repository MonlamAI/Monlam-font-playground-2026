import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { LoginPage } from './LoginPage';
import { RequireAuth } from './RequireAuth';
import { DashboardPage } from './DashboardPage';
import { FontsPage } from './FontsPage';
import { FontEditorPage } from './FontEditorPage';
import { KeyboardsPage } from './KeyboardsPage';
import { KeyboardEditorPage } from './KeyboardEditorPage';
import { FeedbackListPage, FeedbackDetailPage } from './FeedbackPages';
import { PresetsPage } from './PresetsPage';
import { ScriptStylesPage } from './ScriptStylesPage';

export function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="fonts" element={<FontsPage />} />
          <Route path="fonts/:id" element={<FontEditorPage />} />
          <Route path="presets" element={<PresetsPage />} />
          <Route path="script-styles" element={<ScriptStylesPage />} />
          <Route path="keyboards" element={<KeyboardsPage />} />
          <Route path="keyboards/:id" element={<KeyboardEditorPage />} />
          <Route path="feedback" element={<FeedbackListPage />} />
          <Route path="feedback/:id" element={<FeedbackDetailPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
