import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export function useRequireVerifiedUser() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const isGoogle = user.providerData.some(
          (provider) => provider.providerId === "google.com"
        );
        if (!isGoogle && !user.emailVerified) {
          router.push("/verify-email");
        }
      }
    });
    return () => unsubscribe();
  }, [router]);
}
