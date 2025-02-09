"use client";
import { useState } from "react";
import { login, loginWithGoogle, signup } from "@/services/auth";
import { useRouter } from "next/navigation";
import useAuthStore from "@/contexts/auth-store";
import Image from "next/image";
import Cat from "@/assets/images/used2book-logo.png";
import { Icons } from "@/components/icons";

export default function AuthPage() {
    const router = useRouter();


    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { setUser, setToken } = useAuthStore();

    // ✅ Toggle Login/Signup & Clear Input Fields
    const handleToggle = (mode: boolean) => {
        setIsLogin(mode);
        setEmail(""); // ✅ Clears email field
        setPassword(""); // ✅ Clears password field
        setError(""); // ✅ Clears any error message
    };

    // ✅ Handle Login/Signup Submission
    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            if (isLogin) {
                console.log("login")
                await login(email, password);
                router.push("/user/home");
            } else {
                console.log("signup")
                await signup(email, password);
            }
        } catch (err) {
            setError("Authentication failed. Check your credentials.");
            console.error("Auth error:", err);
        }
    };

    // ✅ Handle Google Login
    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            router.push("/user/home");
        } catch (err) {
            setError("Authentication failed. Check your credentials.- Google");
            console.error("Google login failed", err);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Left Half with Image */}
            <div className="bg-black w-1/2 flex items-center justify-center">
                <Image src={Cat} alt="Description of Image" width={300} height={300} />
            </div>

            {/* Right Half with Login/Signup Form */}
            <div className="bg-green-400 w-1/2 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-3/4">
                    <h2 className="text-2xl font-bold mb-4 text-center">Welcome</h2>

                    {/* Toggle Login/Signup */}
                    <div className="flex justify-around mb-4">
                        <button
                            className={`px-4 py-2 rounded-lg transition-colors ${isLogin ? 'bg-pink-500 text-white' : 'bg-gray-300 text-black'}`}
                            onClick={() => handleToggle(true)}
                        >
                            Login
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg transition-colors ${!isLogin ? 'bg-pink-500 text-white' : 'bg-gray-300 text-black'}`}
                            onClick={() => handleToggle(false)}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    {/* Login/Signup Form */}
                    <form onSubmit={handleAuth} className="block">
                        <h3 className="text-xl font-semibold mb-4">{isLogin ? "Login" : "Sign Up"}</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-zinc-700 transition-colors">
                            {isLogin ? "Sign in" : "Sign up"}
                        </button>
                    </form>

                    {/* Google Login */}
                    <button type="button" onClick={handleGoogleLogin}  className="w-full mt-2">
                        <div className="flex justify-center items-center p-2 rounded-md border border-zinc-300 hover:bg-zinc-100 transition-colors">
                            <Icons.google className="mr-2 h-4 w-4" />
                            {isLogin ? "Sign in with Google" : "Sign Up with Google"}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
