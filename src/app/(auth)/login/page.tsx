"use client";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { authApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, LogIn, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const mutation = useMutation({
    mutationFn: () => authApi.login(form),
    onSuccess: (res) => {
      const { user, token } = res.data.data;

      // Normalize role — backend may return { role_name } or flat "Admin" string
      const rawRole = (user as User & { role: unknown }).role;
      const normalizedUser: User = {
        ...user,
        role:
          typeof rawRole === "string"
            ? { role_name: rawRole as "Admin" | "User" }
            : (rawRole as { role_name: "Admin" | "User" }),
      };

      setAuth(normalizedUser, token);
      toast.success(`Welcome back, ${normalizedUser.name}!`);

      const isAdminUser = normalizedUser.role?.role_name === "Admin";
      router.push(isAdminUser ? "/admin" : "/");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill all fields.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50
                    flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link href="/">
            <div
              className="inline-flex items-center justify-center w-14 h-14 bg-primary-600
                   rounded-2xl mb-4 shadow-lg shadow-primary-200 cursor-pointer"
            >
              <Shield className="w-7 h-7 text-white" />
            </div>
          </Link>
          <Link href="/">
            <h1 className="text-2xl font-bold text-slate-900 cursor-pointer">
              Welcome back
            </h1>
          </Link>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to your GovNavigator account
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, password: e.target.value }))
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary w-full py-3"
            >
              {mutation.isPending ? (
                <>
                  <LoadingSpinner size="sm" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-5 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-medium text-blue-700 mb-1.5">
              Demo Credentials
            </p>
            <div className="space-y-1 text-xs text-blue-600">
              <p>
                👤 User: <span className="font-mono">rahim@example.com</span> /{" "}
                <span className="font-mono">user123456</span>
              </p>
              <p>
                🔑 Admin:{" "}
                <span className="font-mono">admin@govnavigator.com</span> /{" "}
                <span className="font-mono">admin123456</span>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary-600 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
