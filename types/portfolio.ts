// Next.js
import type { ChangeEvent } from "react";

export type PortfolioStatus = "draft" | "published" | "archived";
export type PortfolioColorType = "black_and_grey" | "color";

export interface PortfolioItem {
  id: string;
  artistId: string;
  status: PortfolioStatus;
  title: string;
  description?: string | null;
  completionDate?: string | null;
  imageKeys: string[];
  imageUrls: string[];
  styles: string[];
  placement?: string | null;
  colorType?: PortfolioColorType | null;
  approxSizeInches?: number | null;
  healed: boolean;
  sessionCount?: number | null;
  totalMinutes?: number | null;
  publishedAt?: string | null;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioListResponse {
  items: PortfolioItem[];
  total: number;
  published: number;
  limit: number;
  offset: number;
}

export interface CreatePortfolioPayload {
  title: string;
  description?: string | null;
  completionDate?: string | null;
  imageKeys: string[];
  styles?: string[];
  placement?: string | null;
  colorType?: PortfolioColorType | null;
  approxSizeInches?: number | null;
  healed: boolean;
  sessionCount?: number | null;
  totalMinutes?: number | null;
  publish: boolean;
}

export type UpdatePortfolioPayload = Omit<CreatePortfolioPayload, "publish">;

export interface PortfolioPresignResponse {
  url: string;
  s3Key: string;
  expiresAt: string;
}

export type PortfolioStatusFilter = "all" | PortfolioStatus;
export type PortfolioColorFilter = "all" | PortfolioColorType;
export type StyleFilter = string;

export interface PortfolioImageSlot {
  id: string;
  previewUrl: string;
  key?: string;
  file?: File;
}

export interface PortfolioImagesController {
  slots: PortfolioImageSlot[];
  canAddMore: boolean;
  hasImages: boolean;
  handleAddFiles: (event: ChangeEvent<HTMLInputElement>) => void;
  handleRemove: (id: string) => void;
  resolveKeys: (token: string) => Promise<string[]>;
}
