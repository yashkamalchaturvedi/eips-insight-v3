// This file provides mock API responses for when the app is deployed to Netlify without a backend

import { Proposal, Contributor, Analytics, PROPOSAL_STATUS, PROPOSAL_CATEGORIES, PROPOSAL_TYPES } from '../../shared/schema';

// Sample proposal data
const sampleProposals: Proposal[] = [
  {
    id: 1,
    proposalId: "EIP-4895",
    title: "Beacon chain push withdrawals as operations",
    content: "This EIP adds a new type of push withdrawal operation from the beacon chain to the EVM.",
    author: "Alex Stokes",
    githubUrl: "https://github.com/ethereum/EIPs/pull/4895",
    status: "Final",
    category: "Core",
    type: "EIP",
    createdAt: new Date("2022-03-12T10:30:00Z"),
    updatedAt: new Date("2023-01-15T16:45:00Z")
  },
  {
    id: 2,
    proposalId: "ERC-721",
    title: "Non-Fungible Token Standard",
    content: "A standard interface for non-fungible tokens, also known as deeds.",
    author: "William Entriken",
    githubUrl: "https://github.com/ethereum/EIPs/pull/721",
    status: "Final",
    category: "ERC",
    type: "ERC",
    createdAt: new Date("2018-01-24T09:30:00Z"),
    updatedAt: new Date("2018-06-18T12:15:00Z")
  },
  {
    id: 3,
    proposalId: "EIP-1559",
    title: "Fee market change for ETH 1.0 chain",
    content: "This EIP introduces a transaction pricing mechanism that includes fixed-per-block network fee and dynamically expands/contracts block sizes.",
    author: "Vitalik Buterin",
    githubUrl: "https://github.com/ethereum/EIPs/pull/1559",
    status: "Final",
    category: "Core",
    type: "EIP",
    createdAt: new Date("2019-04-13T14:20:00Z"),
    updatedAt: new Date("2021-08-05T11:10:00Z")
  },
  {
    id: 4,
    proposalId: "ERC-20",
    title: "Token Standard",
    content: "A standard interface for tokens.",
    author: "Fabian Vogelsteller",
    githubUrl: "https://github.com/ethereum/EIPs/pull/20",
    status: "Final",
    category: "ERC",
    type: "ERC",
    createdAt: new Date("2015-11-19T08:40:00Z"),
    updatedAt: new Date("2015-11-26T15:30:00Z")
  },
  {
    id: 5,
    proposalId: "RIP-7212",
    title: "Rollup Fee Delegation",
    content: "A mechanism for rollups to delegate fee payments to third parties.",
    author: "John Adler",
    githubUrl: "https://github.com/ethereum/RIPs/pull/7212",
    status: "Draft",
    category: "Interface",
    type: "RIP",
    createdAt: new Date("2023-05-02T11:15:00Z"),
    updatedAt: new Date("2023-05-15T09:40:00Z")
  },
];

// Sample contributor data
const sampleContributors: Contributor[] = [
  {
    id: 1,
    name: "Alex Stokes",
    githubUsername: "ralexstokes",
    avatarUrl: "https://avatars.githubusercontent.com/u/16617859",
    proposalCount: 14,
    createdAt: new Date("2023-04-18T14:30:00Z")
  },
  {
    id: 2,
    name: "Vitalik Buterin",
    githubUsername: "vbuterin",
    avatarUrl: "https://avatars.githubusercontent.com/u/2111374",
    proposalCount: 28,
    createdAt: new Date("2023-04-22T09:15:00Z")
  },
  {
    id: 3,
    name: "Tim Beiko",
    githubUsername: "timbeiko",
    avatarUrl: "https://avatars.githubusercontent.com/u/9390255",
    proposalCount: 9,
    createdAt: new Date("2023-04-20T11:45:00Z")
  },
  {
    id: 4,
    name: "William Entriken",
    githubUsername: "fulldecent",
    avatarUrl: "https://avatars.githubusercontent.com/u/382183",
    proposalCount: 6,
    createdAt: new Date("2023-04-15T16:20:00Z")
  }
];

// Sample analytics data
const sampleAnalytics: Analytics = {
  id: 1,
  date: new Date(),
  proposalData: {
    total: 784,
    active: 127,
    draft: 245,
    final: 412,
    lastMonth: 18,
    byType: {
      EIP: 356,
      ERC: 378,
      RIP: 50,
    },
    byCategory: {
      Core: 220,
      ERC: 378,
      Interface: 65,
      Networking: 42,
      Meta: 79,
    },
  },
  contributorData: {
    total: 312,
    active: 84,
    newLastMonth: 12,
    commentsLastMonth: 564,
    topContributors: ["vbuterin", "timbeiko", "ralexstokes", "fulldecent"],
  },
  createdAt: new Date()
};

// Mock API functions that mimic the real API but return mock data
export async function fetchProposals(): Promise<Proposal[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(sampleProposals), 500);
  });
}

export async function fetchProposalsByType(type: typeof PROPOSAL_TYPES[number]): Promise<Proposal[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = sampleProposals.filter(p => p.type === type);
      resolve(filtered);
    }, 500);
  });
}

export async function fetchProposalsByStatus(status: typeof PROPOSAL_STATUS[number]): Promise<Proposal[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = sampleProposals.filter(p => p.status === status);
      resolve(filtered);
    }, 500);
  });
}

export async function fetchProposalsByCategory(category: typeof PROPOSAL_CATEGORIES[number]): Promise<Proposal[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = sampleProposals.filter(p => p.category === category);
      resolve(filtered);
    }, 500);
  });
}

export async function fetchProposalById(id: string): Promise<Proposal | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const proposal = sampleProposals.find(p => p.proposalId === id);
      resolve(proposal);
    }, 500);
  });
}

export async function fetchRecentProposals(limit: number): Promise<Proposal[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sorted = [...sampleProposals].sort((a, b) => {
        // Handle null values safely
        const dateA = a.updatedAt ? a.updatedAt.getTime() : 0;
        const dateB = b.updatedAt ? b.updatedAt.getTime() : 0;
        return dateB - dateA;
      });
      resolve(sorted.slice(0, limit));
    }, 500);
  });
}

export async function fetchContributors(): Promise<Contributor[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(sampleContributors), 500);
  });
}

export async function fetchContributorByUsername(username: string): Promise<Contributor | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const contributor = sampleContributors.find(c => c.githubUsername === username);
      resolve(contributor);
    }, 500);
  });
}

export async function fetchTopContributors(limit: number): Promise<Contributor[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sorted = [...sampleContributors].sort((a, b) => {
        // Handle null values safely
        const countA = a.proposalCount ?? 0;
        const countB = b.proposalCount ?? 0;
        return countB - countA;
      });
      resolve(sorted.slice(0, limit));
    }, 500);
  });
}

export async function fetchAnalytics(): Promise<Analytics> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(sampleAnalytics), 500);
  });
}
