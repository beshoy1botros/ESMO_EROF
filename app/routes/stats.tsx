import { useState, useEffect } from "react";
import { getGlobalStats } from "../utils/analytics";

interface GlobalStats {
  total?: number;
  Android?: number;
  iOS?: number;
  lastInstall?: string;
}

export default function Stats() {
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getGlobalStats();
        setGlobalStats(stats);
      } catch (err) {
        setError("تعذر تحميل الإحصائيات");
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div dir="rtl" style={{ 
        padding: "20px", 
        maxWidth: "600px", 
        margin: "0 auto",
        fontFamily: "inherit"
      }}>
        <div style={{
          background: "#fee2e2",
          padding: "20px",
          borderRadius: "10px",
          color: "#dc2626",
          textAlign: "center"
        }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ 
      padding: "20px", 
      maxWidth: "600px", 
      margin: "0 auto",
      fontFamily: "inherit"
    }}>
      <h1 style={{ 
        color: "#1e3a8a", 
        marginBottom: "30px",
        textAlign: "center"
      }}>
        📊 إحصائيات التحميل العالمية
      </h1>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}>
        <div style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
          color: "white",
          padding: "30px",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 4px 15px rgba(30, 58, 138, 0.3)"
        }}>
          <div style={{ fontSize: "48px", fontWeight: "bold" }}>
            {globalStats?.total || 0}
          </div>
          <div style={{ fontSize: "16px", opacity: 0.9 }}>
            إجمالي التحميلات
          </div>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
          color: "white",
          padding: "30px",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)"
        }}>
          <div style={{ fontSize: "48px", fontWeight: "bold" }}>
            {globalStats?.Android || 0}
          </div>
          <div style={{ fontSize: "16px", opacity: 0.9 }}>
            أجهزة أندرويد
          </div>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
          color: "white",
          padding: "30px",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)"
        }}>
          <div style={{ fontSize: "48px", fontWeight: "bold" }}>
            {globalStats?.iOS || 0}
          </div>
          <div style={{ fontSize: "16px", opacity: 0.9 }}>
            أجهزة آيفون
          </div>
        </div>
      </div>

      {globalStats?.lastInstall && (
        <div style={{
          background: "#f8fafc",
          padding: "15px",
          borderRadius: "10px",
          textAlign: "center",
          color: "#64748b"
        }}>
          آخر تحميل: {new Date(globalStats.lastInstall).toLocaleString("ar-EG")}
        </div>
      )}

      <div style={{
        marginTop: "30px",
        padding: "20px",
        background: "#dbeafe",
        borderRadius: "10px",
        fontSize: "14px",
        color: "#1e40af"
      }}>
        ✅ هذه الإحصائيات عالمية تشمل جميع الأجهزة حول العالم
      </div>

      <a 
        href="/"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "12px 24px",
          background: "#1e3a8a",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none"
        }}
      >
        ← العودة للرئيسية
      </a>
    </div>
  );
}
