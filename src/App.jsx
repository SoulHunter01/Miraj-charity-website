import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HowItWorksPage from './pages/HowItWorksPage';
import DiscoverPage from './pages/DiscoverPage';
import AboutPage from './pages/AboutPage';
import SupportPage from './pages/SupportPage';
import ImpactPage from './pages/ImpactPage';
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SignupStep2 from "./pages/SignupStep2";
import SignupPhotoPage from "./pages/SignupPhoto";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ForgotPasswordOtpPage from "./pages/ForgotPasswordOtpPage";
import ForgotPasswordNewPasswordPage from "./pages/ForgotPasswordNewPasswordPage";
import ForgotPasswordPhonePage from './pages/ForgotPasswordPhonePage';
import ForgotPasswordEmailPage from './pages/ForgotPasswordEmailPage';
import ProfilePage from './pages/ProfilePage';
import AccountSettingsPage from "./pages/settings/AccountSettingsPage";
import NotificationSettingsPage from "./pages/settings/NotificationSettingsPage";
import PrivacySettingsPage from "./pages/settings/PrivacySettingsPage";
import BalancePage from "./pages/BalancePage";
import DashboardPage from "./pages/DashboardPage";
import MyFundraisersPage from './pages/dashboard/MyFundraisersPage';
import FundraiserDetailPage from './pages/dashboard/FundraiserDetailPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/impact" element={<ImpactPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup2" element={<SignupStep2 />} />
        <Route path="/signup/photo" element={<SignupPhotoPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/forgot-password/otp" element={<ForgotPasswordOtpPage />} />
        <Route path="/forgot-password/new-password" element={<ForgotPasswordNewPasswordPage />} />
        <Route path="/forgot-password/phone" element={<ForgotPasswordPhonePage />} />
        <Route path="/forgot-password/email" element={<ForgotPasswordEmailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings/account" element={<AccountSettingsPage />} />
        <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
        <Route path="/settings/privacy" element={<PrivacySettingsPage />} />
        <Route path="/balance" element={<BalancePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/my-fundraisers" element={<MyFundraisersPage />} />
        <Route path="/dashboard/my-fundraisers/:fundraiserId" element={<FundraiserDetailPage />} />
      </Routes>
    </Router>
  );
}
