import { PropscoutDashboardClient } from "@/components/dashboard/propscout-dashboard-client";
import { getProperties } from "@/lib/server/property-repository";

export default async function Page() {
  const properties = await getProperties();

  return <PropscoutDashboardClient properties={properties} />;
}
