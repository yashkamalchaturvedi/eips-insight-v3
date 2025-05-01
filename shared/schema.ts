import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define proposal statuses
export const PROPOSAL_STATUS = [
  "Draft",
  "Review",
  "Last Call",
  "Final",
  "Stagnant",
  "Withdrawn",
  "Living"
] as const;

// Define proposal categories
export const PROPOSAL_CATEGORIES = [
  "Core",
  "Networking",
  "Interface",
  "ERC",
  "Meta",
  "Informational",
  "RIP"
] as const;

// Define proposal types
export const PROPOSAL_TYPES = [
  "EIP",
  "ERC",
  "RIP"
] as const;

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  githubUsername: text("github_username"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Proposals table
export const proposals = pgTable("proposals", {
  id: serial("id").primaryKey(),
  proposalId: text("proposal_id").notNull().unique(), // EIP-1234, ERC-20, etc
  title: text("title").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull().$type<typeof PROPOSAL_CATEGORIES[number]>(),
  type: text("type").notNull().$type<typeof PROPOSAL_TYPES[number]>(),
  status: text("status").notNull().$type<typeof PROPOSAL_STATUS[number]>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  content: text("content"), // markdown content
  githubUrl: text("github_url"),
});

// Contributors table
export const contributors = pgTable("contributors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  githubUsername: text("github_username").notNull().unique(),
  avatarUrl: text("avatar_url"),
  proposalCount: integer("proposal_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Analytics table (storing aggregated data for charts)
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  proposalData: jsonb("proposal_data"), // Store counts by type, status, etc.
  contributorData: jsonb("contributor_data"), // Store contributor activity
  createdAt: timestamp("created_at").defaultNow(),
});

// Create schemas for insertion
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProposalSchema = createInsertSchema(proposals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContributorSchema = createInsertSchema(contributors).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposals.$inferSelect;

export type InsertContributor = z.infer<typeof insertContributorSchema>;
export type Contributor = typeof contributors.$inferSelect;

export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;
