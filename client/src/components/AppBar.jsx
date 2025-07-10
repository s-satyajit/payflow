import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppBar = () => {
  const [firstname, setFirstname] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, redirecting to sign-in page.");
      navigate("/signin");
    }
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/api/v1/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFirstname(data.firstname);
        console.log("User Data:", data.username);
        console.log("Fetched Data:", data);
      } catch (err) {
        console.error("Error fetching user details:", err);
        if (err.response && err.response.status === 401) {
          console.error("Unauthorized access, redirecting to sign-in page.");
          navigate("/signin");
        } else {
          console.error(
            "An error occurred while fetching user details:",
            err.message
          );
        }
      }
    };
    fetchUser();
  }, [navigate, apiUrl]);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setSearchError("");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) return;
    setSearchLoading(true);
    setSearchError("");
    const timeout = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `${apiUrl}/api/v1/account/search-accounts`,
          {
            params: { q: searchQuery },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSearchResults(data.user || []);
      } catch (err) {
        setSearchError("No accounts found or error occurred.");
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-900 to-blue-700 shadow-lg h-16 flex items-center justify-between px-6 relative z-20">
        <div className="flex items-center gap-2">
          <span
            className="text-2xl font-extrabold tracking-tight text-white select-none cursor-pointer hover:text-blue-300 transition"
            onClick={() => navigate("/user/dashboard")}
          >
            PayFlow
          </span>
          <span className="ml-2 px-2 py-1 bg-blue-800 text-xs rounded text-blue-200 font-mono">
            PRO
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-lg text-blue-100 font-medium">
            Hello,{" "}
            <span className="font-semibold">
              {firstname &&
                firstname.charAt(0).toUpperCase() + firstname.slice(1)}
            </span>
          </span>
          <button
            className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-800 hover:bg-blue-600 text-white shadow-lg border-2 border-blue-400 transition-all focus:outline-none mr-2"
            aria-label="Search accounts"
            onClick={() => setSearchOpen((open) => !open)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 0 5 11a6 6 0 0 0 12 0z"
              />
            </svg>
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-blue-400 h-12 w-12 text-blue-900 font-bold text-xl shadow-lg border-2 border-blue-300 hover:scale-105 transition-transform focus:outline-none cursor-pointer"
              onClick={() => setDropdownOpen((open) => !open)}
              aria-label="User menu"
            >
              {firstname && firstname.charAt(0).toUpperCase()}
            </button>
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl shadow-xl py-4 px-2 animate-fade-in-up border border-blue-700 bg-gradient-to-br from-gray-900/95 to-blue-950/90 flex flex-col gap-2"
                style={{ boxShadow: "0 8px 32px 0 rgba(30, 64, 175, 0.18)" }}
              >
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-base bg-blue-800/80 text-blue-100 shadow hover:bg-blue-700/90 active:scale-95 transition-all duration-150 mb-1 border border-blue-700"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/user/create-account");
                  }}
                >
                  <span className="inline-flex items-center justify-center bg-blue-700/40 rounded-full p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </span>
                  Create Account
                </button>
                <div className="border-t border-blue-800/60 my-1" />
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:bg-gray-800/80 transition cursor-pointer active:scale-95"
                  onClick={() => {
                    setDropdownOpen(false);
                    localStorage.removeItem("token");
                    navigate("/signin");
                  }}
                >
                  <span className="inline-flex items-center justify-center bg-red-900/40 rounded-full p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7"
                      />
                    </svg>
                  </span>
                  <span className="text-red-300">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div
        className={`w-full flex justify-center transition-all duration-300 ${
          searchOpen ? "max-h-96 py-6 opacity-100" : "max-h-0 py-0 opacity-0"
        } bg-gradient-to-r from-blue-950 to-blue-800 shadow-lg overflow-hidden`}
        style={{ position: "relative", zIndex: 19 }}
      >
        <div className="flex flex-col items-center w-full max-w-2xl">
          <div className="flex w-full gap-2">
            <input
              type="text"
              className="flex-1 px-4 py-3 rounded-l-lg bg-gray-900 text-white border border-blue-400 focus:outline-none focus:ring focus:ring-blue-400 text-lg shadow"
              placeholder="Search accounts by name, number, IFSC, bank..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={searchOpen}
            />
            <button
              className="px-6 py-3 rounded-r-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition"
              disabled={searchLoading}
            >
              {searchLoading ? "Searching..." : "Search"}
            </button>
          </div>
          {searchError && (
            <div className="text-red-400 mt-2">{searchError}</div>
          )}
          {searchResults.length > 0 && (
            <div className="w-full mt-4 bg-white rounded-lg shadow-lg border border-blue-100 divide-y divide-blue-50">
              {searchResults.map((acc) => (
                <div
                  key={acc.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition"
                >
                  <div>
                    <div className="font-semibold text-gray-900 text-base">
                      {acc.bankName}
                    </div>
                    <div className="text-sm text-gray-600">
                      A/C: {acc.accountNumber} &middot; IFSC: {acc.ifsc}
                    </div>
                  </div>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow transition text-sm"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                      setSearchResults([]);
                      navigate("/user/transferfunds/form", {
                        state: {
                          toAccount: {
                            accountNumber: acc.accountNumber,
                            ifsc: acc.ifsc,
                            bankName: acc.bankName,
                            firstname: acc.firstname || acc.firstName || "",
                            lastname: acc.lastname || acc.lastName || "",
                            id: acc.id,
                          },
                        },
                      });
                    }}
                  >
                    Send Money
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
