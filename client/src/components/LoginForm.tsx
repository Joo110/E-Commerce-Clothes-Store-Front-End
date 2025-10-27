"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLoginUser } from "hooks/useUsers";
import Cookies from "js-cookie";

interface User {
  id: string;
  userName: string;
  email: string;
}

interface LoginResponse {
  status: number;
  token: string;
  user: User;
}

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!Cookies.get("token") && !!Cookies.get("userId")
  );

  const {
    mutate: loginUser,
    isPending,
    isError,
    error,
    isSuccess,
  } = useLoginUser();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    loginUser(
      { emailOrUsername, password },
      {
        onSuccess: (res: LoginResponse) => {
  console.log("✅ Login success:", res);

  const isLocal = window.location.hostname === "localhost";

  setIsLoggedIn(true);

// بعد نجاح تسجيل الدخول:
Cookies.set("token", res.token, { expires: 7 });
Cookies.set("userId", res.user.id, { expires: 7 });
window.dispatchEvent(new Event("login"));

  router.push("/");
},

        onError: (err: unknown) => {
          console.error("❌ Login failed:", err);
          const message =
            err instanceof Error ? err.message : "Invalid credentials";
          alert("❌ " + message);
        },
      }
    );
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex justify-center items-center font-sans">
      <div className="bg-white p-10 shadow-lg rounded-lg w-[420px]">
        {!isLoggedIn ? (
          <>
            <h2 className="text-center text-black text-3xl font-bold mb-3">
              Welcome Back
            </h2>
            <p className="text-center text-black text-lg mb-6">
              Please login to continue
            </p>

            {isError && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-base text-center">
                ❌ {(error as Error)?.message || "Invalid credentials"}
              </div>
            )}
            {isSuccess && (
              <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-base text-center">
                ✅ Login successful!
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div>
                <label className="block mb-2 text-black text-lg font-semibold">
                  Email or Username
                </label>
                <input
                  type="text"
                  required
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full border rounded px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your email or username"
                />
              </div>

              <div>
                <label className="block mb-2 text-lg text-black font-semibold flex justify-between">
                  Password
                  <span
                    className="cursor-pointer text-[#ffc400] text-sm"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#ffc400] hover:bg-[#ddbc4f] text-white text-lg font-bold py-3 rounded transition disabled:opacity-50"
              >
                {isPending ? "⏳ Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-center text-black text-base mt-6">
              Not have an account?{" "}
              <span
                onClick={() => router.push("/signup")}
                className="text-[#ffc400] font-semibold cursor-pointer hover:underline"
              >
                Sign Up
              </span>
            </p>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black mb-4">
              👋 You are logged in!
            </h2>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded transition"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}