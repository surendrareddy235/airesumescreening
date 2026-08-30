import React from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  Stack,
  Chip,
} from "@mui/material";
import { useOutletContext, useNavigate } from "react-router-dom";
import AssistantIcon from "@mui/icons-material/Assistant";
import FeatureCard from "../components/common/FeatureCard";
import PricingTeaser from "../components/common/PricingTeaser";
import ChartCard from "../components/common/ChartCard";
import Badge from "../components/common/Badge";
import IconBadge from "../components/common/IconBadge";
import LucideIcon from "../components/common/LucideIcon";
import SectionHeading from "../components/common/SectionHeading";
import Button from "../components/common/Button";

function HomeHero({ onPrimary, onSecondary }) {
  const navigate = useNavigate();
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        pt: { xs: 8, sm: 10 },
        pb: { xs: 6, sm: 8 },
      }}
      id="home"
    >
      {/* Background Effects */}
      <Box
        sx={{
          position: "absolute",
          top: -96,
          right: -96,
          width: 288,
          height: 288,
          borderRadius: "50%",
          bgcolor: "primary.main",
          opacity: 0.15,
          filter: "blur(40px)",
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -96,
          left: -96,
          width: 288,
          height: 288,
          borderRadius: "50%",
          bgcolor: "primary.main",
          opacity: 0.1,
          filter: "blur(40px)",
          zIndex: -1,
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} lg={6}>
            <Chip
              icon={<LucideIcon name="shield-check" size={16} />}
              label="Enterprise-ready, privacy-first AI"
              sx={{
                bgcolor: "rgba(37,99,235,0.1)",
                color: "primary.main",
                fontWeight: 600,
                mb: 3,
              }}
            />
            <Typography
              variant="h2"
              component="h1"
              fontWeight={800}
              gutterBottom
              sx={{ lineHeight: 1.1 }}
            >
              AI-Powered Resume Screening. Faster. Smarter. Secure.
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ fontSize: "1.125rem", mb: 4 }}
            >
              Automate resume shortlisting, generate job descriptions, and hire
              the right talent using your own secure AI models.
            </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={5}>
                            <Button
                                variant="primary"
                                onClick={() => navigate("/jobs")}
                                iconClass="icon-arrow-right"
                            >
                                Get Started
                                
                            </Button>
                            <Button variant="secondary" onClick={onSecondary} iconClass="icon-message-square-text">Request Demo</Button>
                        </Stack>

            <Grid container spacing={2}>
              {[
                { label: "Time to shortlist", value: "< 2 minutes" },
                { label: "Bulk uploads", value: "100s at once" },
                { label: "Security", value: "Self-hosted AI" },
                { label: "Compliance", value: "Data isolation" },
              ].map((m, i) => (
                <Grid item xs={6} sm={3} key={i}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 1.5,
                      border: 1,
                      borderColor: "divider",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {m.label}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {m.value}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Stack
              direction="row"
              spacing={1}
              mt={3}
              alignItems="center"
              flexWrap="wrap"
            >
              <Typography variant="caption" color="text.secondary">
                No external APIs for resume processing.
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                •
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Bring your own scoring logic.
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card sx={{ overflow: "hidden", boxShadow: 3 }}>
              <Box
                p={2}
                borderBottom={1}
                borderColor="divider"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Screening Dashboard (Preview)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Candidate scores across multiple criteria
                  </Typography>
                </Box>
                <Badge
                  text="Live demo"
                  tone="primary"
                  iconClass="icon-circle-play"
                />
              </Box>
              <Box p={2} display="flex" flexDirection="column" gap={2}>
                <ChartCard
                  title="Skill match distribution"
                  chartId="home-skill-chart"
                  type="bar"
                  iconClass="icon-chart-bar"
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <ChartCard
                      title="Screening throughput"
                      subtitle="Resumes/hr"
                      chartId="home-throughput-chart"
                      type="line"
                      iconClass="icon-chart-line"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card sx={{ p: 2, height: "100%" }}>
                      <Box display="flex" justifyContent="space-between">
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Shortlist automation
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            72%
                          </Typography>
                        </Box>
                        <AssistantIcon
                          sx={{
                            fontSize: 40, // increase icon size
                            color: "#ffffff",
                            backgroundColor: "#1976d2",
                            borderRadius: "30%",
                            padding: "8px",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        mt={1}
                      >
                        Consistent screening decisions with configurable
                        scoring.
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Box
          mt={6}
          pt={4}
          borderTop={1}
          borderColor="divider"
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Box>
            <Typography
              variant="caption"
              fontWeight="bold"
              color="text.secondary"
              display="block"
              mb={1}
              textTransform="uppercase"
            >
              Trusted by teams scaling hiring
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {["users", "briefcase", "building-2", "rocket"].map((icon, i) => (
                <Chip
                  key={i}
                  size="small"
                  icon={<LucideIcon name={icon} size={14} />}
                  label={
                    ["HR Teams", "Recruiters", "Enterprises", "Startups"][i]
                  }
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function WhyChooseUs({ items }) {
  return (
    <Box component="section" sx={{ py: { xs: 8, sm: 10 } }} id="why">
      <Container maxWidth="lg">
        <SectionHeading
          title="Why teams choose us"
          subtitle="A secure, enterprise-ready approach to automate screening at scale."
          align="left"
        />
        <Grid container spacing={6} mt={4}>
          <Grid item xs={12} lg={6}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Gradient header strip */}
              <Box
                sx={{
                  px: 3,
                  py: 2.5,
                  background:
                    "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <LucideIcon name="shield-check" size={22} color="#fff" />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="#fff">
                    Built for privacy & compliance
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    Self-hosted AI · Zero third-party data exposure
                  </Typography>
                </Box>
              </Box>

              {/* Body */}
              <Box p={3} flex={1} display="flex" flexDirection="column" gap={3}>
                {/* Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  lineHeight={1.7}
                >
                  We run self-hosted AI models with strict data isolation, so
                  your resumes never get shared with third-party AI providers.
                </Typography>

                {/* Stat tiles */}
                <Grid container spacing={1.5}>
                  {[
                    {
                      label: "Data flow",
                      value: "Private by default",
                      icon: "shield",
                      color: "#1976d2",
                    },
                    {
                      label: "Controls",
                      value: "Custom scoring logic",
                      icon: "settings-2",
                      color: "#7b1fa2",
                    },
                    {
                      label: "Storage",
                      value: "Your infrastructure",
                      icon: "server",
                      color: "#0288d1",
                    },
                    {
                      label: "Access",
                      value: "Role-based controls",
                      icon: "lock",
                      color: "#2e7d32",
                    },
                  ].map((stat, i) => (
                    <Grid item xs={6} key={i}>
                      <Box
                        sx={{
                          p: 1.5,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                          bgcolor: "#fafafa",
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          height: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: 1.5,
                            bgcolor: `${stat.color}18`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <LucideIcon
                            name={stat.icon}
                            size={15}
                            color={stat.color}
                          />
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.disabled"
                            display="block"
                            lineHeight={1.2}
                          >
                            {stat.label}
                          </Typography>
                          <Typography
                            variant="caption"
                            fontWeight={700}
                            color="text.primary"
                            lineHeight={1.3}
                          >
                            {stat.value}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Checklist */}
                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    fontWeight={700}
                    letterSpacing={1}
                  >
                    What's guaranteed
                  </Typography>
                  <Stack spacing={1} mt={1}>
                    {[
                      "No resume data sent to external AI APIs",
                      "Isolated compute per organisation",
                      "Audit-ready screening logs",
                      "GDPR-aligned data handling",
                    ].map((point, i) => (
                      <Stack
                        key={i}
                        direction="row"
                        spacing={1.2}
                        alignItems="flex-start"
                      >
                        <Box sx={{ mt: "2px", flexShrink: 0 }}>
                          <LucideIcon
                            name="circle-check"
                            size={14}
                            color="#2e7d32"
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          lineHeight={1.6}
                        >
                          {point}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                {/* Trust badge strip */}
                <Box
                  sx={{
                    mt: "auto",
                    pt: 2,
                    borderTop: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {["SOC 2 ready", "GDPR aligned", "Zero-trust"].map(
                    (badge) => (
                      <Chip
                        key={badge}
                        label={badge}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{
                          fontSize: 10,
                          height: 22,
                          borderRadius: 1,
                          fontWeight: 600,
                        }}
                      />
                    ),
                  )}
                  <Typography variant="caption" color="text.disabled" ml="auto">
                    Enterprise safeguards
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Stack spacing={2}>
              {items.map((item, idx) => (
                <Card key={idx} sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box
                      sx={{
                        minWidth: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LucideIcon name={item.icon} size={24} color="#fff" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function UseCases({ items }) {
  const icons = [
    "rocket",
    "graduation-cap",
    "users",
    "briefcase",
    "building-2",
  ];
  const descs = [
    "Screen your pipeline quickly and stay focused on interviews.",
    "Handle large applicant pools with consistent scoring.",
    "Automate shortlisting for mass recruitment campaigns.",
    "Deliver ranked candidates to clients with transparent scoring.",
    "Integrate with hiring operations and maintain strict compliance.",
  ];

  return (
    <Box component="section" sx={{ pb: { xs: 8, sm: 10 } }} id="usecases">
      <Container maxWidth="lg">
        <SectionHeading
          title="Use cases"
          subtitle="From fast-growing startups to high-volume hiring drives."
          align="left"
          mb={4}
        />
        <Grid container spacing={3}>
          {items.map((label, idx) => (
            <Grid item xs={12} sm={6} lg={4} key={idx}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: "secondary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <LucideIcon name={icons[idx]} size={24} color="#fff" />
                </Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {descs[idx]}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

function ProductDemo() {
  return (
    <Box 
      component="section" 
      sx={{ 
        py: { xs: 8, sm: 10 },
        bgcolor: "rgba(25, 118, 210, 0.03)",
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: "divider",
      }} 
      id="demo"
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Chip
            icon={<LucideIcon name="play-circle" size={16} />}
            label="Product Walkthrough"
            sx={{
              bgcolor: "rgba(37,99,235,0.1)",
              color: "primary.main",
              fontWeight: 600,
              mb: 2,
            }}
          />
          <Typography
            variant="h3"
            fontWeight={800}
            gutterBottom
            sx={{ mb: 2 }}
          >
            See it in Action
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto", mb: 4 }}
          >
            Watch our step-by-step guide showing how to create jobs, upload resumes, and screen candidates efficiently with AI-powered insights.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "900px",
              aspectRatio: "16/9",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src="https://embed.app.guidde.com/playbooks/ej5oEHhXtBS1W4SHZuBo8Q?mode=videoOnly"
              title="Demonstrate AI Resume Screening With EmpikaAI Platform"
              frameBorder="0"
              referrerPolicy="unsafe-url"
              allowFullScreen
              allow="clipboard-write; clipboard-read; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-forms allow-same-origin allow-presentation"
              style={{
                borderRadius: "10px",
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function FinalCTA({ onClick, onViewPricing }) {
  const navigate = useNavigate();
  return (
    <Box component="section" sx={{ pb: 8 }}>
      <Container maxWidth="lg">
        <Card
          sx={{
            p: { xs: 4, sm: 8 },
            bgcolor: "secondary.main",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -64,
              right: -64,
              width: 256,
              height: 256,
              borderRadius: "50%",
              bgcolor: "common.white",
              opacity: 0.1,
              filter: "blur(40px)",
            }}
          />

          <Grid container spacing={4} alignItems="center" position="relative">
            <Grid item xs={12} lg={7}>
              <Chip
                icon={<LucideIcon name="sparkles" size={16} color="#fff" />}
                label="Ready to modernize hiring?"
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.2)",
                  mb: 2,
                  "& .MuiChip-icon": { color: "white" },
                }}
              />
              <Typography variant="h3" fontWeight={800} gutterBottom>
                Hire Smarter with AI
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                Build a faster screening workflow with secure self-hosted AI,
                bulk uploads, scoring, and automated outreach.
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              lg={5}
              display="flex"
              justifyContent="flex-end"
              gap={2}
            >
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/jobs");
                  console.log("Navigate to jobs");
                }}
                style={{ backgroundColor: "#fff", color: "#0f172a" }}
              >
                Start Screening
              </Button>
              <Button
                variant="secondary"
                onClick={onViewPricing}
                style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
              >
                View Pricing
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
}

export default function Home() {
  const { openDemo, pushToast } = useOutletContext();
  const navigate = useNavigate();

  // Fallbacks if not provided (shouldn't happen if properly setup in App)
  const onPrimary = () => {
    if (pushToast)
      pushToast({
        tone: "success",
        title: "Next step",
        message: "Thanks! We’ll open the demo request form.",
      });
    if (openDemo) openDemo();
  };

  const onSecondary = () => {
    if (openDemo) openDemo();
  };

  const features = [
    {
      title: "AI Job Description Generator",
      description:
        "Generate accurate and role-specific job descriptions instantly.",
      iconClass: "icon-file-text",
    },
    {
      title: "Bulk Resume Screening",
      description:
        "Upload hundreds of resumes at once and let our AI analyze and rank.",
      iconClass: "icon-folder-up",
    },
    {
      title: "AI-Based Resume Scoring",
      description:
        "Diff-check skills, experience, and relevance against the JD.",
      iconClass: "icon-star",
    },
    {
      title: "Automated Shortlisting",
      description: "Easily segregate shortlisted and rejected candidates.",
      iconClass: "icon-area-chart",
    },
    {
      title: "Custom Email Communication",
      description: "Send personalized emails to candidates directly.",
      iconClass: "icon-mail",
    },
    {
      title: "Enterprise-Grade Security",
      description: "Self-hosted AI models with strict data isolation.",
      iconClass: "icon-lock",
    },
  ];

  const whyChoose = [
    {
      title: "Self-hosted AI models",
      description: "Keep hiring data internal with isolated compute.",
      icon: "shield-check",
    },
    {
      title: "High-volume hiring",
      description: "Process hundreds of resumes in one batch.",
      icon: "layers",
    },
    {
      title: "Unbiased screening",
      description: "Reduce noise with consistent AI scoring.",
      icon: "zap",
    },
    {
      title: "Customizable logic",
      description: "Tune scoring to match each role and team.",
      icon: "settings-2",
    },
    {
      title: "Enterprise standards",
      description: "Designed to match compliance expectations for enterprises.",
      icon: "lock",
    },
  ];

  const useCases = [
    "Startup hiring",
    "Campus recruitment",
    "Mass hiring drives",
    "Recruitment agencies",
    "Enterprise HR automation",
  ];

  return (
    <Box>
      <HomeHero onPrimary={onPrimary} onSecondary={onSecondary} />

      <Box component="section" sx={{ py: 8 }} id="features">
        <Container maxWidth="lg">
          <SectionHeading
            title="Everything you need to screen at scale"
            subtitle="Automate the repetitive work while keeping control of quality, security, and scoring."
            align="center"
          />
          <Grid container spacing={3} mt={4}>
            {features.map((f, i) => (
              <Grid item xs={12} sm={6} lg={4} key={i}>
                <FeatureCard {...f} />
              </Grid>
            ))}
          </Grid>
          <Box mt={6}>
            <PricingTeaser onAction={() => navigate("/pricing")} />
          </Box>
        </Container>
      </Box>

      <WhyChooseUs items={whyChoose} />
      <UseCases items={useCases} />
      <ProductDemo />
      <FinalCTA
        onClick={onSecondary}
        onViewPricing={() => navigate("/pricing")}
      />
    </Box>
  );
}
