import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import CustomCursor from '@/components/ui/CustomCursor'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import SkillsSection from '@/components/sections/SkillsSection'
import BlogSection from '@/components/sections/BlogSection'
import ContactSection from '@/components/sections/ContactSection'

export default function App() {
  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      <CustomCursor />
      <Navbar />

      <main>
        <HeroSection />

        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AboutSection />
          <ProjectsSection />
          <SkillsSection />
          <BlogSection />
          <ContactSection />
        </div>
      </main>

      <Footer />
    </div>
  )
}
