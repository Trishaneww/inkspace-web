// Libs
import { clearTokens, getRefreshToken, setTokens } from "@/lib/auth/session";
import { API_BASE_URL } from "@/constants/api";

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

let inFlightRefresh: Promise<string | null> | null = null;
const cleared = new Set<() => void>();

export function onAuthCleared(listener: () => void): () => void {
  cleared.add(listener);
  return () => {
    cleared.delete(listener);
  };
}

function endSession() {
  clearTokens();
  cleared.forEach((listener) => listener());
}

export function refreshAccessToken(): Promise<string | null> {
  if (inFlightRefresh) return inFlightRefresh;

  inFlightRefresh = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      endSession();
      return null;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        endSession();
        return null;
      }

      const pair = (await res.json()) as TokenPair;
      setTokens(pair.accessToken, pair.refreshToken);
      return pair.accessToken;
    } catch {
      return null;
    } finally {
      inFlightRefresh = null;
    }
  })();

  return inFlightRefresh;
}
