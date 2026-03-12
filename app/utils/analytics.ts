// Simple global counter using countapi.xyz (free service)
const COUNTER_NAMESPACE = "esmo-erof-app";
const COUNTER_KEY = "downloads";

interface CounterResult {
  value: number;
}

// Get current download count
export async function getGlobalStats() {
  try {
    const response = await fetch(
      `https://api.countapi.xyz/get/${COUNTER_NAMESPACE}/${COUNTER_KEY}`
    );
    const data: CounterResult = await response.json();
    return { total: data.value };
  } catch (error) {
    console.error("Error getting stats:", error);
    return null;
  }
}

// Increment download counter (call when app is installed)
export async function trackGlobalInstallation(platform: "Android" | "iOS") {
  try {
    const response = await fetch(
      `https://api.countapi.xyz/create?namespace=${COUNTER_NAMESPACE}&key=${COUNTER_KEY}&enable_reset=0`
    );
    const data: CounterResult = await response.json();
    console.log("📱 Installation tracked! Total:", data.value);
    return data.value;
  } catch (error) {
    console.error("Error tracking installation:", error);
    return null;
  }
}
