import { motion } from "framer-motion";
import { Brain, FileText, BarChart3, Zap, Shield, Clock, ArrowRight, Sparkles } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    desc: "Advanced NLP algorithms analyze resumes instantly, providing intelligent candidate matching scores with 95% accuracy.",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    darkBgGradient: "from-blue-900/20 to-cyan-900/20"
  },
  {
    icon: FileText,
    title: "Smart Parsing",
    desc: "Automatically extract experience, skills, education, and certifications with precision parsing technology.",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
    darkBgGradient: "from-purple-900/20 to-pink-900/20"
  },
  {
    icon: BarChart3,
    title: "Dashboard Analytics",
    desc: "Real-time hiring metrics, performance insights, and comprehensive analytics to optimize your recruitment process.",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
    darkBgGradient: "from-green-900/20 to-emerald-900/20"
  },
  // {
  //   icon: Zap,
  //   title: "Lightning Fast",
  //   desc: "Process hundreds of resumes in seconds. Our optimized algorithms ensure rapid screening without compromising quality.",
  //   gradient: "from-yellow-500 to-orange-500",
  //   bgGradient: "from-yellow-50 to-orange-50",
  //   darkBgGradient: "from-yellow-900/20 to-orange-900/20"
  // },
  // {
  //   icon: Shield,
  //   title: "Data Security",
  //   desc: "Enterprise-grade security with end-to-end encryption, GDPR compliance, and secure data handling protocols.",
  //   gradient: "from-indigo-500 to-purple-500",
  //   bgGradient: "from-indigo-50 to-purple-50",
  //   darkBgGradient: "from-indigo-900/20 to-purple-900/20"
  // },
  // {
  //   icon: Clock,
  //   title: "Save 90% Time",
  //   desc: "Reduce manual screening time from hours to minutes. Focus on interviewing the best candidates, not sorting resumes.",
  //   gradient: "from-red-500 to-pink-500",
  //   bgGradient: "from-red-50 to-pink-50",
  //   darkBgGradient: "from-red-900/20 to-pink-900/20"
  // },
];

export default function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="features" className="relative py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/10 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-gradient-to-l from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full border border-blue-200/50 dark:border-blue-700/50 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Powerful Features
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              Why Choose
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              ResumeAI?
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform your hiring process with cutting-edge AI technology designed to 
            identify top talent faster and more accurately than ever before.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Card Background with Gradient Border */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 h-full`}>
                {/* Icon Container */}
                <div className={`relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.bgGradient} dark:bg-gradient-to-r dark:${feature.darkBgGradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`} />
                  
                  {/* Floating sparkle effect */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.desc}
                  </p>

                  {/* Learn More Link */}
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <button className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300">
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-semibold rounded-full border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              View All Features
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
