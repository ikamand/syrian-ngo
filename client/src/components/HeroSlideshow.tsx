import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroCommunity from "@/assets/images/hero-community.png";
import heroDamascus from "@/assets/images/hero-damascus.png";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    image: heroDamascus,
    title: "منصة إدارة المنظمات غير الحكومية",
    subtitle: "النظام الموحد لتسجيل ومتابعة المنظمات والجمعيات الأهلية في الجمهورية العربية السورية"
  },
  {
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2074&auto=format&fit=crop",
    title: "شفافية ومصداقية في العمل الأهلي",
    subtitle: "نسعى لتعزيز العمل التطوعي والخيري من خلال منظومة رقمية متكاملة"
  },
  {
    image: heroCommunity,
    title: "دعم المجتمع المحلي",
    subtitle: "تواصل مباشر بين الجهات المانحة والمنظمات لتحقيق أثر أكبر"
  }
];

export function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section 
      className="relative h-[500px] md:h-[600px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/50 to-black/70" />
          
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <div className="max-w-3xl text-white text-right mr-auto">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
                {slide.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 text-white"
        onClick={nextSlide}
        data-testid="button-slide-next"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 text-white"
        onClick={prevSlide}
        data-testid="button-slide-prev"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 transition-all ${
              index === currentSlide ? "bg-white w-8" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
            data-testid={`button-slide-indicator-${index}`}
          />
        ))}
      </div>
    </section>
  );
}
