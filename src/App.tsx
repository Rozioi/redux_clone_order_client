import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import LeftSidebar from "./components/LeftSidebar";
import SnowBackground from "./components/SnowBackground";
import styles from "./assets/App.module.scss";
import LoadingSpinner from "./components/LoadingSpinner";
import Reviews from "./components/Reviews";
import Login from "./components/auth/Login";
import RegisterPage from "./components/auth/RegisterPage";
// import AdminLogin from "./components/AdminLogin";
import LoginPage from "./components/auth/LoginPage";
import AdminModDetail from "./components/admin/AdminModDetail";
import AdminPanel from "./components/admin/AdminPanel";
import Profile from './components/Profile';
import { AuthProvider } from './context/AuthContext';
import CreateMod from "./components/mod/CreateMod";
import { AdminBadgeManager } from "./components/AdminBadgeManager";
import SubscriptionSelection from "./components/subscription/SubscriptionSelection";
import { PaymentSuccess } from "./components/PaymentSuccess";
import { PaymentFailure } from "./components/PaymentFailure";
import UserSubscriptions from "./components/subscription/UserSubscriptions";
import PaymentSuccessful from "./pages/PaymentSuccessful";
import DeactivateSubscription from "./pages/DeactivateSubscription";
import RoulettePage from "./pages/RoulettePage";

// Ленивая загрузка компонентов
const ModList = lazy(() => import("./components/mod/ModList"));
const ModDetail = lazy(() => import("./components/mod/ModDetail"));
const YourMods = lazy(() => import("./components/YourMods"));
// const AdminPanel = lazy(() => import("./components/AdminPanel"));

const AppContent: React.FC = () => {
  const location = useLocation();
  const isModDetailPage = location.pathname.startsWith("/mod/");
  const isAuthPage =
    location.pathname.includes("login") ||
    location.pathname.includes("log") ||
    location.pathname.includes("register") ||
    location.pathname.includes("admin-login");
  const isYourModsPage = location.pathname === "/your-mods";
  const isReviewsPage = location.pathname === "/reviews";
  const isSubscriptionPage = location.pathname === "/subscriptions" || location.pathname === "/payment/success" || location.pathname === "/payment/failure";
  const isProfilePage = location.pathname.includes("/user");
  // const isCategoryPage =
    location.pathname.includes("/redux/") ||
    location.pathname.includes("/gunpack/") ||
    location.pathname.includes("/clothes/") ||
    location.pathname.includes("/world/") ||
    location.pathname.includes("/packs/") ||
    location.pathname.includes("/guides/") ||
    location.pathname.includes("/other/");
  const isAdminPage = location.pathname.includes("/admin");
  
  const shouldShowSidebar =
    !isModDetailPage &&
    !isAuthPage &&
    !isYourModsPage &&
    !isSubscriptionPage &&
    // !isCategoryPage &&
    !isReviewsPage &&
    !isAdminPage &&
    !isProfilePage;

  return (
    <div className={styles.app}>
      <SnowBackground />
      {!isAdminPage && !location.pathname.includes("admin-login") && <Header />}
      {shouldShowSidebar && <LeftSidebar />}
      <main className={`${styles.mainContent} ${shouldShowSidebar ? styles.withSidebar : styles.withoutSidebar}`}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<ModList />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/mod/:id" element={<ModDetail />} />
            <Route path="/your-mods" element={<CreateMod />} />
            <Route path="/user/:username" element={<Profile />} />
            <Route path="/roulette" element={<RoulettePage />} />
            <Route path="/log" element={<LoginPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminPanel />} />
             <Route path="/subscriptions" element={<SubscriptionSelection />} />
             <Route path="/deactivate-subscription/:subscriptionId" element={<DeactivateSubscription />} />
            <Route path="/my-subscriptions" element={<UserSubscriptions />} />
            <Route path="/payment/success" element={<PaymentSuccessful />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />
            <Route path="/:category/:subcategory?" element={<ModList />} />
            {/* // <Route path="/admin-login" element={<AdminLogin />} />
               */}
           
            <Route path="/admin/mods/:id" element={<AdminModDetail />} />
            <Route path="/404" element={<div>404 Not Found</div>} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
