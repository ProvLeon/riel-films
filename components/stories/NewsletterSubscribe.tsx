import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Button } from "@/components/UI/Button";

const NewsletterSubscribe: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to subscribe the user
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <div className="relative bg-gradient-to-r from-film-black-900 to-film-black-800 dark:from-film-black-950 dark:to-film-black-900 rounded-2xl p-8 md:p-12 overflow-hidden shadow-lg">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-film-red-500 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-film-red-600 blur-3xl"></div>
      </div>

      <div className="relative max-w-3xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Stay Updated</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Subscribe to our newsletter for the latest stories, industry insights, and updates from Riel Films.
          </p>

          <AnimatePresence mode="wait">
            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-film-red-600/20 text-white p-4 rounded-xl backdrop-blur-sm"
              >
                <p className="text-lg font-medium">Thank you for subscribing!</p>
                <p className="text-sm text-gray-200 mt-1">
                  We've sent a confirmation email to your inbox.
                </p>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
                onSubmit={handleSubscribe}
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="px-6 py-4 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-white placeholder-gray-400 w-full sm:w-96 backdrop-blur-sm"
                />
                <Button
                  variant="primary"
                  type="submit"
                  className="sm:px-8 py-4 flex items-center justify-center"
                >
                  <Mail size={18} className="mr-2" />
                  Subscribe
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-gray-400 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default NewsletterSubscribe;
