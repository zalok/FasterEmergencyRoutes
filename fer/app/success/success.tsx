import { useEffect, useState } from "react";

export default function LoginSuccess() {
  const [message, setMessage] = useState("Validating token...");
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setMessage("❌ No token found. Please log in.");
      return;
    }

    fetch("/api/validate-token", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setUsername(data.data.sub || "User");
          setMessage("✅ Login successful!");
        } else {
          setMessage("❌ Invalid or expired token.");
        }
      })
      .catch(() => setMessage("⚠️ Error validating token."));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "Arial" }}>
      <h1>{message}</h1>
      {username && <p>Welcome, {username}!</p>}
    </div>
  );
}
