// ─── User / Auth ──────────────────────────────────────────────────────────────

export enum UserRole {
  Artist = "artist",
  Client = "client",
  StudioAdmin = "studio_admin",
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

// ─── Artist ───────────────────────────────────────────────────────────────────

export type TattooStyle =
  | "traditional"
  | "neo_traditional"
  | "realism"
  | "blackwork"
  | "geometric"
  | "watercolor"
  | "japanese"
  | "tribal"
  | "fine_line"
  | "illustrative"
  | "new_school"
  | "ornamental"
  | "dotwork"
  | "other";

export interface Artist {
  id: string;
  userId: string;
  slug: string;
  displayName: string;
  bio: string;
  location: string;
  styles: TattooStyle[];
  minBudget: number;
  maxBudget: number;
  depositAmount: number;
  instagramHandle?: string;
  tiktokHandle?: string;
  avatarUrl?: string;
  portfolioImages: string[];
  isAcceptingLeads: boolean;
  createdAt: string;
}

// ─── Tattoo Request / Matching ────────────────────────────────────────────────

export type BodyPlacement =
  | "arm"
  | "forearm"
  | "hand"
  | "chest"
  | "back"
  | "leg"
  | "thigh"
  | "ankle"
  | "neck"
  | "rib"
  | "shoulder"
  | "other";

export interface TattooRequest {
  id: string;
  clientId: string;
  styles: TattooStyle[];
  placement: BodyPlacement;
  size: "small" | "medium" | "large" | "full_sleeve";
  budgetMin: number;
  budgetMax: number;
  location: string;
  description: string;
  referenceImageUrls: string[];
  status: "pending" | "matched" | "closed";
  createdAt: string;
}

// ─── Inquiry / CRM Pipeline ───────────────────────────────────────────────────

export type InquiryStatus =
  | "inquiry"
  | "consultation_booked"
  | "deposit_paid"
  | "appointment_confirmed"
  | "completed"
  | "cancelled";

export interface Inquiry {
  id: string;
  artistId: string;
  clientId: string;
  requestId?: string;
  status: InquiryStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Booking / Appointment ────────────────────────────────────────────────────

export interface Appointment {
  id: string;
  inquiryId: string;
  artistId: string;
  clientId: string;
  startsAt: string;
  endsAt: string;
  depositPaid: boolean;
  depositAmount: number;
  totalAmount?: number;
  notes?: string;
  createdAt: string;
}

// ─── Flash ────────────────────────────────────────────────────────────────────

export type FlashStatus = "available" | "reserved" | "sold";

export interface FlashDesign {
  id: string;
  artistId: string;
  imageUrl: string;
  title: string;
  price: number;
  styles: TattooStyle[];
  status: FlashStatus;
  createdAt: string;
}

// ─── Messaging ────────────────────────────────────────────────────────────────

export interface Message {
  id: string;
  inquiryId: string;
  senderId: string;
  body: string;
  createdAt: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType =
  | "new_lead"
  | "artist_interest"
  | "deposit_paid"
  | "appointment_confirmed"
  | "new_message"
  | "flash_reserved";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}
