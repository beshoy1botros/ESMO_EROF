import { db } from "./firebase";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";

// Track app installation globally
export async function trackGlobalInstallation(platform: "Android" | "iOS") {
  if (!db) {
    console.log("Firebase not configured, skipping global tracking");
    return;
  }

  try {
    const statsRef = doc(db, "stats", "downloads");
    
    // Get current stats
    const docSnap = await getDoc(statsRef);
    const data = docSnap.data() || { total: 0, Android: 0, iOS: 0 };
    
    // Increment the counter
    await setDoc(statsRef, {
      total: increment(1),
      [platform]: increment(1),
      lastInstall: new Date().toISOString()
    }, { merge: true });
    
    console.log("📱 Global installation tracked!");
  } catch (error) {
    console.error("Error tracking installation:", error);
  }
}

// Get global download stats
export async function getGlobalStats() {
  if (!db) {
    return null;
  }

  try {
    const statsRef = doc(db, "stats", "downloads");
    const docSnap = await getDoc(statsRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting stats:", error);
    return null;
  }
}
