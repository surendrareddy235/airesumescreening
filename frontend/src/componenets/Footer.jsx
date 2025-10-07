import { motion } from "framer-motion";
import { 
  Zap, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github, 
  Facebook,
  ArrowRight,
  Heart,
  Shield,
  Users,
  Star
} from "lucide-react";

export default function Footer() {
  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "How it Works", href: "#how" },
      { name: "Pricing", href: "#pricing" },
      { name: "API Documentation", href: "#" },
      { name: "Integrations", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Press Kit", href: "#" },
      { name: "Contact", href: "#" },
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Documentation", href: "#" },
      { name: "Community", href: "#" },
      { name: "Status Page", href: "#" },
      { name: "Bug Reports", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "GDPR", href: "#" },
      { name: "Security", href: "#" },
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: "#", name: "Twitter", color: "hover:text-blue-400" },
    { icon: Linkedin, href: "#", name: "LinkedIn", color: "hover:text-blue-600" },
    { icon: Github, href: "#", name: "GitHub", color: "hover:text-gray-600 dark:hover:text-gray-300" },
    { icon: Facebook, href: "#", name: "Facebook", color: "hover:text-blue-500" },
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900 dark:from-gray-950 dark:via-gray-950 dark:to-blue-950 text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-l from-purple-500/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Top Section */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
            variants={itemVariants}
          >
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ResumeAI
                </h2>
              </div>
              
              <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
                Transform your hiring process with AI-powered resume screening. 
                Join thousands of companies who trust ResumeAI to find the best talent faster.
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-gray-300">10,000+ Companies</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-300">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-300">SOC 2 Certified</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span>hello@resumeai.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="lg:pl-12">
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-gray-300 mb-6">
                Get the latest updates on new features, hiring trends, and AI innovations.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                    <span className="hidden sm:inline">Subscribe</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  No spam. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Links Section */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
            variants={itemVariants}
          >
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div 
            className="border-t border-white/10 pt-8"
            variants={itemVariants}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Copyright */}
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-sm">
                  © {new Date().getFullYear()} ResumeAI. Made with
                </span>
                <Heart className="w-4 h-4 text-red-400 fill-current" />
                <span className="text-sm">
                  in San Francisco
                </span>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`p-2 bg-white/10 backdrop-blur-sm rounded-lg text-gray-300 ${social.color} transform hover:scale-110 transition-all duration-300`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
