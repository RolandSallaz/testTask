"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export default function Home() {
  const router = useRouter();
  const [showPage, setShowPage] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (window.location.search.includes("api=true")) {
      setShowPage(true);
      const newSocket = io("http://localhost:3000");
      setSocket(newSocket);

      newSocket.on("connect", () => {
        const urlParams = new URLSearchParams(window.location.search);
        const key = urlParams.get("key");

        if (key) {
          setInterval(() => {
            newSocket.emit("message", key);
          }, 5000);
        }
      });

      newSocket.on("disconnect", () => {
        console.log("WebSocket disconnected");
      });

      return () => {
        newSocket.close();
      };
    } else {
      router.replace("/404");
    }
  }, [router]);

  if (!showPage) {
    return null;
  }

  return (
    <div>
      <h1>Главная страница</h1>
    </div>
  );
}
