import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import ConfirmModal from "./components/ConfirmModale";

// pages
import HomePage from "./pages/HomePage";
import HowItWorksPage from "./pages/HowItWorksPage";
import DiscoverPage from "./pages/DiscoverPage";
import AboutPage from "./pages/AboutPage";
import SupportPage from "./pages/SupportPage";
import ImpactPage from "./pages/ImpactPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SignupStep2 from "./pages/SignupStep2";
import SignupPhotoPage from "./pages/SignupPhoto";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ForgotPasswordOtpPage from "./pages/ForgotPasswordOtpPage";
import ForgotPasswordNewPasswordPage from "./pages/ForgotPasswordNewPasswordPage";
import ForgotPasswordPhonePage from "./pages/ForgotPasswordPhonePage";
import ForgotPasswordEmailPage from "./pages/ForgotPasswordEmailPage";
import ProfilePage from "./pages/ProfilePage";
import AccountSettingsPage from "./pages/settings/AccountSettingsPage";
import NotificationSettingsPage from "./pages/settings/NotificationSettingsPage";
import PrivacySettingsPage from "./pages/settings/PrivacySettingsPage";
import BalancePage from "./pages/BalancePage";
import DashboardPage from "./pages/DashboardPage";
import MyFundraisersPage from "./pages/dashboard/MyFundraisersPage";
import FundraiserDetailPage from "./pages/dashboard/FundraiserDetailPage";
import EditFundraiserPage from "./pages/dashboard/EditFundraiserPage";
import MyDonationsPage from "./pages/dashboard/MyDonationsPage";

import FundraiserCategory from "./pages/fundraiser/FundraiserCategory";
import StartFundraiserDetails from "./pages/fundraiser/StartFundraiserDetails";
import FundraiserBasic from "./pages/fundraiser/FundraiserBasic";
import FundraiserDetails from "./pages/fundraiser/FundraiserDetails";
import LinkPreviousFundraiser from "./pages/fundraiser/LinkPreviousFundraiser";
import FundraiserPayout from "./pages/fundraiser/FundraiserPayout";

export default function App() {
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "OK",
    onConfirm: null,
  });

  // 🔑 call this from anywhere (Navbar, Start Here page, etc.)
  const openAuthModal = ({ title, message, confirmText = "Go to Sign Up", onConfirm }) => {
    setModal({
      open: true,
      title,
      message,
      confirmText,
      onConfirm,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, open: false }));
  };

  return (
    <Router>
      {/* Global modal */}
      <ConfirmModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        confirmText={modal.confirmText}
        onConfirm={modal.onConfirm}
        onClose={closeModal}
      />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<HomePage openAuthModal={openAuthModal} />} />
        <Route path="/how-it-works" element={<HowItWorksPage openAuthModal={openAuthModal} />} />
        <Route path="/discover" element={<DiscoverPage openAuthModal={openAuthModal} />} />
        <Route path="/about" element={<AboutPage openAuthModal={openAuthModal} />} />
        <Route path="/support" element={<SupportPage openAuthModal={openAuthModal} />} />
        <Route path="/impact" element={<ImpactPage openAuthModal={openAuthModal} />} />
        <Route path="/contact" element={<ContactPage openAuthModal={openAuthModal} />} />
        <Route path="/faq" element={<FAQPage openAuthModal={openAuthModal} />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup2" element={<SignupStep2 />} />
        <Route path="/signup/photo" element={<SignupPhotoPage />} />

        {/* Forgot password */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/forgot-password/otp" element={<ForgotPasswordOtpPage />} />
        <Route path="/forgot-password/new-password" element={<ForgotPasswordNewPasswordPage />} />
        <Route path="/forgot-password/phone" element={<ForgotPasswordPhonePage />} />
        <Route path="/forgot-password/email" element={<ForgotPasswordEmailPage />} />

        {/* Fundraiser start flow */}
        <Route path="/fundraisers/category" element={<FundraiserCategory />} />
        <Route path="/fundraisers/:fundraiserId/start" element={<StartFundraiserDetails />} />
        <Route path="/fundraisers/:fundraiserId/basic" element={<FundraiserBasic />} />
        <Route path="/fundraisers/:fundraiserId/details" element={<FundraiserDetails />} />
        <Route path="/fundraisers/:fundraiserId/link-previous" element={<LinkPreviousFundraiser />} />
        <Route path="/fundraisers/:fundraiserId/payout" element={<FundraiserPayout />} />

        {/* User */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings/account" element={<AccountSettingsPage />} />
        <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
        <Route path="/settings/privacy" element={<PrivacySettingsPage />} />
        <Route path="/balance" element={<BalancePage />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/my-fundraisers" element={<MyFundraisersPage />} />
        <Route path="/dashboard/my-fundraisers/:fundraiserId/" element={<FundraiserDetailPage />} />
        <Route path="/dashboard/my-fundraisers/:fundraiserId/edit" element={<EditFundraiserPage />} />
        <Route path="/dashboard/my-donations" element={<MyDonationsPage />} />
      </Routes>
    </Router>
  );
}
