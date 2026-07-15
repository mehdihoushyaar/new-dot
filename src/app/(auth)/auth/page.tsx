"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@/features/auth/api/mutations/auth.mutations";
import { Input } from "@/shared/ui/input/Input";
import { Button } from "@/shared/ui/button/Button";
import { useState } from "react";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const { mutate: login, isPending, error } = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginForm) => {
    login(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-5xl font-black text-sky-500">●</span>
          <h1 className="text-2xl font-bold text-white mt-2">MyDot</h1>
          <p className="text-zinc-500 text-sm mt-1">What&apos;s happening in your world?</p>
        </div>

        <div className="flex rounded-xl border border-zinc-800 mb-6 overflow-hidden">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 text-sm font-semibold capitalize transition-colors ${
                mode === m ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {m === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        {mode === "login" && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register("username")}
              label="Username or email"
              placeholder="@username"
              error={errors.username?.message}
            />
            <Input
              {...register("password")}
              type="password"
              label="Password"
              placeholder="••••••••"
              error={errors.password?.message}
            />
            {error && (
              <p className="text-sm text-red-400">Invalid credentials. Please try again.</p>
            )}
            <Button type="submit" className="w-full" loading={isPending}>
              Log in
            </Button>
          </form>
        )}

        {mode === "register" && (
          <div className="text-center text-zinc-500 text-sm">
            <p>Registration coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
