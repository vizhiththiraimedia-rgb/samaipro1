import React, { useState, useEffect } from 'react';
import { useLanguage } from "@/components/providers/language-provider";
import { Card, CardContent } from "@/components/ui/card";
import { HERO_SLIDES } from "@/lib/home-data";

export function HeroSlider() {
  const { language, t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  // You can easily change the images here to your own by putting them in /public/img/
  // and changing 'image' to '/img/your-image.jpg'
  const slides = HERO_SLIDES;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Change slide every 6 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative overflow-hidden pt-16 pb-20 min-h-[550px] bg-black">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Image Background */}
          <div className="absolute inset-0">
            <img 
              src={slide.image} 
              alt="Slider Background" 
              className="w-full h-full object-cover"
            />
            {/* Dark overlay so text is readable */}
            <div className="absolute inset-0 bg-black/60 md:bg-black/50 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
          </div>

          <div className="container mx-auto px-4 relative h-full flex items-center">
            <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center gap-8">
              
              {/* Center text */}
              <div className="text-center pt-8">
                <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl ${language === 'si' ? 'elegant-sinhala' : 'font-serif'} text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200`} style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }}>
                  {language === 'si' ? slide.titleSi : slide.titleEn}
                </h1>
                <p className={`text-slate-200 text-lg md:text-xl font-medium mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md ${language === 'si' ? 'elegant-sinhala' : 'font-serif'}`}>
                  {language === 'si' ? slide.descSi : slide.descEn}
                </p>
              </div>

            </div>
          </div>
        </div>
      ))}
      
      {/* Slider Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 shadow-md ${
              currentSlide === index ? 'bg-amber-400 w-8' : 'bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
