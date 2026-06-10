import { useEffect } from "react";
import { useLocation } from "wouter";
import { useGetAdminMe } from "@workspace/api-client-react";
import { getToken } from "@/lib/auth";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const token = getToken();
  const { data, isLoading, isError } = useGetAdminMe({
    query: {
      enabled: !!token,
      retry: false,
    },
  });

  useEffect(() => {
    if (!token || isError) {
      setLocation("/admin");
    }
  }, [token, isError, setLocation]);

  if (!token) return null;
  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400 text-sm">Loading...</div>
      </div>
    );
  }
  if (!data) return null;

  return <>{children}</>;
}
