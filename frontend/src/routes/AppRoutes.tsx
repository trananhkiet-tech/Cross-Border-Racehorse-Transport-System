import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import type { Role } from '../types/enums';
import { ROUTE_ACCESS } from './access';
import { GuestRoute, ProtectedRoute, RoleGuard } from './guards';
import { ForbiddenPage, NotFoundPage } from '../features/common/ErrorPages';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { ProfilePage } from '../features/auth/ProfilePage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { NotificationsPage } from '../features/notifications/NotificationsPage';
import { HorseCreatePage, HorseEditPage } from '../features/horses/HorseForm';
import { HorseListPage } from '../features/horses/HorseListPage';
import { HorseDetailPage } from '../features/horses/HorseDetailPage';
import { RequestListPage } from '../features/transportation-requests/RequestListPage';
import { RequestCreatePage, RequestEditPage } from '../features/transportation-requests/RequestWizard';
import { RequestDetailPage } from '../features/transportation-requests/RequestDetailPage';
import { DocumentListPage } from '../features/documents/DocumentListPage';
import { DocumentDetailPage } from '../features/documents/DocumentDetailPage';
import { ChecklistPage } from '../features/compliance/ChecklistPage';
import { MissingDocumentsPage } from '../features/compliance/MissingDocumentsPage';
import { RequirementsPage } from '../features/compliance/RequirementsPage';
import { QuoteListPage } from '../features/quotations/QuoteListPage';
import { QuoteDetailPage } from '../features/quotations/QuoteDetailPage';
import { PricingPage } from '../features/quotations/PricingPage';
import { InvoiceListPage } from '../features/payments/InvoiceListPage';
import { InvoiceDetailPage } from '../features/payments/InvoiceDetailPage';
import { PaymentsPage } from '../features/payments/PaymentsPage';
import { FleetPage } from '../features/fleet/FleetPage';
import { StaffPage } from '../features/fleet/StaffPage';
import { RouteListPage } from '../features/routes/RouteListPage';
import { RouteCreatePage, RouteEditPage } from '../features/routes/RouteFormPage';
import { RouteDetailPage } from '../features/routes/RouteDetailPage';
import { PlanningPage } from '../features/trips/PlanningPage';
import { TripListPage } from '../features/trips/TripListPage';
import { TripDetailPage } from '../features/trips/TripDetailPage';
import { IncidentListPage } from '../features/incidents/IncidentListPage';
import { IncidentDetailPage } from '../features/incidents/IncidentDetailPage';
import { HandoverListPage } from '../features/handovers/HandoverListPage';
import { HandoverDetailPage } from '../features/handovers/HandoverDetailPage';
import { ClaimListPage } from '../features/claims/ClaimListPage';
import { ClaimCreatePage } from '../features/claims/ClaimCreatePage';
import { ClaimDetailPage } from '../features/claims/ClaimDetailPage';
import { ReportsPage } from '../features/reports/ReportsPage';

/**
 * Bảng quyền truy cập trang theo role (ẩn trang vượt quyền). Backend vẫn kiểm tra lại mọi API;
 * bảng này chỉ để UI không dẫn người dùng vào trang họ không dùng được.
 */
