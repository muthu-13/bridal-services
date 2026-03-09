import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Context Providers
import { UserProvider, useUser } from "./context/UserContext";
import { WishlistProvider } from "./context/WishlistContext";
import { FontStyleProvider } from "./context/FontStyleContext";

// Components
import SignUpPage from "./component/signup";
import BridalLogin from "./component/login";
import ForgotPassword from "./component/ForgotPassword";
import ResetPassword from "./component/ResetPassword";
import VerifyOTP from "./component/VerifyOTP";
import Home from "./component/Home";
import MultiStepBooking from "./component/booking/MultiStepBooking";
import Services from "./component/admin/Services";
import Contact from "./component/contact";
import Navbar from "./component/Navbar";
import AdminDashboard from "./component/admin/AdminDashboard";
import AdminViewBookings from "./component/admin/AdminViewBookings";
import AdminPaymentsPage from "./component/admin/PaymentViewPage";
import AddService from "./component/admin/AddServices";
import ContactView from "./component/admin/ContactView";
import UserOffers from "./component/UserOffers";
import AdminProvideOffer from "./component/admin/AdminProvideOffer";
import BridalHairStyling from "./component/services/BridalHairStyling";
import BridalMakeup from "./component/services/BridalMakeup";
import BridesmaidGrooming from "./component/services/BridesmaidGroom";
import Jewellery from "./component/services/Jewellery";
import Mehandi from "./component/services/Mehandi";
import Photography from "./component/services/Photography";
import WeddingDecoration from "./component/services/WeddingDecoration";
import WeddingDress from "./component/services/weddingdresses";
import WorkshopRegistration from "./component/WorkshopRegistration";
import AdminViewWorkshopRegistrations from "./component/admin/AdminViewWorkshopRegistrations";
import AdminWorkshopsList from "./component/admin/AdminWorkshopList";
import EditWorkshop from "./component/admin/EditWorkshop";
import WorkshopList from "./component/WorkShopList";
import CreateWorkshop from "./component/admin/CreateWorkshop";
import UserDashboard from "./component/UserDashboard";
import WorkshopPaymentPage from "./component/WorkshopPayamentPage";
import WorkshopPayments from "./component/admin/WorkshopPayament";
import ManageStaff from "./component/admin/ManageStaff";
import FeedbackPage from "./component/FeedbackPAge";
import AdminReviewPage from "./component/admin/AdminReviewPage";
import InventoryPage from "./component/admin/InventoryPage";
import NoteEditor from "./component/NoteEditor";
import VirtualMakeup from "./component/VirtualMakeup";
import RecentlyViewed from "./component/RecentlyViewed";
import AdminReport from "./component/admin/AdminReport";
import ScrollToTop from "./component/ScrollToTop";
import NotificationPage from "./component/NotificationPage";

// Chatbots
import FloatingChatbot from "./component/FloatingChatbot.jsx";
import AdminChatbot from "./component/AdminChatbot.jsx";
import FloatingWhatsApp from "./component/utils/FloatingWhatsApp";

// ✅ Protected Route wrapper
function ProtectedRoute({ children }) {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// ✅ Chatbot wrapper: show only on user pages
function ChatbotWrapper() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  if (isAdminRoute) return null;
  return <FloatingChatbot />;
}

// ✅ Admin Chatbot wrapper: show only on admin routes
function AdminChatbotWrapper() {
  const { user } = useUser();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  if (!isAdminRoute || !user || user.role !== "admin") return null;
  return <AdminChatbot />;
}

function AppRoutes() {
  const { user } = useUser(); // ✅ Get user here

  return (
    <Router>
      <ScrollToTop behavior="instant" />
      <Navbar />
      <FloatingWhatsApp />
      <NoteEditor />
      <ChatbotWrapper />
      <AdminChatbotWrapper />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<BridalLogin />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp/:email" element={<VerifyOTP />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/virtual-makeup" element={<VirtualMakeup />} />
        <Route path="/feedback" element={<FeedbackPage />} />

        {/* Services sub-routes */}
        <Route path="/services/BridalHairStyling" element={<BridalHairStyling />} />
        <Route path="/services/bridalmakeup" element={<BridalMakeup />} />
        <Route path="/services/bridesmaid-groom" element={<BridesmaidGrooming />} />
        <Route path="/services/jewellery" element={<Jewellery />} />
        <Route path="/services/mehendi" element={<Mehandi />} />
        <Route path="/services/photography" element={<Photography />} />
        <Route path="/services/decoration" element={<WeddingDecoration />} />
        <Route path="/services/dresses" element={<WeddingDress />} />

        {/* Public Workshop Listing */}
        <Route path="/workshops" element={<WorkshopList />} />
        <Route path="/register/:id" element={<WorkshopRegistration />} />
        <Route
          path="/workshop/:id/payment"
          element={
            <ProtectedRoute>
              <WorkshopPaymentPage />
            </ProtectedRoute>
          }
        />

        {/* Protected User Routes */}
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <MultiStepBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/offers"
          element={
            <ProtectedRoute>
              <UserOffers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationPage userId={user?.id} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recently-viewed"
          element={
            <ProtectedRoute>
              <RecentlyViewed />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute>
              <AdminViewBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/report"
          element={
            <ProtectedRoute>
              <AdminReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute>
              <AdminPaymentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-service"
          element={
            <ProtectedRoute>
              <AddService />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <ProtectedRoute>
              <ContactView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/offers"
          element={
            <ProtectedRoute>
              <AdminProvideOffer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/workshops/registrations"
          element={
            <ProtectedRoute>
              <AdminViewWorkshopRegistrations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/workshops/create"
          element={
            <ProtectedRoute>
              <CreateWorkshop />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/workshops"
          element={
            <ProtectedRoute>
              <AdminWorkshopsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/workshops/edit/:id"
          element={
            <ProtectedRoute>
              <EditWorkshop />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/workshops/payments"
          element={
            <ProtectedRoute>
              <WorkshopPayments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/staff"
          element={
            <ProtectedRoute>
              <ManageStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute>
              <AdminReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <ProtectedRoute>
              <InventoryPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId="589140933930-7heqi8qeq3gj7ebofbhvmi824rj7rr9n.apps.googleusercontent.com">
      <UserProvider>
        <WishlistProvider>
          <FontStyleProvider>
            <AppRoutes />
          </FontStyleProvider>
        </WishlistProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
