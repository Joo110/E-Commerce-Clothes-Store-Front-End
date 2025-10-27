"use client";
import React, { useState } from "react";
import { useRegisterUser } from "hooks/useUsers";

// ✅ Type للـ Response بتاع Register
interface RegisterResponse {
  userId: string;
  message: string;
}

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate: registerUser, isPending, isError, error, isSuccess } =
    useRegisterUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("❌ Passwords do not match");
      return;
    }

    const newUser = {
      fullName: name,
      country: city,
      username: name,
      email,
      password,
    };

    registerUser(newUser, {
      onSuccess: (res: RegisterResponse) => {
        console.log("✅ Registered:", res);
      },
      onError: (err: Error) => {
        console.error("❌ Registration failed:", err.message);
      },
    });
  };

  return (
    <div className="max-w-2xl w-full mx-auto p-8">
      <h1 className="text-4xl text-[#1E9CE0] font-bold mb-8 text-center">
        Create New Account
      </h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8">
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700 text-lg">
            Username
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-3 text-gray-700 text-lg focus:ring-2 focus:ring-[#1E9CE0] outline-none"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700 text-lg">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border rounded-lg p-3 text-gray-700 text-lg focus:ring-2 focus:ring-[#1E9CE0] outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700 text-lg">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-3 text-gray-700 text-lg focus:ring-2 focus:ring-[#1E9CE0] outline-none"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700 text-lg">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3 text-gray-700 text-lg focus:ring-2 focus:ring-[#1E9CE0] outline-none"
            required
            minLength={6}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700 text-lg">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-lg p-3 text-gray-700 text-lg focus:ring-2 focus:ring-[#1E9CE0] outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-6 px-6 py-3 rounded-lg bg-[#1E9CE0] text-white font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isPending ? "⏳ Creating account..." : "Sign Up"}
        </button>

        {isError && (
          <p className="mt-4 text-red-500 font-semibold text-center">
            ❌ {(error as Error)?.message || "Something went wrong"}
          </p>
        )}
        {isSuccess && (
          <p className="mt-4 text-green-600 font-semibold text-center">
            ✅ Account created successfully!
          </p>
        )}
      </form>
    </div>
  );
}
