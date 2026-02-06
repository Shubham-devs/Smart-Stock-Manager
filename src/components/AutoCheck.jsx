import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AutoCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkLocalStorage = () => {
      const uid = localStorage.getItem("uid");

      if (uid) {
        console.log("UID found ✅", uid);

        setTimeout(() => {
          localStorage.removeItem("uid");
          console.log("UID deleted automatically after 30 minutes ⏳");
          navigate("/"); // Redirect after deletion
        }, 120000);
      } else {
        console.log("No UID found ❌, redirecting to login...");
        navigate("/");
      }
    };

    // Run once when page loads
    checkLocalStorage();
  }, [navigate]);

  return null;
};

export default AutoCheck;