export const ROUTE_ROLES: { path: string; roles?: Role[]; element: ReactElement }[] = [
  { path: 'dashboard', roles: ROUTE_ACCESS['dashboard'], element: <DashboardPage /> },
  { path: 'notifications', roles: ROUTE_ACCESS['notifications'], element: <NotificationsPage /> },
  { path: 'profile', roles: ROUTE_ACCESS['profile'], element: <ProfilePage /> },

  { path: 'horses', roles: ROUTE_ACCESS['horses'], element: <HorseListPage /> },
  { path: 'horses/new', roles: ROUTE_ACCESS['horses/new'], element: <HorseCreatePage /> },
  { path: 'horses/:id', roles: ROUTE_ACCESS['horses/:id'], element: <HorseDetailPage /> },
  { path: 'horses/:id/edit', roles: ROUTE_ACCESS['horses/:id/edit'], element: <HorseEditPage /> },

  { path: 'requests', roles: ROUTE_ACCESS['requests'], element: <RequestListPage /> },
  { path: 'requests/new', roles: ROUTE_ACCESS['requests/new'], element: <RequestCreatePage /> },
  { path: 'requests/:id', roles: ROUTE_ACCESS['requests/:id'], element: <RequestDetailPage /> },
  { path: 'requests/:id/edit', roles: ROUTE_ACCESS['requests/:id/edit'], element: <RequestEditPage /> },
  { path: 'requests/:id/compliance', roles: ROUTE_ACCESS['requests/:id/compliance'], element: <ChecklistPage /> },

  { path: 'documents', roles: ROUTE_ACCESS['documents'], element: <DocumentListPage /> },
  { path: 'documents/:id', roles: ROUTE_ACCESS['documents/:id'], element: <DocumentDetailPage /> },
  { path: 'compliance/missing', roles: ROUTE_ACCESS['compliance/missing'], element: <MissingDocumentsPage /> },
  { path: 'compliance/requirements', roles: ROUTE_ACCESS['compliance/requirements'], element: <RequirementsPage /> },

  { path: 'quotes', roles: ROUTE_ACCESS['quotes'], element: <QuoteListPage /> },
  { path: 'quotes/:id', roles: ROUTE_ACCESS['quotes/:id'], element: <QuoteDetailPage /> },
  { path: 'pricing', roles: ROUTE_ACCESS['pricing'], element: <PricingPage /> },
  { path: 'invoices', roles: ROUTE_ACCESS['invoices'], element: <InvoiceListPage /> },
  { path: 'invoices/:id', roles: ROUTE_ACCESS['invoices/:id'], element: <InvoiceDetailPage /> },
  { path: 'payments', roles: ROUTE_ACCESS['payments'], element: <PaymentsPage /> },

  { path: 'fleet', roles: ROUTE_ACCESS['fleet'], element: <FleetPage /> },
  { path: 'staff', roles: ROUTE_ACCESS['staff'], element: <StaffPage /> },
  { path: 'routes', roles: ROUTE_ACCESS['routes'], element: <RouteListPage /> },
  { path: 'routes/new', roles: ROUTE_ACCESS['routes/new'], element: <RouteCreatePage /> },
  { path: 'routes/:id', roles: ROUTE_ACCESS['routes/:id'], element: <RouteDetailPage /> },
  { path: 'routes/:id/edit', roles: ROUTE_ACCESS['routes/:id/edit'], element: <RouteEditPage /> },
  { path: 'planning', roles: ROUTE_ACCESS['planning'], element: <PlanningPage /> },

  { path: 'trips', roles: ROUTE_ACCESS['trips'], element: <TripListPage /> },
  { path: 'trips/:id', roles: ROUTE_ACCESS['trips/:id'], element: <TripDetailPage /> },
  { path: 'incidents', roles: ROUTE_ACCESS['incidents'], element: <IncidentListPage /> },
  { path: 'incidents/:id', roles: ROUTE_ACCESS['incidents/:id'], element: <IncidentDetailPage /> },
  { path: 'handovers', roles: ROUTE_ACCESS['handovers'], element: <HandoverListPage /> },
  { path: 'handovers/:id', roles: ROUTE_ACCESS['handovers/:id'], element: <HandoverDetailPage /> },

  { path: 'claims', roles: ROUTE_ACCESS['claims'], element: <ClaimListPage /> },
  { path: 'claims/new', roles: ROUTE_ACCESS['claims/new'], element: <ClaimCreatePage /> },
  { path: 'claims/:id', roles: ROUTE_ACCESS['claims/:id'], element: <ClaimDetailPage /> },

  { path: 'reports', roles: ROUTE_ACCESS['reports'], element: <ReportsPage /> },
];

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute><AuthLayout /></GuestRoute>}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {ROUTE_ROLES.map((r) => (
          <Route key={r.path} path={r.path} element={r.roles ? <RoleGuard roles={r.roles}>{r.element}</RoleGuard> : r.element} />
        ))}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
