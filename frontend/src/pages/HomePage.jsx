import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Hero from '../components/home/Hero';
import CategoryCards from '../components/home/CategoryCards';
import StatsSection from '../components/home/StatsSection';
import HowItWorks from '../components/home/HowItWorks';
import FeaturedFundraisers from '../components/home/FeaturedFundraisers';
import TrustSection from '../components/home/TrustSection';
import ImpactSection from '../components/home/ImpactSection';

export default function HomePage({ openAuthModal }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <Hero openAuthModal={openAuthModal} />
        <CategoryCards />
        <StatsSection />
        <ImpactSection />
        <HowItWorks />
        <FeaturedFundraisers />
        <TrustSection />
      </main>

      <Footer />
    </div>
  );
}

