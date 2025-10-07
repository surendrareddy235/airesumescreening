import { motion } from "framer-motion";
import { Quote, Star, Building, Users, Heart, Sparkles } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Patel",
    role: "Senior Recruiter",
    company: "InnovateX",
    feedback:
      "The accuracy and simplicity are incredible. The AI scoring saved our entire hiring week! We've increased our placement success rate by 85%.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Emily Chen",
    role: "Talent Acquisition Lead",
    company: "StartupHub",
    feedback:
      "Game-changer for our startup! We went from manually reviewing hundreds of resumes to having the top candidates highlighted instantly. Absolutely love it!",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    name: "Marcus Johnson",
    role: "VP of People",
    company: "ScaleUp Inc",
    feedback:
      "The bias reduction feature is outstanding. We're making more diverse, data-driven hiring decisions. ROI was positive within the first month.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    gradient: "from-orange-500 to-red-500",
  },
];

export default function Testimonials() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const renderStars = (rating) => {
    return Array.from({ length: rating }, (_, i) => (
      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    ));
  };

  return (
    <section
      id="testimonials"
      className="relative py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/10 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-gradient-to-r from-pink-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-gradient-to-l from-blue-400/10 to-cyan-600/10 rounded-full blur-3xl"></div>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-full border border-pink-200/50 dark:border-pink-700/50 mb-6">
            <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            <span className="text-sm font-medium text-pink-700 dark:text-pink-300">
              Customer Love
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-pink-900 to-purple-900 dark:from-white dark:via-pink-100 dark:to-purple-100 bg-clip-text text-transparent">
              What People
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Say About Us
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of HR professionals who have transformed their hiring
            process with ResumeAI. Here's what they have to say.
          </p>

          {/* Stats */}
          <div className="flex justify-center items-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Happy Customers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                4.9/5
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Average Rating
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                98%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Would Recommend
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="group relative"
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Testimonial Card */}
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                {/* Quote Icon */}
                <div className="absolute -top-4 left-8">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${testimonial.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-6 mt-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 text-lg italic">
                  "{testimonial.feedback}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-md"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r ${testimonial.gradient} rounded-full border-2 border-white dark:border-gray-800`}
                    ></div>
                  </div>

                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                      <Building className="w-3 h-3" />
                      {testimonial.company}
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${testimonial.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}
                ></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-6 px-8 py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Trusted by 10,000+ companies
              </span>
            </div>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                5M+ resumes processed
              </span>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <button className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105 transition-all duration-300">
            Join Our Happy Customers
            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
