import { Navbar, Footer } from '../componenets';
import { FeaturesSection, HeroSection, HowItWorks, Testimonials } from '../sections'

const Homepage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default Homepage