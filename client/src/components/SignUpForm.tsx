"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useRegisterUser } from "hooks/useUsers";

export default function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordHash, setPasswordHash] = useState("");

  const {
    mutate: registerUser,
    isPending,
    isError,
    error,
    isSuccess,
  } = useRegisterUser();

const handleSignUp = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const userData = { id: "", userName, email, passwordHash };

  registerUser(userData, {
    onSuccess: (res) => {
      console.log("✅ Sign up success:", res);
      alert("✅ Account created successfully!");
      router.push("/login");
    },
    onError: (err: unknown) => {
      console.error("❌ Sign up failed:", err);
    },
  });
};


  return (
    <div className="min-h-screen flex justify-center items-center font-sans">
      <div className="bg-white p-10 shadow-lg rounded-lg w-[420px]">
        <h2 className="text-center text-black text-3xl font-bold mb-3">
          Create Account
        </h2>
        <p className="text-center text-black text-lg mb-6">
          Please sign up to continue
        </p>

        {isError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-base text-center">
            ❌ {(error as Error)?.message || "Something went wrong"}
          </div>
        )}
        {isSuccess && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-base text-center">
            ✅ Account created successfully!
          </div>
        )}

        <form onSubmit={handleSignUp} className="flex flex-col gap-5">
          <div>
            <label className="block mb-2 text-black text-lg font-semibold">
              Username
            </label>
            <input
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full border rounded px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block mb-2 text-black text-lg font-semibold">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
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
              value={passwordHash}
              onChange={(e) => setPasswordHash(e.target.value)}
              className="w-full border rounded px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#ffc400] hover:bg-[#ddbc4f] text-white text-lg font-bold py-3 rounded transition disabled:opacity-50"
          >
            {isPending ? "⏳ Creating account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
