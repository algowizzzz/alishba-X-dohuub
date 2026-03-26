import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PortalSelection } from './components/PortalSelection';
import { AdminLogin } from './components/admin/AdminLogin';
import { PasswordReset } from './components/admin/PasswordReset';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MichelleProfiles } from './components/admin/MichelleProfiles';
import { CreateEditProfile } from './components/admin/CreateEditProfile';
import { ServiceListings } from './components/admin/ServiceListings';
import { CreateEditServiceWizard } from './components/admin/CreateEditServiceWizard';
import { GeographicRegions } from './components/admin/GeographicRegions';
import { ProfileAnalytics } from './components/admin/ProfileAnalytics';
import { AllVendors } from './components/admin/AllVendors';
import { VendorDetail } from './components/admin/VendorDetail';
import { AllListings } from './components/admin/AllListings';
import { ReportedListings } from './components/admin/ReportedListings';
import { PlatformSettings } from './components/admin/PlatformSettings';
import { SubscriptionSettings } from './components/admin/SubscriptionSettings';
import { CustomerManagement } from './components/admin/CustomerManagement';
import { AllReviews } from './components/admin/AllReviews';
import { MichelleOrders } from './components/admin/MichelleOrders';
import { PushNotifications } from './components/admin/PushNotifications';
import { VendorLayout } from './components/vendor/VendorLayout';
import { VendorLogin } from './components/vendor/VendorLogin';
import { VendorSignUp } from './components/vendor/VendorSignUp';
import { VendorProfileSetup } from './components/vendor/VendorProfileSetup';
import { VendorDashboard } from './components/vendor/VendorDashboard';
import { VendorServices } from './components/vendor/VendorServices';
import { VendorStoreForm } from './components/vendor/VendorStoreForm';
import { VendorStoreListings } from './components/vendor/VendorStoreListings';
import { VendorListingFormRouter } from './components/vendor/VendorListingFormRouter';
import { VendorGeographicRegions } from './components/vendor/VendorGeographicRegions';
import { VendorStoreDetails } from './components/vendor/VendorStoreDetails';
import { VendorOrders } from './components/vendor/VendorOrders';
import { VendorSubscription } from './components/vendor/VendorSubscription';
import { VendorSubscriptionManagement } from './components/vendor/VendorSubscriptionManagement';
import { VendorChangePlan } from './components/vendor/VendorChangePlan';
import { VendorUpdatePayment } from './components/vendor/VendorUpdatePayment';
import { VendorProfile } from './components/vendor/VendorProfile';
import { VendorSettings } from './components/vendor/VendorSettings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Routes>
        {/* Portal Selection */}
        <Route path="/" element={<PortalSelection />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/reset-password" element={<PasswordReset />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/michelle-profiles" element={<MichelleProfiles />} />
        <Route path="/admin/michelle-profiles/analytics" element={<ProfileAnalytics />} />
        <Route path="/admin/michelle-profiles/create" element={<CreateEditProfile />} />
        <Route path="/admin/michelle-profiles/edit/:id" element={<CreateEditProfile />} />
        <Route path="/admin/michelle-profiles/regions" element={<GeographicRegions />} />
        <Route path="/admin/michelle-profiles/:profileId/listings" element={<ServiceListings />} />
        <Route path="/admin/michelle-profiles/:profileId/listings/create" element={<CreateEditServiceWizard />} />
        <Route path="/admin/michelle-profiles/:profileId/listings/edit/:listingId" element={<CreateEditServiceWizard />} />
        <Route path="/admin/vendors" element={<AllVendors />} />
        <Route path="/admin/vendors/:id" element={<VendorDetail />} />
        <Route path="/admin/vendors/michelle/:id" element={<VendorDetail />} />
        <Route path="/admin/listings" element={<AllListings />} />
        <Route path="/admin/moderation" element={<Navigate to="/admin/moderation/listings" replace />} />
        <Route path="/admin/moderation/listings" element={<ReportedListings />} />
        <Route path="/admin/moderation/reports" element={<ReportedListings />} />
        <Route path="/admin/settings" element={<PlatformSettings />} />
        <Route path="/admin/settings/subscriptions" element={<SubscriptionSettings />} />
        <Route path="/admin/orders" element={<MichelleOrders />} />
        <Route path="/admin/customers" element={<CustomerManagement />} />
        <Route path="/admin/customers/:id" element={<CustomerManagement />} />
        <Route path="/admin/reviews" element={<AllReviews />} />
        <Route path="/admin/push-notifications" element={<PushNotifications />} />

        {/* Vendor Routes */}
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/signup" element={<VendorSignUp />} />
        <Route path="/vendor/subscription" element={<VendorSubscription />} />
        <Route element={<VendorLayout />}>
          <Route path="/vendor/subscription-management" element={<VendorSubscriptionManagement />} />
          <Route path="/vendor/change-plan" element={<VendorChangePlan />} />
          <Route path="/vendor/update-payment" element={<VendorUpdatePayment />} />
          <Route path="/vendor/profile-setup" element={<VendorProfileSetup />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/services" element={<VendorServices />} />
          <Route path="/vendor/services/create" element={<VendorStoreForm />} />
          <Route path="/vendor/services/edit/:storeId" element={<VendorStoreForm />} />
          <Route path="/vendor/services/:storeId/listings" element={<VendorStoreListings />} />
          <Route path="/vendor/services/:storeId/listings/create" element={<VendorListingFormRouter />} />
          <Route path="/vendor/services/:storeId/listings/edit/:listingId" element={<VendorListingFormRouter />} />
          <Route path="/vendor/services/:storeId/regions" element={<VendorGeographicRegions />} />
          <Route path="/vendor/services/:storeId/details" element={<VendorStoreDetails />} />
          <Route path="/vendor/orders" element={<VendorOrders />} />
          <Route path="/vendor/profile" element={<VendorProfile />} />
          <Route path="/vendor/settings" element={<VendorSettings />} />
        </Route>
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}