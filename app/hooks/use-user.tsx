import React, { useEffect, useState } from "react";

const useUser = () => {
  const [currentUserId, setCurrentUserId] = useState<string>("");
  useEffect(() => {
    let mounted = true;

    const fetchCurrentUserId = async () => {
      try {
        // Try a few common endpoints / response shapes - adapt to your API
        const endpoints = ["/api/auth/session", "/api/session"];
        for (const ep of endpoints) {
          const res = await fetch(ep);
          if (!res.ok) continue;
          const data = await res.json();

          // support several possible payload shapes
          const id =
            data?.id ??
            data?.user?.id ??
            data?.session?.user?.id ??
            data?.user?.sub ??
            data?.userId;

          if (id && mounted) {
            setCurrentUserId(String(id));
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch current user id:", err);
      }
    };

    fetchCurrentUserId();
    return () => {
      mounted = false;
    };
  }, []);
  return {
    currentUserId,
    setCurrentUserId,
  };
};

export default useUser;
