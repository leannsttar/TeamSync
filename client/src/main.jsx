import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Route, RouterProvider } from "react-router-dom";

import "./index.css";

import { HomePage } from "./pages/HomePage.jsx";
import { AboutUsPage } from "./pages/AboutUsPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { FeaturesPage } from "./pages/FeaturesPage.jsx";
import { FAQsPage } from "./pages/FAQsPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { MobileNavBar } from "./components/MobileNavBar.jsx";
import { Footer } from "./components/Footer.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <MobileNavBar />
        <HomePage />
        <Footer />
      </>
    ),
    errorElement: <NotFoundPage />,
  },
  {
    path: "/about",
    element: (
      <>
        <MobileNavBar />
        <AboutUsPage />
        <Footer />
      </>
    ),
  },
  {
    path: "/features",
    element: (
      <>
        <MobileNavBar />
        <FeaturesPage />
      </>
    ),
  },
  {
    path: "/faqs",
    element: (
      <>
        <MobileNavBar />
        <FAQsPage />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <MobileNavBar />
        <LoginPage />
      </>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
