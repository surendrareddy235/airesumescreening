import { 
  type User, 
  type InsertUser, 
  type Job, 
  type InsertJob,
  type CandidateSummary,
  type InsertCandidate,
  type EmailVerification,
  type InsertEmailVerification,
  type JobStats
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  updateStripeCustomerId(id: string, customerId: string): Promise<User>;
  updateUserStripeInfo(id: string, info: { customerId: string; subscriptionId: string }): Promise<User>;
  decrementFreeTrialBalance(id: string): Promise<User>;

  // Job operations
  createJob(job: InsertJob & { userId: string }): Promise<Job>;
  getJob(id: string): Promise<Job | undefined>;
  updateJobStatus(id: string, status: string, tokensUsed?: number, cost?: string): Promise<Job>;
  getUserJobs(userId: string): Promise<Job[]>;

  // Candidate operations
  createCandidate(candidate: InsertCandidate): Promise<CandidateSummary>;
  getJobCandidates(jobId: string): Promise<CandidateSummary[]>;
  getShortlistedCandidates(jobId: string): Promise<CandidateSummary[]>;

  // Email verification
  createEmailVerification(verification: InsertEmailVerification): Promise<EmailVerification>;
  getEmailVerification(email: string, code: string): Promise<EmailVerification | undefined>;
  deleteEmailVerification(id: string): Promise<void>;

  // Stats
  getUserStats(userId: string): Promise<JobStats | undefined>;
  updateUserStats(userId: string, updates: Partial<JobStats>): Promise<JobStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private jobs: Map<string, Job> = new Map();
  private candidates: Map<string, CandidateSummary> = new Map();
  private emailVerifications: Map<string, EmailVerification> = new Map();
  private jobStats: Map<string, JobStats> = new Map();

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      isVerified: false,
      freeTrialRemaining: 50,
      paidCredits: 0,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateStripeCustomerId(id: string, customerId: string): Promise<User> {
    return this.updateUser(id, { stripeCustomerId: customerId });
  }

  async updateUserStripeInfo(id: string, info: { customerId: string; subscriptionId: string }): Promise<User> {
    return this.updateUser(id, { 
      stripeCustomerId: info.customerId, 
      stripeSubscriptionId: info.subscriptionId 
    });
  }

  async decrementFreeTrialBalance(id: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const newBalance = Math.max(0, (user.freeTrialRemaining || 0) - 1);
    return this.updateUser(id, { freeTrialRemaining: newBalance });
  }

  async createJob(jobData: InsertJob & { userId: string }): Promise<Job> {
    const id = randomUUID();
    const job: Job = {
      ...jobData,
      id,
      status: "queued",
      tokensUsed: 0,
      cost: "0",
      createdAt: new Date(),
    };
    this.jobs.set(id, job);
    return job;
  }

  async getJob(id: string): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async updateJobStatus(id: string, status: string, tokensUsed?: number, cost?: string): Promise<Job> {
    const job = this.jobs.get(id);
    if (!job) throw new Error("Job not found");
    const updates: Partial<Job> = { status };
    if (tokensUsed !== undefined) updates.tokensUsed = tokensUsed;
    if (cost !== undefined) updates.cost = cost;
    const updatedJob = { ...job, ...updates };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async getUserJobs(userId: string): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(job => job.userId === userId);
  }

  async createCandidate(candidate: InsertCandidate): Promise<CandidateSummary> {
    const id = randomUUID();
    const candidateData: CandidateSummary = {
      ...candidate,
      id,
      createdAt: new Date(),
    };
    this.candidates.set(id, candidateData);
    return candidateData;
  }

  async getJobCandidates(jobId: string): Promise<CandidateSummary[]> {
    return Array.from(this.candidates.values())
      .filter(candidate => candidate.jobId === jobId)
      .sort((a, b) => parseFloat(b.matchScore) - parseFloat(a.matchScore));
  }

  async getShortlistedCandidates(jobId: string): Promise<CandidateSummary[]> {
    return Array.from(this.candidates.values())
      .filter(candidate => candidate.jobId === jobId && candidate.status === "shortlisted")
      .sort((a, b) => parseFloat(b.matchScore) - parseFloat(a.matchScore));
  }

  async createEmailVerification(verification: InsertEmailVerification): Promise<EmailVerification> {
    const id = randomUUID();
    const emailVerification: EmailVerification = {
      ...verification,
      id,
      createdAt: new Date(),
    };
    this.emailVerifications.set(id, emailVerification);
    return emailVerification;
  }

  async getEmailVerification(email: string, code: string): Promise<EmailVerification | undefined> {
    return Array.from(this.emailVerifications.values())
      .find(verification => verification.email === email && verification.code === code);
  }

  async deleteEmailVerification(id: string): Promise<void> {
    this.emailVerifications.delete(id);
  }

  async getUserStats(userId: string): Promise<JobStats | undefined> {
    return this.jobStats.get(userId);
  }

  async updateUserStats(userId: string, updates: Partial<JobStats>): Promise<JobStats> {
    const existing = this.jobStats.get(userId);
    const stats: JobStats = {
      id: existing?.id || randomUUID(),
      userId,
      totalJobs: 0,
      totalCandidates: 0,
      totalTokensUsed: 0,
      totalCost: "0",
      updatedAt: new Date(),
      ...existing,
      ...updates,
    };
    this.jobStats.set(userId, stats);
    return stats;
  }
}

export const storage = new MemStorage();
