import { useState, useEffect } from "react";
import { Link } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import "../styles/contact.css";

// Initialize EmailJS
const EMAILJS_SERVICE_ID = "service_3cnmp3d";
const EMAILJS_TEMPLATE_ID = "template_l9sp8mq";
const EMAILJS_PUBLIC_KEY = "SukUtswrGf2dHEWO2";

interface ContactData {
  name: string;
  email: string;
  category: "bug" | "suggestion" | "other";
  message: string;
}

export default function Contact() {
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);
  const [formData, setFormData] = useState<ContactData>({
    name: "",
    email: "",
    category: "bug",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveToLocalStorage = (data: ContactData & { timestamp: string }) => {
    const existing = JSON.parse(
      localStorage.getItem("contactFeedback") || "[]",
    );
    existing.push(data);
    localStorage.setItem("contactFeedback", JSON.stringify(existing));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Save to local storage
      const timestamp = new Date().toISOString();
      saveToLocalStorage({ ...formData, timestamp });

      // Send email via EmailJS
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: "botrosabanoub422@gmail.com",
        from_name: formData.name,
        from_email: formData.email,
        category: formData.category,
        message: formData.message,
        timestamp,
      });

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        category: "bug",
        message: "",
      });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
      console.error("Error sending email:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-container">
      <div className="contact-content">
        <Link to="/" className="back-link">
          <FaArrowLeft /> العودة للرئيسية
        </Link>
        <h1>تواصل معنا</h1>
        <p className="contact-subtitle">
          شارك معنا ملاحظاتك واقتراحاتك أو أخبرنا عن أي مشاكل
        </p>

        {submitted && (
          <div className="success-message">
            ✓ شكراً! تم استقبال رسالتك بنجاح
          </div>
        )}

        {error && <div className="error-message">✗ {error}</div>}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">الاسم *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="أدخل اسمك"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">البريد الإلكتروني *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">نوع الرسالة *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="bug">مشكلة تقنية</option>
              <option value="suggestion">اقتراح</option>
              <option value="other">أخرى</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">الرسالة *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="اكتب رسالتك هنا..."
              rows={6}
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
          </button>
        </form>

        <div className="contact-info">
          <h2>معلومات التواصل</h2>
          <p>يمكنك أيضاً التواصل معنا مباشرة عبر:</p>
          <ul>
            <li>
              📧 البريد:{" "}
              <a
                href="mailto:botrosabanoub422@gmail.com"
                className="contact-link"
              >
                botrosabanoub422@gmail.com
              </a>
            </li>
            <li>💬 رسالة مباشرة عبر وسائل التواصل الاجتماعي</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
