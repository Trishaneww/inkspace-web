// Libs
import { api } from "@/lib/api/client";
import type { Dashboard, DashboardRange } from "@/types/dashboard";

export const dashboardApi = {
  get(token: string, range: DashboardRange) {
    return api.get<Dashboard>(
      `/v1/current-user/dashboard?range=${range}`,
      token,
    );
  },
};
