import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertProposalSchema, insertContributorSchema, PROPOSAL_TYPES, PROPOSAL_STATUS, PROPOSAL_CATEGORIES } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - all prefixed with /api
  
  // Get all proposals
  app.get("/api/proposals", async (_req, res) => {
    try {
      const proposals = await storage.getProposals();
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Error fetching proposals" });
    }
  });
  
  // Get a specific proposal by ID
  app.get("/api/proposals/:id", async (req, res) => {
    try {
      const proposalId = req.params.id;
      const proposal = await storage.getProposalById(proposalId);
      
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      res.json(proposal);
    } catch (error) {
      res.status(500).json({ message: "Error fetching proposal" });
    }
  });
  
  // Get recent proposals
  app.get("/api/proposals/recent/:limit", async (req, res) => {
    try {
      const limit = parseInt(req.params.limit) || 5;
      const proposals = await storage.getRecentProposals(limit);
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recent proposals" });
    }
  });
  
  // Get proposals by type
  app.get("/api/proposals/type/:type", async (req, res) => {
    try {
      const type = req.params.type;
      
      // Validate type
      if (!PROPOSAL_TYPES.includes(type as any)) {
        return res.status(400).json({ message: "Invalid proposal type" });
      }
      
      const proposals = await storage.getProposalsByType(type as any);
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Error fetching proposals by type" });
    }
  });
  
  // Get proposals by status
  app.get("/api/proposals/status/:status", async (req, res) => {
    try {
      const status = req.params.status;
      
      // Validate status
      if (!PROPOSAL_STATUS.includes(status as any)) {
        return res.status(400).json({ message: "Invalid proposal status" });
      }
      
      const proposals = await storage.getProposalsByStatus(status as any);
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Error fetching proposals by status" });
    }
  });
  
  // Get proposals by category
  app.get("/api/proposals/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      
      // Validate category
      if (!PROPOSAL_CATEGORIES.includes(category as any)) {
        return res.status(400).json({ message: "Invalid proposal category" });
      }
      
      const proposals = await storage.getProposalsByCategory(category as any);
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Error fetching proposals by category" });
    }
  });
  
  // Create a new proposal
  app.post("/api/proposals", async (req, res) => {
    try {
      const proposalData = insertProposalSchema.parse(req.body);
      const proposal = await storage.createProposal(proposalData);
      res.status(201).json(proposal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid proposal data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating proposal" });
    }
  });
  
  // Update a proposal
  app.patch("/api/proposals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid proposal ID" });
      }
      
      const proposal = await storage.getProposal(id);
      
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      const proposalData = req.body;
      const updatedProposal = await storage.updateProposal(id, proposalData);
      
      res.json(updatedProposal);
    } catch (error) {
      res.status(500).json({ message: "Error updating proposal" });
    }
  });
  
  // Get all contributors
  app.get("/api/contributors", async (_req, res) => {
    try {
      const contributors = await storage.getContributors();
      res.json(contributors);
    } catch (error) {
      res.status(500).json({ message: "Error fetching contributors" });
    }
  });
  
  // Get top contributors
  app.get("/api/contributors/top/:limit", async (req, res) => {
    try {
      const limit = parseInt(req.params.limit) || 4;
      const contributors = await storage.getTopContributors(limit);
      res.json(contributors);
    } catch (error) {
      res.status(500).json({ message: "Error fetching top contributors" });
    }
  });
  
  // Get a specific contributor
  app.get("/api/contributors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid contributor ID" });
      }
      
      const contributor = await storage.getContributor(id);
      
      if (!contributor) {
        return res.status(404).json({ message: "Contributor not found" });
      }
      
      res.json(contributor);
    } catch (error) {
      res.status(500).json({ message: "Error fetching contributor" });
    }
  });
  
  // Create a new contributor
  app.post("/api/contributors", async (req, res) => {
    try {
      const contributorData = insertContributorSchema.parse(req.body);
      const contributor = await storage.createContributor(contributorData);
      res.status(201).json(contributor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contributor data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating contributor" });
    }
  });
  
  // Get analytics data
  app.get("/api/analytics", async (_req, res) => {
    try {
      const analytics = await storage.getLatestAnalytics();
      
      if (!analytics) {
        return res.status(404).json({ message: "No analytics data found" });
      }
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Error fetching analytics data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
