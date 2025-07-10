import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignInPage = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const response = await axios.post(`${apiUrl}/api/v1/auth/signin`, {
        email: payload.email,
        password: payload.password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/user/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 flex flex-col items-center">
        <h2 className="mb-2 text-3xl font-bold text-blue-400 text-center">Sign in to PayFlow</h2>
        <p className="mb-6 text-blue-200 text-center">Enter your credentials to access your account</p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-200">Email</label>
            <input
              type="email"
              ref={emailRef}
              placeholder="satyajit@gmail.com"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-blue-400 focus:outline-none focus:ring focus:ring-blue-400 text-lg shadow"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-200">Password</label>
            <input
              type="password"
              ref={passwordRef}
              placeholder="********"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-blue-400 focus:outline-none focus:ring focus:ring-blue-400 text-lg shadow"
              required
            />
          </div>
          {error && <div className="text-red-400 text-center text-sm">{error}</div>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-3 shadow text-lg transition">Sign in</button>
        </form>
        <div className="w-full mt-4 flex flex-col items-center">
          <span className="text-gray-400">Don't have an account?</span>
          <button
            className="mt-2 text-blue-400 hover:underline text-base font-semibold"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};
