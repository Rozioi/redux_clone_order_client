import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import LeftSidebar from "./components/LeftSidebar";
import SnowBackground from "./components/SnowBackground";
import styles from './assets/App.module.scss';
import LoadingSpinner from "./components/LoadingSpinner";
import Reviews from "./components/Reviews";

// Ленивая загрузка компонентов
const ModList = lazy(() => import("./components/ModList"));
const ModDetail = lazy(() => import("./components/ModDetail"));
const YourMods = lazy(() => import("./components/YourMods"));

const AppContent: React.FC = () => {
  const location = useLocation();
  const isModDetailPage = location.pathname.startsWith("/mod/");
  const isYourModsPage = location.pathname === "/your-mods";
  const isReviewsPage = location.pathname === "/reviews";
  const isCategoryPage = location.pathname.includes("/redux/") || 
                        location.pathname.includes("/gunpack/") ||
                        location.pathname.includes("/clothes/") ||
                        location.pathname.includes("/world/") ||
                        location.pathname.includes("/packs/") ||
                        location.pathname.includes("/guides/") ||
                        location.pathname.includes("/other/");

  const shouldShowSidebar = !isModDetailPage && !isYourModsPage && !isCategoryPage && !isReviewsPage;
  const mainContentStyle = (isModDetailPage || isYourModsPage || isReviewsPage || isCategoryPage) 
    ? { marginLeft: 0 } 
    : {};

  return (
    <div className={styles.app}>
      <SnowBackground />
      <Header />
      {shouldShowSidebar && <LeftSidebar />} 
      <main className={styles.mainContent} style={mainContentStyle}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<ModList />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/mod/:id" element={<ModDetail />} />
            <Route path="/your-mods" element={<YourMods />} />
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
      <AppContent />
    </Router>
  );
};

export default App;