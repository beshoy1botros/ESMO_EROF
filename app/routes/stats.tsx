import { useState, useEffect } from "react";

interface Stats {
  visits?: number;
  downloads?: number;
}

export default function Stats() {
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // First, try to create counters if they don't exist
        const namespace = "esmo-erof-v1";
        
        // Create visits counter
        await fetch(`https://api.countapi.xyz/create?namespace=${namespace}&key=visits&enable_reset=0`);
        
        // Create downloads counter  
        await fetch(`https://api.countapi.xyz/create?namespace=${namespace}&key=downloads&enable_reset=0`);
        
        // Get visits
        const visitsRes = await fetch(
          `https://api.countapi.xyz/get/${namespace}/visits`
        );
        const visitsData = await visitsRes.json();
        
        // Get downloads
        const downloadsRes = await fetch(
          `https://api.countapi.xyz/get/${namespace}/downloads`
        );
        const downloadsData = await downloadsRes.json();
        
        setStats({
          visits: visitsData.value,
          downloads: downloadsData.value
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
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
        📊 إحصائيات الموقع
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
            {stats.visits || 0}
          </div>
          <div style={{ fontSize: "16px", opacity: 0.9 }}>
            عدد الزيارات
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
            {stats.downloads || 0}
          </div>
          <div style={{ fontSize: "16px", opacity: 0.9 }}>
            التحميلات
          </div>
        </div>
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
