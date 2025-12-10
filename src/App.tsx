import { Routes, Route } from "react-router-dom";
import Navbar from "./components/header/Navbar";
import Footer from "./components/footer/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import WalkInsPage from "./pages/Walkins";
import CompaniesPage from "./pages/CompaniesPage";
import JobsPage from "./pages/JobsPage";
import ResumeBuilder from "./pages/ResumeBuilder";
import ATSChecker from "./pages/ATSChecker";
import InterviewPrep from "./pages/InterviewPrep";
import SalaryCalculator from "./pages/SalaryCalculator";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="grow p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/walkin" element={<WalkInsPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/tools/resume-builder" element={<ResumeBuilder />} />
          <Route path="/tools/ats-checker" element={<ATSChecker/>} />
          <Route path="/tools/interview-prep" element={<InterviewPrep />} />
          <Route path="/tools/salary-calculator" element={<SalaryCalculator />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verifyemailpage" element={<VerifyEmailPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
