import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const userService = () => {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [id, setId] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, redirecting to sign-in page.");
      navigate("/signin");
      return;
    }
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(data.username);
        setFirstname(data.firstname);
        setLastname(data.lastname);
        setEmail(data.email);
        setPhone(data.phone);
        setAccounts(data.account || []);
        setId(data.id);
      } catch (err) {
        console.error("Error fetching user details:", err.message);
        if (err.response && err.response.status === 401) {
          console.error("Unauthorized access, redirecting to sign-in page.");
          navigate("/signin");
        }
      }
    };
    fetchUser();
  }, [apiUrl, navigate]);

  return {
    username,
    firstname,
    lastname,
    email,
    phone,
    accounts,
    id,
  };
};
