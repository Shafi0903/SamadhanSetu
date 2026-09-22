const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface RequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
  const { token, headers = {}, ...rest } = options;

  const authHeader: Record<string, string> = {};
  if (token) {
    authHeader["Authorization"] = `Bearer ${token}`;
  } else if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem("samadhansetu_token");
    if (storedToken) {
      authHeader["Authorization"] = `Bearer ${storedToken}`;
    }
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...headers,
    },
    ...rest,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || json.message || "An unexpected error occurred");
  }

  return json;
}
