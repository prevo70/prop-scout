function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function getServerEnv() {
  return {
    appUrl: clean(process.env.NEXT_PUBLIC_APP_URL),
    domainApiKey: clean(process.env.DOMAIN_API_KEY),
    supabaseUrl: clean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseAnonKey: clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    supabaseServiceRoleKey: clean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    cronSecret: clean(process.env.CRON_SECRET),
  };
}

export function getSupabaseRestConfig() {
  const env = getServerEnv();
  const apiKey = env.supabaseServiceRoleKey ?? env.supabaseAnonKey;

  if (!env.supabaseUrl || !apiKey) {
    return null;
  }

  return {
    url: env.supabaseUrl,
    apiKey,
  };
}
