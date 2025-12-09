import { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FAQSection from '../components/FAQSection';
import { Brain, Mic, Eye, Shield, Clock, Zap, Heart, Users, Lock, Smartphone, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';
import Lenis from 'lenis';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Smooth Scroll Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Initial scroll reset
    window.scrollTo(0, 0);
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    return () => {
      lenis.destroy();
    };
  }, []);

  // Parallax hook
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans">
      <Navbar />

      {/* Hero Section */}
      <section id="overview" className="relative pt-32 pb-20 px-4 md:px-6 lg:px-8 min-h-[90vh] flex flex-col justify-center overflow-hidden">
        {/* Abstract Background Element */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-linear-to-b from-indigo-50/50 to-purple-50/50 blur-3xl -z-10"
        />

        <motion.div
          style={{ y: heroY, opacity: opacityHero }}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-8"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]"
            >
              A new species of<br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-900 via-indigo-900 to-gray-900">
                smart glasses.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              MindTrace integrates seamlessly with your Ray-Ban Meta to whisper names, reminders, and context directly into your ear.
            </motion.p>

            <motion.div variants={fadeInUp}>
              <button
                onClick={() => navigate('/login')}
                className="group relative bg-gray-900 text-white px-10 py-4 rounded-full font-medium text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95"
              >
                <span className="relative z-10">Join the Waitlist</span>
                <div className="absolute inset-0 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
              </button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-400"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </section>

      {/* Product Image Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-50 perspective-1000">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, rotateX: 20, y: 100 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden shadow-2xl group cursor-default bg-black"
          >
            <img
              src="https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?q=80&w=2912&auto=format&fit=crop"
              alt="Smart glasses technology"
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80" />

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative bg-white/5 backdrop-blur-xl px-16 py-12 rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.3)] overflow-hidden group-hover:bg-white/10 transition-all duration-500 hover:border-white/20"
              >
                <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />

                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-6 backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <span className="text-xs font-bold text-indigo-200 tracking-[0.2em] uppercase">System Online</span>
                  </div>
                  <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl mb-2">
                    Your External<br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-white to-white/70">Memory.</span>
                  </h3>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlight 1 */}
      <section className="py-32 px-4 md:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1"
          >
            <div className="aspect-square bg-linear-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center transform hover:rotate-2 transition-transform duration-500">
              <Eye className="h-40 w-40 text-indigo-600 drop-shadow-xl" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="feature-content order-1 md:order-2"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Never forget a face.
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              MindTrace uses advanced visual recognition to identify people and objects instantly, whispering their names and relevant details directly into your ear.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 group">
                <div className="bg-indigo-100 p-2 rounded-lg group-hover:bg-indigo-600 transition-colors duration-300">
                  <Zap className="h-5 w-5 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Instant Recognition</h4>
                  <p className="text-gray-600">Identifies people in milliseconds</p>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="bg-indigo-100 p-2 rounded-lg group-hover:bg-indigo-600 transition-colors duration-300">
                  <Lock className="h-5 w-5 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Privacy First</h4>
                  <p className="text-gray-600">All data encrypted and stored locally</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlight 2 */}
      <section className="py-32 px-4 md:px-6 lg:px-8 bg-gray-50 overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Whisper Assist.
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Get answers and assistance without ever looking at a screen. Simply ask, and MindTrace whispers back the information you need.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 group">
                <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-600 transition-colors duration-300">
                  <Mic className="h-5 w-5 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Voice Activated</h4>
                  <p className="text-gray-600">Natural conversation with AI</p>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-600 transition-colors duration-300">
                  <Brain className="h-5 w-5 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Context Aware</h4>
                  <p className="text-gray-600">Understands your situation and needs</p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="aspect-square bg-linear-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center transform hover:-rotate-2 transition-transform duration-500">
              <Mic className="h-40 w-40 text-purple-600 drop-shadow-xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlight 3 */}
      <section className="py-32 px-4 md:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1"
          >
            <div className="aspect-square bg-linear-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center transform hover:rotate-2 transition-transform duration-500">
              <Shield className="h-40 w-40 text-emerald-600 drop-shadow-xl" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="feature-content order-1 md:order-2"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Safety Net.
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Automatic location sharing and emergency features provide peace of mind for you and your loved ones.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 group">
                <div className="bg-emerald-100 p-2 rounded-lg group-hover:bg-emerald-600 transition-colors duration-300">
                  <Heart className="h-5 w-5 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Emergency Mode</h4>
                  <p className="text-gray-600">Quick access to emergency contacts</p>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="bg-emerald-100 p-2 rounded-lg group-hover:bg-emerald-600 transition-colors duration-300">
                  <Users className="h-5 w-5 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Location Sharing</h4>
                  <p className="text-gray-600">Share your location with trusted contacts</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Supercharge your daily life with real-time AI assistance
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: Eye, title: "Visual Recognition", desc: "Identifies people and objects instantly", bg: "bg-indigo-100", text: "text-indigo-600" },
              { icon: Mic, title: "Voice Assistant", desc: "Get answers without looking at a screen", bg: "bg-purple-100", text: "text-purple-600" },
              { icon: Shield, title: "Safety Features", desc: "Automatic location sharing for peace of mind", bg: "bg-emerald-100", text: "text-emerald-600" },
              { icon: Clock, title: "Smart Reminders", desc: "Never miss an important moment", bg: "bg-blue-100", text: "text-blue-600" },
              { icon: Smartphone, title: "App Integration", desc: "Seamlessly connects with your digital life", bg: "bg-pink-100", text: "text-pink-600" },
              { icon: Lock, title: "Privacy First", desc: "End-to-end encryption and local storage", bg: "bg-gray-100", text: "text-gray-600" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors shadow-xs hover:shadow-xl group"
              >
                <div className={`${feature.bg} ${feature.text} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section id="support" className="py-32 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Technical Specifications
            </h2>
            <p className="text-xl text-gray-600">Everything you need to know</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            {[
              { label: "Compatibility", value: "Ray-Ban Meta Smart Glasses" },
              { label: "Connectivity", value: "Bluetooth 5.2" },
              { label: "Battery Life", value: "Up to 12 hours" },
              { label: "Voice Recognition", value: "Multi-language support" },
              { label: "Storage", value: "Encrypted local storage" },
              { label: "Updates", value: "Over-the-air updates" },
              { label: "Platform", value: "iOS 15+ and Android 11+" },
              { label: "Privacy", value: "End-to-end encryption" }
            ].map((spec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex justify-between items-center py-4 border-b border-gray-200"
              >
                <span className="text-gray-600 font-medium">{spec.label}</span>
                <span className="text-gray-900 font-semibold text-right">{spec.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <section className="py-32 px-4 md:px-6 lg:px-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center text-black"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
            Ready to upgrade<br />your memory?
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join the waitlist today and be the first to experience MindTrace.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-900 text-white px-12 py-5 rounded-full hover:bg-gray-800 transition-colors font-semibold text-lg shadow-2xl hover:shadow-3xl"
          >
            Join the Waitlist
          </motion.button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
