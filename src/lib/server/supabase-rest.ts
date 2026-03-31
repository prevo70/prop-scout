import { getSupabaseRestConfig } from "@/lib/server/env";

interface SupabaseRequestOptions extends RequestInit {
  prefer?: string[];
}

function buildHeaders(options?: SupabaseRequestOptions): HeadersInit {
  const config = getSupabaseRestConfig();
  if (!config) {
    throw new Error("Missing Supabase configuration");
  }

  return {
    "Content-Type": "application/json",
    apikey: config.apiKey,
    Authorization: `Bearer ${config.apiKey}`,
    ...(options?.prefer?.length ? { Prefer: options.prefer.join(",") } : {}),
    ...(options?.headers ?? {}),
  };
}

async function requestSupabase<T>(path: string, options?: SupabaseRequestOptions): Promise<T> {
  const config = getSupabaseRestConfig();
  if (!config) {
    throw new Error("Missing Supabase configuration");
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    headers: buildHeaders(options),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase REST ${response.status}: ${text}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

export async function selectSupabase<T>(path: string): Promise<T[]> {
  return requestSupabase<T[]>(path, { method: "GET" });
}

export async function upsertSupabase<T extends object, R>(
  table: string,
  rows: T[],
  onConflict?: string
): Promise<R[]> {
  const query = onConflict ? `?on_conflict=${encodeURIComponent(onConflict)}` : "";
  return requestSupabase<R[]>(`${table}${query}`, {
    method: "POST",
    body: JSON.stringify(rows),
    prefer: ["resolution=merge-duplicates", "return=representation"],
  });
}
