import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { 
  loginSchema, 
  signupSchema, 
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  insertJobSchema
} from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ ok: false, error: "Access token required" });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ ok: false, error: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ ok: false, error: "Invalid token" });
  }
};

// Generate random 6-digit code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send email (mock implementation)
const sendEmail = async (to: string, subject: string, body: string) => {
  console.log(`Email to ${to}: ${subject} - ${body}`);
  // TODO: Implement actual SMTP sending
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { username, email, password } = signupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ ok: false, error: "User already exists" });
      }

      // Generate verification code
      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await storage.createEmailVerification({ email, code, expiresAt });
      await sendEmail(email, "Email Verification", `Your verification code is: ${code}`);

      res.json({ ok: true, message: "Verification code sent to email" });
    } catch (error: any) {
      res.status(400).json({ ok: false, error: error.message });
    }
  });

  app.post("/api/auth/verify", async (req, res) => {
    try {
      const { email, code } = verifyEmailSchema.parse(req.body);
      
      const verification = await storage.getEmailVerification(email, code);
      if (!verification || verification.expiresAt < new Date()) {
        return res.status(400).json({ ok: false, error: "Invalid or expired verification code" });
      }

      // Create user
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await storage.createUser({
        username: req.body.username,
        email,
        password: hashedPassword,
      });

      await storage.updateUser(user.id, { isVerified: true });
      await storage.deleteEmailVerification(verification.id);

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({ 
        ok: true, 
        user: { id: user.id, username: user.username, email: user.email },
        token 
      });
    } catch (error: any) {
      res.status(400).json({ ok: false, error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || !user.isVerified) {
        return res.status(400).json({ ok: false, error: "Invalid credentials or unverified account" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ ok: false, error: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({ 
        ok: true, 
        user: { id: user.id, username: user.username, email: user.email },
        token 
      });
    } catch (error: any) {
      res.status(400).json({ ok: false, error: error.message });
    }
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.json({ ok: true, message: "If account exists, reset code will be sent" });
      }

      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await storage.createEmailVerification({ email, code, expiresAt });
      await sendEmail(email, "Password Reset", `Your reset code is: ${code}`);

      res.json({ ok: true, message: "Reset code sent to email" });
    } catch (error: any) {
      res.status(400).json({ ok: false, error: error.message });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { email, code, newPassword } = resetPasswordSchema.parse(req.body);
      
      const verification = await storage.getEmailVerification(email, code);
      if (!verification || verification.expiresAt < new Date()) {
        return res.status(400).json({ ok: false, error: "Invalid or expired reset code" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ ok: false, error: "User not found" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(user.id, { password: hashedPassword });
      await storage.deleteEmailVerification(verification.id);

      res.json({ ok: true, message: "Password reset successfully" });
    } catch (error: any) {
      res.status(400).json({ ok: false, error: error.message });
    }
  });

  // Job routes
  app.post("/api/jobs/upload", authenticateToken, async (req, res) => {
    try {
      const user = req.user;
      
      // Check if user has remaining credits
      if ((user.freeTrialRemaining || 0) <= 0 && (user.paidCredits || 0) <= 0) {
        return res.status(402).json({ ok: false, error: "No remaining credits. Please upgrade your plan." });
      }

      const { title, jdText } = insertJobSchema.parse(req.body);
      
      const job = await storage.createJob({
        userId: user.id,
        title,
        jdText,
      });

      // Start background processing (simplified for this implementation)
      // In a real app, this would be handled by a proper task queue
      setTimeout(async () => {
        try {
          // Mock processing - generate sample candidates
          const mockCandidates = [
            {
              jobId: job.id,
              name: "Sarah Johnson",
              email: "s.johnson@email.com",
              phone: "+1 (555) 123-4567",
              experienceYears: 8,
              skills: "React, Node.js, Python, AWS",
              matchScore: "94",
              status: "shortlisted",
              reasoning: "Excellent match with required skills and experience"
            },
            {
              jobId: job.id,
              name: "Michael Chen",
              email: "m.chen@email.com",
              phone: "+1 (555) 987-6543",
              experienceYears: 6,
              skills: "Java, Spring, AWS, Docker",
              matchScore: "89",
              status: "shortlisted",
              reasoning: "Strong technical background, good culture fit"
            },
            {
              jobId: job.id,
              name: "Emily Rodriguez",
              email: "e.rodriguez@email.com",
              phone: "+1 (555) 456-7890",
              experienceYears: 4,
              skills: "Vue.js, PHP, MySQL",
              matchScore: "78",
              status: "under_review",
              reasoning: "Some relevant skills but limited experience"
            },
            {
              jobId: job.id,
              name: "David Park",
              email: "d.park@email.com",
              phone: "+1 (555) 789-0123",
              experienceYears: 3,
              skills: "Angular, .NET, SQL Server",
              matchScore: "65",
              status: "under_review",
              reasoning: "Different tech stack but transferable skills"
            },
            {
              jobId: job.id,
              name: "Lisa Thompson",
              email: "l.thompson@email.com",
              phone: "+1 (555) 234-5678",
              experienceYears: 2,
              skills: "HTML, CSS, JavaScript",
              matchScore: "42",
              status: "not_qualified",
              reasoning: "Limited experience and skills for senior role"
            }
          ];

          // Create candidates
          for (const candidateData of mockCandidates) {
            await storage.createCandidate(candidateData);
          }

          // Update job status
          await storage.updateJobStatus(job.id, "completed", 1250, "2.50");
          
          // Update user stats
          const stats = await storage.getUserStats(user.id) || {
            id: "",
            userId: user.id,
            totalJobs: 0,
            totalCandidates: 0,
            totalTokensUsed: 0,
            totalCost: "0",
            updatedAt: new Date()
          };

          await storage.updateUserStats(user.id, {
            totalJobs: stats.totalJobs + 1,
            totalCandidates: stats.totalCandidates + mockCandidates.length,
            totalTokensUsed: stats.totalTokensUsed + 1250,
            totalCost: (parseFloat(stats.totalCost) + 2.50).toString(),
          });

          // Decrement user credits
          await storage.decrementFreeTrialBalance(user.id);

        } catch (error) {
          console.error("Background processing error:", error);
          await storage.updateJobStatus(job.id, "failed");
        }
      }, 5000); // 5 second delay to simulate processing

      res.json({ ok: true, jobId: job.id });
    } catch (error: any) {
      res.status(400).json({ ok: false, error: error.message });
    }
  });

  app.get("/api/jobs/:id/status", authenticateToken, async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job || job.userId !== req.user.id) {
        return res.status(404).json({ ok: false, error: "Job not found" });
      }

      res.json({ ok: true, status: job.status, job });
    } catch (error: any) {
      res.status(400).json({ ok: false, error: error.message });
    }
  });

  app.get("/api/jobs/:id/candidates", authenticateToken, async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job || job.userId !== req.user.id) {
        return res.status(404).json({ ok: false, error: "Job not found" });
      }

      const candidates = await storage.getJobCandidates(req.params.id);
      res.json({ ok: true, candidates });
    } catch (error: any) {
      res.status(400).json({ ok: false, error: error.message });
    }
  });

  app.get("/api/jobs/stats", authenticateToken, async (req, res) => {
    try {
      const user = req.user;
      const stats = await storage.getUserStats(user.id);
      const recentJob = (await storage.getUserJobs(user.id))[0];

      res.json({
        ok: true,
        stats: {
          tokensUsed: stats?.totalTokensUsed || 0,
          cost: stats?.totalCost || "0",
          remainingBalance: user.freeTrialRemaining || 0,
          totalCandidates: recentJob ? (await storage.getJobCandidates(recentJob.id)).length : 0,
        }
      });
    } catch (error: any) {
      res.status(400).json({ ok: false, error: error.message });
    }
  });

  // Export route
  app.get("/api/export/job/:jobId/shortlisted", authenticateToken, async (req, res) => {
    try {
      const job = await storage.getJob(req.params.jobId);
      if (!job || job.userId !== req.user.id) {
        return res.status(404).json({ ok: false, error: "Job not found" });
      }

      const candidates = await storage.getShortlistedCandidates(req.params.jobId);
      
      // Generate CSV
      const headers = ["Name", "Email", "Phone", "Experience", "Skills", "Match Score", "Status"];
      const csvRows = [
        headers.join(","),
        ...candidates.map(candidate => [
          candidate.name,
          candidate.email || "",
          candidate.phone || "",
          `${candidate.experienceYears} years`,
          candidate.skills || "",
          `${candidate.matchScore}%`,
          candidate.status
        ].join(","))
      ];

      const csvContent = csvRows.join("\n");
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="shortlisted-candidates-${job.title}.csv"`);
      res.send(csvContent);
    } catch (error: any) {
      res.status(400).json({ ok: false, error: error.message });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", authenticateToken, async (req, res) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          userId: req.user.id,
        },
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ ok: false, error: "Error creating payment intent: " + error.message });
    }
  });

  // Current user route
  app.get("/api/user/me", authenticateToken, async (req, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.json({ ok: true, user: userWithoutPassword });
  });

  const httpServer = createServer(app);
  return httpServer;
}
