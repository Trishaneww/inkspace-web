// Libs
import { UserRole, type User } from "@/types/index";

export function postAuthRedirect(user: User): string {
  switch (user.role) {
    case UserRole.Artist:
      return "/dashboard/artist";
    case UserRole.User:
      return "/dashboard/client";
    case UserRole.StudioAdmin:
    default:
      return "/dashboard";
  }
}
