"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MemoryLeakComponent() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);

      setData((prev) => [
        ...prev,
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          randomData: Math.random() * 1000,
        },
      ]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      console.log("[v0] Window resized, data length:", data.length);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [data.length]);

  const handleClearData = () => {
    setData([]);
    setCount(0);
  };

  useEffect(() => {
    if (count > 15) {
      handleClearData();
    }
  }, [count]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memory Leak Demo</CardTitle>
        <div className="text-sm text-muted-foreground">
          Count: {count} | Data items: {data.length}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-32 overflow-y-auto text-xs">
          {data.slice(-5).map((item) => (
            <div key={item.id}>
              {item.timestamp}: {item.randomData.toFixed(2)}
            </div>
          ))}
        </div>

        <Button onClick={handleClearData} variant="destructive">
          Clear Data
        </Button>
      </CardContent>
    </Card>
  );
}
