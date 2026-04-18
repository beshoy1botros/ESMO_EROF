/**
 * Utility للتعامل مع بيانات التواصل المحفوظة
 */

export interface SavedContact {
  name: string;
  email: string;
  category: "bug" | "suggestion" | "other";
  message: string;
  timestamp: string;
}

/**
 * استرجاع جميع الرسائل المحفوظة محلياً
 */
export function getSavedContacts(): SavedContact[] {
  try {
    const data = localStorage.getItem("contactFeedback");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading saved contacts:", error);
    return [];
  }
}

/**
 * مسح جميع الرسائل المحفوظة
 */
export function clearSavedContacts(): void {
  try {
    localStorage.removeItem("contactFeedback");
  } catch (error) {
    console.error("Error clearing contacts:", error);
  }
}

/**
 * تصدير الرسائل كـ JSON file
 */
export function exportContactsAsJSON(): void {
  const contacts = getSavedContacts();
  const dataStr = JSON.stringify(contacts, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `contacts-${new Date().toISOString().split("T")[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * تصدير الرسائل كـ CSV
 */
export function exportContactsAsCSV(): void {
  const contacts = getSavedContacts();
  let csv = "الاسم,البريد الإلكتروني,النوع,الرسالة,التاريخ\n";
  
  contacts.forEach((contact) => {
    const escapedMessage = contact.message.replace(/"/g, '""');
    const date = new Date(contact.timestamp).toLocaleString("ar-EG");
    csv += `"${contact.name}","${contact.email}","${contact.category}","${escapedMessage}","${date}"\n`;
  });

  const dataBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `contacts-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * إرسال جميع الرسائل المحفوظة إلى API
 */
export async function sendPendingContacts(apiUrl: string): Promise<number> {
  const contacts = getSavedContacts();
  let successCount = 0;

  for (const contact of contacts) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });

      if (response.ok) {
        successCount++;
      }
    } catch (error) {
      console.error("Failed to send contact:", error);
    }
  }

  if (successCount === contacts.length) {
    clearSavedContacts();
  }

  return successCount;
}

/**
 * نسخ الرسائل إلى clipboard (للدعم اليدوي)
 */
export function copyContactsToClipboard(): void {
  const contacts = getSavedContacts();
  const text = contacts
    .map((c) => `${c.name} <${c.email}>\n${c.category}: ${c.message}\n`)
    .join("\n---\n\n");
  
  navigator.clipboard.writeText(text).then(() => {
    console.log("✓ تم نسخ الرسائل للحافظة");
  });
}
