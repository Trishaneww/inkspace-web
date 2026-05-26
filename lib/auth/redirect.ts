// Libs
import { UserRole, type User } from "@/types/index";

export function postAuthRedirect(user: User): string {
  switch (user.role) {
    case UserRole.Artist:
      return "/dashboard/artist";
    case UserRole.StudioAdmin:
    case UserRole.User:
    default:
      return "/dashboard";
  }
}
