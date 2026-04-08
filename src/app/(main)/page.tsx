'use client'
import HeroSection from './components/Herosection'
import TeamSection from './Teamsection'

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <HeroSection />
      <CategoriesSection />
      <FeaturedServicesSection />
      <HowItWorksSection />
      <TeamSection
        title="Our Best Team"
        subtitle="Meet our dedicated government office staff"
        members={[
          {
            id: 1,
            name: 'Md. Rafiqul Islam',
            designation: 'Director General',
            department: 'Administration',
            office: 'Dhaka HQ',
            email: 'rafiqul@gov.bd',
            phone: '+880 1700-000001',
            color: 'blue',
          },
          {
            id: 2,
            name: 'Fatema Khanam',
            designation: 'Deputy Secretary',
            department: 'Finance',
            office: 'Chattogram',
            email: 'fatema@gov.bd',
            phone: '+880 1700-000054',
          },
          {
            id: 3,
            name: 'Redima Rahman Mou',
            designation: 'Deputy Secretary',
            department: 'Human Resources',
            office: 'Dhaka',
            email: 'redima@gov.bd',
            phone: '+880 1700-0054009',
          },
        ]}
      />
      <CTASection />
    </div>
  )
}