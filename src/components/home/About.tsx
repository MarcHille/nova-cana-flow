
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
const About = () => {
  const {
    t
  } = useLanguage();
  return <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute right-0 bottom-1/3 w-96 h-96 rounded-full bg-purple-100/80 dark:bg-purple-900/20 blur-3xl"></div>
        <div className="absolute left-1/4 top-1/4 w-72 h-72 rounded-full bg-blue-100/50 dark:bg-blue-900/20 blur-3xl"></div>
      </div>

      <div className="container-content relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-200/40 to-blue-200/40 dark:from-purple-800/30 dark:to-blue-800/30 rounded-3xl blur-xl transform rotate-3 scale-95"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl transform transition-all duration-500 hover:scale-[1.02] hover:-rotate-1">
                <img alt={t('aboutUs.supplyChain.title')} className="w-full h-auto object-cover" onError={e => {
                console.error("Image failed to load:", e);
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/1170x640/gray/white?text=Supply+Chain";
              }} src="/lovable-uploads/fadfb4e3-c435-4eb1-8028-555c909db39d.jpg" />
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {t('aboutUs.supplyChain.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base mb-6">
                    {t('aboutUs.supplyChain.description')}
                  </p>
                  <div className="pt-2 flex justify-between items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400 inline-block rounded-full px-4 py-1.5 bg-purple-50 dark:bg-purple-900/30">
                      {t('about.card.established')}
                    </div>
                    <div className="flex space-x-4">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">WDA</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full">GDP</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full">MedCanG</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="inline-block animate-fade-in text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text mb-2">
              {t('about.badge')}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in leading-tight" style={{
            animationDelay: "0.1s"
          }}>
              {t('about.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 animate-fade-in leading-relaxed" style={{
            animationDelay: "0.2s"
          }}>
              {t('about.description')}
            </p>
            
            <div className="space-y-6 mb-10 animate-fade-in" style={{
            animationDelay: "0.3s"
          }}>
              <div className="flex items-start group bg-white dark:bg-gray-800/50 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl text-purple-600 dark:text-purple-400 mr-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{t('about.quality')}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('about.quality.desc')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start group bg-white dark:bg-gray-800/50 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 dark:text-blue-400 mr-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{t('about.expertise')}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('about.expertise.desc')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start group bg-white dark:bg-gray-800/50 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-xl text-teal-600 dark:text-teal-400 mr-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{t('about.reliability')}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('about.reliability.desc')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in" style={{
            animationDelay: "0.4s"
          }}>
              <Link to="/about">
                <Button size="lg" variant="gradient" rounded="full" className="group">
                  {t('about.button')}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default About;
