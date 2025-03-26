"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/Button";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, loginWithGoogle, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.push("/admin/dashboard");
    }
  }, [user, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);

      if (success) {
        router.push("/admin/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (error: any) {
      setError(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-film-black-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-film-black-900 rounded-xl shadow-lg max-w-md w-full p-8"
      >
        <div className="text-center mb-6">
          <div className="relative h-16 mx-auto w-48 mb-4">
            <Image
              src="/logo_foot.png"
              alt="Riel Films Logo"
              fill
              className="object-contain dark:hidden"
            />
            <Image
              src="/logo_dark_bg.png"
              alt="Riel Films Logo"
              fill
              className="object-contain hidden dark:block"
            />
          </div>
          <h1 className="text-2xl font-bold text-film-black-900 dark:text-white">Admin Login</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sign in to access the admin dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                required
              />
            </div>
          </div>

          <Button
            variant="primary"
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-film-black-900 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              type="button"
              className="w-full flex items-center justify-center gap-2"
              onClick={loginWithGoogle}
            >
              <FcGoogle className="h-5 w-5" />
              Sign in with Google
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Please contact the admin to create an account");
                }}
                className="text-film-red-600 dark:text-film-red-500 hover:underline"
              >
                Contact admin
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
