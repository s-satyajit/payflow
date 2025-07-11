import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignUpPage = () => {
  const usernameRef = useRef();
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const phoneRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [response, setResponse] = useState("");
  const [fadeOut, setFadeOut] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      username: usernameRef.current.value,
      firstname: firstnameRef.current.value,
      lastname: lastnameRef.current.value,
      phone: phoneRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.post(`${apiUrl}/api/v1/auth/signup`, {
        username: payload.username,
        firstname: payload.firstname,
        lastname: payload.lastname,
        phone: payload.phone,
        email: payload.email,
        password: payload.password,
      });
      localStorage.setItem("token", response.data.token);
      setResponse(response.data.msg);
      setFadeOut(true);
      setTimeout(() => {
        navigate("/user/dashboard");
      }, 400);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div
        className={`w-full max-w-lg p-8 bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 flex flex-col items-center ${
          fadeOut ? "animate-fade-out" : "animate-fade"
        }`}
      >
        <h2 className="mb-2 text-3xl font-bold text-blue-400 text-center">
          Sign up for PayFlow
        </h2>
        <p className="mb-6 text-blue-200 text-center">
          Enter your information to create an account
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-200">
              Username
            </label>
            <input
              type="text"
              ref={usernameRef}
              placeholder="satyajit123"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-blue-400 focus:outline-none focus:ring focus:ring-blue-400 text-lg shadow"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-200">
                First Name
              </label>
              <input
                type="text"
                ref={firstnameRef}
                placeholder="Satyajit"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-blue-400 focus:outline-none focus:ring focus:ring-blue-400 text-lg shadow"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-200">
                Last Name
              </label>
              <input
                type="text"
                ref={lastnameRef}
                placeholder="Samal"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-blue-400 focus:outline-none focus:ring focus:ring-blue-400 text-lg shadow"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-200">
              Phone Number
            </label>
            <input
              type="number"
              ref={phoneRef}
              placeholder="9348XXXXXX"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-blue-400 focus:outline-none focus:ring focus:ring-blue-400 text-lg shadow"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-200">
              Email
            </label>
            <input
              type="email"
              ref={emailRef}
              placeholder="satyajit@gmail.com"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-blue-400 focus:outline-none focus:ring focus:ring-blue-400 text-lg shadow"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-200">
              Password
            </label>
            <input
              type="password"
              ref={passwordRef}
              placeholder="********"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-blue-400 focus:outline-none focus:ring focus:ring-blue-400 text-lg shadow"
              required
            />
          </div>
          {error && (
            <div className="text-red-400 text-center text-sm">
              {response || error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-3 shadow text-lg transition button-press animate-pop"
          >
            Sign up
          </button>
        </form>
        <div className="w-full mt-4 flex flex-col items-center">
          <span className="text-gray-400">Already have an account?</span>
          <button
            className="mt-2 text-blue-400 hover:underline text-base font-semibold"
            onClick={() => navigate("/signin")}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
