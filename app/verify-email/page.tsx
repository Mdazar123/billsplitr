"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { sendEmailVerification } from "firebase/auth";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const [sent, setSent] = useState(false);
  const [checking, setChecking] = useState(false);
  const router = useRouter();

  // Check verification status on mount and on refresh
  useEffect(() => {
    const checkVerified = async () => {
      if (auth.currentUser) {
        setChecking(true);
        await auth.currentUser.reload(); // Force refresh user data
        if (auth.currentUser.emailVerified) {
          router.push("/dashboard");
        }
        setChecking(false);
      }
    };
    checkVerified();
    // Optionally, poll every few seconds:
    const interval = setInterval(checkVerified, 3000);
    return () => clearInterval(interval);
  }, [router]);

  const handleResend = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-green-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-blue-100">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Verify Your Email</h1>
        <p className="mb-4 text-gray-700">
          Please check your inbox and click the verification link to activate your account.
        </p>
        <Button
          onClick={handleResend}
          disabled={sent}
          className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-semibold py-2 rounded-lg shadow"
        >
          {sent ? "Verification Email Sent!" : "Resend Verification Email"}
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          After verifying, please refresh this page or log in again.
        </p>
        {checking && (
          <p className="text-xs text-blue-500 mt-2">Checking verification status...</p>
        )}
      </div>
    </div>
  );
}
