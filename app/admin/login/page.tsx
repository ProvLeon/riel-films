"use client";
import React, { useState, useEffect } from "react"; // Added useEffect
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/Button";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { Mail, Lock, AlertCircle } from "lucide-react"; // Added AlertCircle
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { login, loginWithGoogle, user, isLoading: authLoading } = useAuth(); // Use authLoading
  const router = useRouter();

  // Redirect if already logged in (check after auth state is resolved)
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/admin/dashboard");
    }
  }, [user, authLoading, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (!success) {
        setError("Invalid email or password. Please try again.");
      }
      // Success redirects via session update effect in AuthProvider/useSession
    } catch (error: any) {
      setError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError("");
    try {
      await loginWithGoogle();
      // Redirection handled by next-auth callbackUrl
    } catch (error: any) {
      setError(error.message || "Google Sign-In failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  // If auth is still loading, show spinner
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-film-black-950 dark:via-film-black-900 dark:to-film-black-950 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // If user exists, don't render login form (redirect will happen)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-film-black-950 dark:via-film-black-900 dark:to-film-black-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white dark:bg-film-black-900 rounded-2xl shadow-2xl max-w-md w-full p-8 md:p-10 border border-gray-100 dark:border-film-black-800"
      >
        <div className="text-center mb-8">
          {/* Logo with light/dark mode handling */}
          <div className="relative h-16 mx-auto w-48 mb-4">
            <Image
              src="/logo_light_bg.png" // Logo for light background
              alt="Riel Films Logo"
              fill
              className="object-contain dark:hidden"
              priority
            />
            <Image
              src="/logo_dark_bg.png" // Logo for dark background
              alt="Riel Films Logo"
              fill
              className="object-contain hidden dark:block"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-film-black-900 dark:text-white">Admin Portal</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
            Sign in to access the Riel Films dashboard.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-3 rounded-lg mb-5 text-sm border border-red-200 dark:border-red-800/50 flex items-center"
          >
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-5">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-film-black-800 border border-gray-200 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 focus:border-transparent text-gray-800 dark:text-white placeholder-gray-400"
                placeholder="Email address"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-film-black-800 border border-gray-200 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 focus:border-transparent text-gray-800 dark:text-white placeholder-gray-400"
                placeholder="Password"
                required
                autoComplete="current-password"
              />
            </div>
            {/* Optional: Forgot password link */}
            {/* <div className="text-right mt-2">
              <a href="#" className="text-sm text-film-red-600 dark:text-film-red-500 hover:underline">Forgot password?</a>
            </div> */}
          </div>

          {/* Submit Button */}
          <Button
            variant="primary"
            type="submit"
            className="w-full py-3 text-base"
            disabled={isLoading}
            isLoading={isLoading}
          >
            {!isLoading && "Sign In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-film-black-900 text-gray-500 dark:text-gray-400">
                Or
              </span>
            </div>
          </div>

          {/* Google Sign-In */}
          <div className="mt-6">
            <Button
              variant="secondary"
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 border-gray-300 dark:border-film-black-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-film-black-800"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              isLoading={isGoogleLoading} // Use isLoading prop on Button
            >
              {!isGoogleLoading && <FcGoogle className="h-5 w-5" />}
              {!isGoogleLoading && "Sign in with Google"}
            </Button>
          </div>

          {/* Contact Admin Link */}
          <div className="mt-8 text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Need access?{" "}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  alert("Please contact the site administrator to request access or create an account.");
                }}
                className="font-medium text-film-red-600 dark:text-film-red-500 hover:underline focus:outline-none"
              >
                Contact Admin
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
