import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Leaf, Award, Users, Factory, Truck, Package, Box, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const AboutUs = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  const navigateToContact = () => {
    navigate('/');
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/30">
          <div className="absolute inset-0 z-0">
            <div className="absolute left-0 bottom-0 w-96 h-96 rounded-full bg-purple-100/50 dark:bg-purple-900/20 blur-3xl"></div>
            <div className="absolute right-1/4 top-0 w-80 h-80 rounded-full bg-blue-100/50 dark:bg-blue-900/20 blur-3xl"></div>
            <div className="absolute right-0 bottom-1/3 w-64 h-64 rounded-full bg-green-100/30 dark:bg-green-900/20 blur-3xl"></div>
          </div>
          
          <div className="container-content relative z-10">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
                {t('aboutUs.title') || "Über Novacana"}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {t('aboutUs.subtitle') || "Unsere Leidenschaft für medizinisches Cannabis und unsere Expertise seit 2019"}
              </p>
            </motion.div>
          </div>
        </section>
        
        <section className="py-16 relative">
          <div className="container-content">
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.div className="space-y-6" variants={itemVariants}>
                <span className="inline-block text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
                  {t('aboutUs.story.badge') || "Unsere Geschichte"}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {t('aboutUs.story.title') || "Von der Vision zur Realität"}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {t('aboutUs.story.p1') || "Novacana wurde 2019 mit einer klaren Vision gegründet: Apotheken in ganz Deutschland mit hochwertigen medizinischen Cannabisprodukten zu versorgen."}
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {t('aboutUs.story.p2') || "Was als kleine Initiative begann, ist heute zu einem führenden pharmazeutischen Großhändler mit Teilsortiment Cannabis herangewachsen, der für Qualität, Zuverlässigkeit und Fachwissen steht."}
                </p>
                
                <div className="flex flex-wrap gap-3 mt-6">
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                    WDA
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    GDP
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                    MedCanG
                  </span>
                </div>
                
                <motion.div 
                  className="pt-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white group"
                    onClick={navigateToContact}
                  >
                    {t('aboutUs.story.cta') || "Kontaktiere uns"}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </motion.div>
              
              <motion.div className="relative" variants={itemVariants}>
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-200/30 to-blue-200/30 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl blur-xl transform rotate-2 scale-95"></div>
                <Card className="relative overflow-hidden border-0 shadow-xl hover:-translate-y-2 transition-all duration-500 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/50">
                  <img 
                    alt={t('aboutUs.established') || "Medizinisches Cannabis"} 
                    className="w-full h-auto object-cover aspect-video rounded-t-xl" 
                    onError={e => {
                      console.error("Image failed to load:", e);
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/800x400/gray/white?text=Medizinisches+Cannabis";
                    }} 
                    src="https://media.istockphoto.com/id/1175657274/photo/hospital-indoor-storage-room-health-center-repository.jpg?s=612x612&w=0&k=20&c=st6kLOWp84yP38IRStwApk7bOLuEpSaMIH13AlHCjqY=" 
                  />
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {t('aboutUs.established') || "Gegründet 2019"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('aboutUs.mission') || "Unsere Mission ist es, den Zugang zu hochwertigen medizinischen Cannabisprodukten für Patienten in ganz Deutschland zu verbessern."}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute left-1/4 bottom-0 w-80 h-80 rounded-full bg-blue-100/30 dark:bg-blue-900/10 blur-3xl"></div>
            <div className="absolute right-0 top-1/4 w-64 h-64 rounded-full bg-purple-100/30 dark:bg-purple-900/10 blur-3xl"></div>
          </div>
          
          <div className="container-content relative z-10">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {t('aboutUs.supplyChain.title') || "Unsere Supply Chain"}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {t('aboutUs.supplyChain.description') || "Jedes Produkt durchläuft einen sorgfältigen Prozess, um höchste Qualität zu gewährleisten"}
              </p>
            </motion.div>
            
            <motion.div 
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 overflow-hidden hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500"></div>
              
              <img 
                alt="Supply Chain" 
                className="w-full h-auto rounded-xl mb-8 hover:scale-[1.02] transition-transform duration-500" 
                onError={e => {
                  console.error("Supply Chain image failed to load:", e);
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/1200x600/gray/white?text=Supply+Chain";
                }}
                src="https://cannabis-apotheke.de/wp-content/uploads/gmp-farm-blog-cannabis-apotheke-1024x683.jpeg" 
              />
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={itemVariants} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 transform transition-transform group-hover:scale-110 group-hover:shadow-lg">
                    <Factory size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('aboutUs.supplyChain.production') || "Produktion"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('aboutUs.supplyChain.production.desc') || "Sorgfältige Auswahl von Premium-Cannabisproduzenten mit höchsten Qualitätsstandards"}
                  </p>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 transform transition-transform group-hover:scale-110 group-hover:shadow-lg">
                    <Package size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('aboutUs.supplyChain.quality') || "Qualitätskontrolle"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('aboutUs.supplyChain.quality.desc') || "Jedes Produkt durchläuft strenge Qualitätsprüfungen"}
                  </p>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-4 transform transition-transform group-hover:scale-110 group-hover:shadow-lg">
                    <Truck size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('aboutUs.supplyChain.delivery') || "Lieferung"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('aboutUs.supplyChain.delivery.desc') || "Sichere und schnelle Lieferung an Apotheken in ganz Deutschland"}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        <section className="py-16 relative">
          <div className="container-content">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {t('aboutUs.passion.title') || "Unsere Leidenschaft für Cannabis"}
            </motion.h2>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={itemVariants}>
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:shadow-green-200/50 dark:hover:shadow-green-900/30 h-full">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6 transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
                      <Leaf size={28} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {t('aboutUs.passion.quality.title') || "Höchste Qualitätsstandards"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('aboutUs.passion.quality.desc') || "Wir arbeiten nur mit Produzenten zusammen, die unsere strengen Qualitätsstandards erfüllen, um pharmazeutisch hochwertige Produkte zu garantieren."}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30 h-full">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
                      <Box size={28} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {t('aboutUs.passion.research.title') || "Forschung & Entwicklung"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('aboutUs.passion.research.desc') || "Wir investieren kontinuierlich in die Forschung, um unser Verständnis von Cannabis und seinen therapeutischen Eigenschaften zu vertiefen."}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 h-full">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
                      <Users size={28} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {t('aboutUs.passion.education.title') || "Bildung & Aufklärung"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('aboutUs.passion.education.desc') || "Wir setzen uns für die Aufklärung über die therapeutischen Vorteile von medizinischem Cannabis ein und teilen unser Wissen mit Apotheken und medizinischen Fachkräften."}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        <section className="py-16 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-900/20 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute left-0 top-0 w-96 h-96 rounded-full bg-green-100/30 dark:bg-green-900/10 blur-3xl"></div>
            <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-blue-100/30 dark:bg-blue-900/10 blur-3xl"></div>
          </div>
          
          <div className="container-content relative z-10">
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-xl p-8 md:p-12 mb-24 border border-white/30 dark:border-white/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                {t('aboutUs.terpenes.title') || "Unsere Expertise: Terpene in Cannabis"}
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                {t('aboutUs.terpenes.intro') || "Terpene sind aromatische Verbindungen, die dem Cannabis seinen charakteristischen Geruch verleihen und entscheidend zu seinen therapeutischen Eigenschaften beitragen. Bei Novacana haben wir ein besonderes Augenmerk auf das Terpen-Profil unserer Produkte."}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <motion.div 
                  className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1)" }}
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {t('aboutUs.terpenes.benefits.title') || "Therapeutische Vorteile"}
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <CheckCircle size={20} className="text-purple-600 dark:text-purple-400 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {t('aboutUs.terpenes.benefits.1') || "Myrcen – bekannt für seine beruhigenden und muskelentspannenden Eigenschaften"}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={20} className="text-purple-600 dark:text-purple-400 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {t('aboutUs.terpenes.benefits.2') || "Limonen – kann Stimmung verbessern und hat antibakterielle Eigenschaften"}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={20} className="text-purple-600 dark:text-purple-400 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {t('aboutUs.terpenes.benefits.3') || "Pinen – kann Entzündungen reduzieren und die Atemwege öffnen"}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={20} className="text-purple-600 dark:text-purple-400 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {t('aboutUs.terpenes.benefits.4') || "Linalool – bekannt für seine beruhigenden und angstlösenden Eigenschaften"}
                      </span>
                    </li>
                  </ul>
                </motion.div>
                
                <motion.div 
                  className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {t('aboutUs.terpenes.entourage.title') || "Der Entourage-Effekt"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {t('aboutUs.terpenes.entourage.desc') || "Unsere Expertise liegt im Verständnis des 'Entourage-Effekts' – wie Cannabinoide und Terpene zusammenwirken, um therapeutische Wirkungen zu verstärken. Durch sorgfältige Analyse und Auswahl bieten wir Produkte mit optimalen Terpen-Profilen für verschiedene medizinische Anwendungen."}
                  </p>
                  <div className="flex items-center mt-4">
                    <Award size={20} className="text-amber-500 dark:text-amber-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {t('aboutUs.terpenes.expertise') || "Spezialisiert auf terpenreiche Cannabissorten"}
                    </span>
                  </div>
                </motion.div>
              </div>
              
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('aboutUs.terpenes.conclusion') || "Durch unser tiefgreifendes Verständnis der Terpene können wir Apotheken und Ärzten dabei helfen, die am besten geeigneten Cannabisprodukte für die individuellen Bedürfnisse ihrer Patienten auszuwählen."}
              </p>
            </motion.div>
          </div>
        </section>
        
        <section className="py-16 relative">
          <div className="container-content">
            <motion.div 
              className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 p-12 rounded-3xl max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {t('features.cta.title')}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                {t('features.cta.description')}
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-6 rounded-full group"
                onClick={navigateToContact}
              >
                {t('aboutUs.story.cta') || "Kontaktiere uns"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
