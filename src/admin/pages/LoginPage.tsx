import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Shield, AlertCircle } from "lucide-react";
import { auth, googleProvider } from "../lib/firebase.ts";

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/admin", { replace: true });
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in cancelled.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError("This domain is not authorised. Add it in Firebase Console → Authentication → Settings → Authorised domains.");
      } else {
        setError(err.message || "Sign-in failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020703] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,102,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00ff66]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#00ff66]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="bg-[#040e06]/90 backdrop-blur-xl border border-[#00ff66]/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,255,102,0.15)]">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#00ff66]/10 border border-[#00ff66]/40 mx-auto flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,255,102,0.2)]">
              <img src="/assets/logo.png" alt="Cipher Logo" className="w-10 h-10 object-contain" />
            </div>
            <h1 className="font-mono text-2xl font-bold tracking-wider text-white">
              CIPHER <span className="text-[#00ff66]">ADMIN</span>
            </h1>
            <p className="font-mono text-xs text-[#88aa90] mt-1">
              Authorized personnel only
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-950/60 border border-red-500/50 flex items-start gap-3 text-red-200 text-xs font-mono">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold text-sm py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              /* Google logo SVG */
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
            )}
            {isLoading ? "Signing in..." : "Continue with Google"}
          </button>

          {/* Security Notice */}
          <div className="mt-7 pt-5 border-t border-[#00ff66]/15 text-center">
            <div className="flex items-center justify-center gap-2 font-mono text-[11px] text-[#88aa90]">
              <Shield className="w-3.5 h-3.5 text-[#00ff66]" />
              <span>Secured by Firebase Authentication</span>
            </div>
            <a
              href="/"
              className="inline-block mt-3 font-mono text-xs text-[#00ff66]/80 hover:text-[#00ff66] transition-colors"
            >
              ← Back to Public Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};