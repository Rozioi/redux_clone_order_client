import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import LeftSidebar from "./components/LeftSidebar";
import ModList from "./components/ModList";
import SnowBackground from "./components/SnowBackground";
import styles from './assets/App.module.scss';

const App: React.FC = () => {
  return (
    <Router>
      <div className={styles.app}>
        <SnowBackground />
        <Header />
        <LeftSidebar />
        <main className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<ModList />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
