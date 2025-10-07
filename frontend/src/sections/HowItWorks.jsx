import { motion } from "framer-motion";
import { Upload, Brain, BarChart3, ArrowRight, CheckCircle, Sparkles } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    { 
      step: "Upload Resume", 
      desc: "Drag and drop multiple resumes or upload from your device. Supports PDF, DOC, and DOCX formats.",
      icon: Upload,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      darkBgGradient: "from-blue-900/20 to-cyan-900/20"
    },
    { 
      step: "AI Screening", 
      desc: "Our advanced AI model analyzes experience, skills, education, and matches against job requirements.",
      icon: Brain,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      darkBgGradient: "from-purple-900/20 to-pink-900/20"
    },
    { 
      step: "Get Insights", 
      desc: "View ranked candidates with detailed scoring, insights, and recommendations for next steps.",
      icon: BarChart3,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      darkBgGradient: "from-green-900/20 to-emerald-900/20"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 0.8, delay: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section id="how" className="relative py-24 bg-gradient-to-br from-white via-gray-50 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/10 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -left-20 w-40 h-40 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-40 h-40 bg-gradient-to-l from-purple-400/10 to-pink-600/10 rounded-full blur-2xl"></div>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full border border-purple-200/50 dark:border-purple-700/50 mb-6">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Simple Process
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 dark:from-white dark:via-purple-100 dark:to-pink-100 bg-clip-text text-transparent">
              How It
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Get started in minutes with our intuitive three-step process. 
            No technical expertise required - just upload and let AI do the work.
          </p>
        </motion.div>

        {/* Steps Container */}
        <motion.div 
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Desktop Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 dark:from-blue-800 dark:via-purple-800 dark:to-green-800 transform -translate-y-1/2 z-0">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 origin-left"
              variants={lineVariants}
            />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="group relative"
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step Card */}
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 left-8">
                    <div className={`relative w-12 h-12 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"></div>
                    </div>
                  </div>

                  {/* Icon Container */}
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${step.bgGradient} dark:bg-gradient-to-r dark:${step.darkBgGradient} rounded-3xl mb-8 mt-4 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className={`w-10 h-10 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`} />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {step.step}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                      {step.desc}
                    </p>

                    {/* Feature List */}
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Quick & Easy</span>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
                </div>

                {/* Mobile Arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-6 mb-2">
                    <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Stats Section */}
        <motion.div 
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {[
            { value: "3", label: "Simple Steps" },
            { value: "< 5min", label: "Setup Time" },
            { value: "100+", label: "Resumes/Batch" },
            { value: "95%", label: "Accuracy Rate" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <button className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300">
            Start Your Free Trial
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
