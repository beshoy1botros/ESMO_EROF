// Simple global counter using countapi.xyz (free service)
const NAMESPACE = "esmo-erof-v1";

// Create counter if not exists and get value
export async function getGlobalStats() {
  try {
    const response = await fetch(
      `https://api.countapi.xyz/get/${NAMESPACE}/downloads`
    );
    if (!response.ok) {
      // Counter doesn't exist, create it
      await createCounter();
      return { total: 0 };
    }
    const data = await response.json();
    return { total: data.value };
  } catch (error) {
    console.error("Error getting stats:", error);
    return null;
  }
}

// Create the counter
async function createCounter() {
  try {
    await fetch(`https://api.countapi.xyz/create?namespace=${NAMESPACE}&key=downloads&enable_reset=0`);
  } catch (e) {
    console.error("Error creating counter:", e);
  }
}

// Increment download counter (call when app is installed)
export async function trackGlobalInstallation() {
  try {
    // First ensure counter exists
    await createCounter();
    
    // Then hit/increment it
    const response = await fetch(
      `https://api.countapi.xyz/hit/${NAMESPACE}/downloads`
    );
    const data = await response.json();
    console.log("📱 Installation tracked! Total:", data.value);
    return data.value;
  } catch (error) {
    console.error("Error tracking installation:", error);
    return null;
  }
}
