import React, { useState, useEffect } from 'react';

interface Section {
  id: string;
  title: string;
}

interface SparkleProps {
  scrollProgress: number;
}

interface ScrollProgressNavProps {
  sections?: Section[];
  className?: string;
}

const defaultSections: Section[] = [
  { id: 'section1', title: 'Introduzione' },
  { id: 'section2', title: 'Caratteristiche' },
  { id: 'section3', title: 'Servizi' },
  { id: 'section4', title: 'Contatti' }
];

const Sparkle: React.FC<SparkleProps> = ({ scrollProgress }) => (
  <div className="absolute w-full">
    <div className="absolute top-0 left-0 w-full h-6 overflow-hidden">
      <div 
        className="absolute top-0 left-0 w-2 h-2 bg-darkPurple rounded-full 
                   animate-pulse opacity-50 transform -translate-y-full
                   animate-sparkle" 
        style={{
          animation: 'sparkle 2s ease-in-out infinite',
          top: `${scrollProgress}%`
        }}
      />
    </div>
  </div>
);

const ScrollProgressNav: React.FC<ScrollProgressNavProps> = ({ 
  sections = defaultSections,
  className = ''
}) => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollTop = window.scrollY;
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const totalDocScrollLength = docHeight - winHeight;
      const scrollPosition = Math.floor((scrollTop / totalDocScrollLength) * 100);
      setScrollProgress(scrollPosition);

      sections.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= winHeight / 3 && rect.bottom >= winHeight / 3) {
            setActiveSection(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed left-8 top-1/2 -translate-y-1/2 flex items-center gap-6 ${className}`}>
      <div className="relative">
        {/* Linea di progresso con effetto sparkle */}
        <div className="relative w-0.5 h-64 bg-gray-200">
          <div 
            className="absolute top-0 left-0 w-full bg-darkPurple transition-all duration-300"
            style={{ height: `${scrollProgress}%` }}
          />
          <Sparkle scrollProgress={scrollProgress} />
        </div>

        {/* Pallini delle sezioni */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col h-full justify-between">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="relative"
            >
              <button
                onClick={() => scrollToSection(section.id)}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 
                          ${index <= activeSection 
                            ? 'border-darkPurple bg-darkPurple scale-125' 
                            : 'border-gray-300 bg-white'
                          }`}
                aria-label={`Scorri alla sezione ${section.title}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Titoli delle sezioni sempre visibili */}
      <div className="flex flex-col justify-between h-64">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`text-left transition-all duration-300 hover:text-darkPurple
                      ${index === activeSection 
                        ? 'text-darkPurple text-lg font-medium scale-105 origin-left' 
                        : 'text-gray-600 text-base'
                      }`}
          >
            {section.title}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default ScrollProgressNav;