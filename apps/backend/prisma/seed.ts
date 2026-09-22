import { PrismaClient, UserRole, ProblemCategory, ProblemStatus, SolutionStage, PledgeType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SamadhanSetu Database Seeding (Kolkata Region)...");

  // 1. Clean existing records (in dependency order)
  await prisma.notification.deleteMany({});
  await prisma.timelineEvent.deleteMany({});
  await prisma.problemUpvote.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.supportPledge.deleteMany({});
  await prisma.solutionProposal.deleteMany({});
  await prisma.problem.deleteMany({});
  await prisma.user.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash("Password@123", salt);

  // 2. Seed Users across all 4 personas
  console.log("Creating Stakeholder Personas...");

  // Citizens
  const citizen1 = await prisma.user.create({
    data: {
      fullName: "Ramesh Kumar",
      phone: "+919876543210",
      email: "ramesh.citizen@gmail.com",
      role: "CITIZEN",
      isVerified: true,
    },
  });

  const citizen2 = await prisma.user.create({
    data: {
      fullName: "Priya Sharma",
      phone: "+919876543211",
      email: "priya.sharma@gmail.com",
      role: "CITIZEN",
      isVerified: true,
    },
  });

  // Government Officials (Kolkata Municipal Corporation)
  const govOfficer = await prisma.user.create({
    data: {
      fullName: "Officer Rajesh Patil",
      email: "officer.patil@kmc.gov.in",
      passwordHash: defaultPasswordHash,
      role: "GOVERNMENT",
      organizationName: "Kolkata Municipal Corporation (KMC)",
      designation: "Executive Engineer - Borough V",
      isVerified: true,
    },
  });

  // University Faculty & Innovation Teams (Jadavpur University & IIEST Shibpur)
  const univFaculty = await prisma.user.create({
    data: {
      fullName: "Dr. Anita Kulkarni",
      email: "anita.kulkarni@jadavpuruniversity.in",
      passwordHash: defaultPasswordHash,
      role: "UNIVERSITY",
      organizationName: "Jadavpur University",
      designation: "Professor of Civil & Environmental Engineering",
      isVerified: true,
    },
  });

  const iitbFaculty = await prisma.user.create({
    data: {
      fullName: "Prof. Vikram Rao",
      email: "vikram.rao@iiests.ac.in",
      passwordHash: defaultPasswordHash,
      role: "UNIVERSITY",
      organizationName: "IIEST Shibpur",
      designation: "Head of Sensor & IoT Innovations Lab",
      isVerified: true,
    },
  });

  // Industry CSR Sponsors
  const industryPartner1 = await prisma.user.create({
    data: {
      fullName: "Sunil Mehta",
      email: "csr.mehta@tatatrusts.org",
      passwordHash: defaultPasswordHash,
      role: "INDUSTRY",
      organizationName: "Tata Trusts CSR Foundation",
      designation: "Director - Urban Infrastructure Grants",
      isVerified: true,
    },
  });

  const industryPartner2 = await prisma.user.create({
    data: {
      fullName: "Meera Nair",
      email: "csr.nair@infosys.org",
      passwordHash: defaultPasswordHash,
      role: "INDUSTRY",
      organizationName: "Infosys Foundation",
      designation: "Lead Mentor - Academic Partnerships",
      isVerified: true,
    },
  });

  console.log("Creating Verified Civic Challenges & Lifecycles in Kolkata...");

  // Problem 1: Claimed & Solution Proposed with CSR Funding (Park Street Showcase)
  const problem1 = await prisma.problem.create({
    data: {
      title: "Severe Monsoon Potholes & Road Subsidence on Park Street Junction",
      description:
        "Deep structural potholes have formed across a 300-meter stretch near Park Street and Camac Street crossing, causing multiple vehicular skids and heavy traffic bottlenecks during monsoon rains. Heavy commercial traffic aggravates sub-base erosion.",
      category: "ROADS_INFRASTRUCTURE",
      status: "SOLUTION_PROPOSED",
      latitude: 22.5510,
      longitude: 88.3524,
      address: "Park Street & Camac Street Crossing, Ward 63",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700016",
      mediaUrls: [
        "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop",
      ],
      reporterId: citizen1.id,
      verifiedById: govOfficer.id,
      verifiedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      claimedById: univFaculty.id,
      claimedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      timelineEvents: {
        create: [
          {
            eventType: "REPORTED",
            title: "Problem Reported by Citizen",
            description: "Geotagged road hazard grievance filed with photographic evidence near Park Street.",
            actorId: citizen1.id,
            createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          },
          {
            eventType: "VERIFIED",
            title: "Verified by KMC Nodal Officer",
            description: "On-ground road structural failure validated by Officer Rajesh Patil (KMC Borough V).",
            actorId: govOfficer.id,
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          },
          {
            eventType: "CLAIMED",
            title: "Claimed by Jadavpur University",
            description: "Dr. Anita Kulkarni claimed this challenge for the Advanced Pavement & Infrastructure Capstone team.",
            actorId: univFaculty.id,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          {
            eventType: "SOLUTION_PROPOSED",
            title: "Solution Prototype Proposed",
            description: "Jadavpur University team submitted proposal for Quick-Cure Polymer Cold Mix with automated pothole depth sensors.",
            actorId: univFaculty.id,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
          {
            eventType: "SUPPORT_PLEDGED",
            title: "CSR Grant Pledged by Tata Trusts",
            description: "Tata Trusts CSR Foundation committed ₹1,50,000 grant and field testing materials.",
            actorId: industryPartner1.id,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
        ],
      },
    },
  });

  // Attach Solution Proposal
  await prisma.solutionProposal.create({
    data: {
      problemId: problem1.id,
      teamLeadId: univFaculty.id,
      title: "Rapid-Cure Geopolymer Cold-Mix Asphalt Patch",
      description:
        "Standard bitumen fails prematurely in high-moisture delta conditions like Kolkata. Our geopolymer cold mix cures rapidly in 45 minutes, withstands 15-ton axle loads, and utilizes industrial fly ash from local thermal units, reducing carbon footprint by 40%.",
      stage: "PROTOTYPE",
      repoUrl: "https://github.com/samadhansetu-innovators/geopolymer-coldmix",
      documentUrls: ["https://samadhansetu-docs.org/prototypes/geopolymer-pothole-v1.pdf"],
      pledges: {
        create: [
          {
            sponsorId: industryPartner1.id,
            pledgeType: "CSR_FUNDING",
            amount: 150000,
            description: "Grant approved under Urban Infrastructure Resilience Grant FY26. Includes testing laboratory materials.",
            status: "FULFILLED",
          },
        ],
      },
    },
  });

  // Problem 2: Fully RESOLVED & Field Deployed Showcase (Gariahat Crossing)
  const problem2 = await prisma.problem.create({
    data: {
      title: "High-Volume Clean Water Pipeline Leakage at Gariahat Crossing",
      description:
        "Sub-surface drinking water distribution line suffered severe joint rupture near Gariahat Pantaloons crossing, causing thousands of liters of treated potable water to pool on the street daily.",
      category: "WATER",
      status: "RESOLVED",
      latitude: 22.5195,
      longitude: 88.3653,
      address: "Gariahat Road near Pantaloons Crossing, Ward 85",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700019",
      mediaUrls: [
        "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop",
      ],
      reporterId: citizen2.id,
      verifiedById: govOfficer.id,
      verifiedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      claimedById: iitbFaculty.id,
      claimedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      timelineEvents: {
        create: [
          {
            eventType: "REPORTED",
            title: "Problem Reported by Citizen",
            description: "Reported with geo-tag by citizen Priya Sharma at Gariahat.",
            actorId: citizen2.id,
            createdAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000),
          },
          {
            eventType: "VERIFIED",
            title: "Verified by KMC Nodal Authority",
            description: "Pipeline loss confirmed by KMC Water Supply Dept engineers.",
            actorId: govOfficer.id,
            createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          },
          {
            eventType: "CLAIMED",
            title: "Claimed by IIEST Shibpur",
            description: "Adopted by IIEST Shibpur IoT Sensor Lab under Prof. Vikram Rao.",
            actorId: iitbFaculty.id,
            createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          },
          {
            eventType: "SUPPORT_PLEDGED",
            title: "Supported by Infosys Foundation",
            description: "₹2,00,000 micro-grant for acoustic sensor hardware.",
            actorId: industryPartner2.id,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          },
          {
            eventType: "RESOLVED",
            title: "Solution Deployed & Leak Permanently Fixed",
            description: "Acoustic IoT pressure sensor pinpointed hairline crack. Repair clamped and verified with 0% pressure drop.",
            actorId: govOfficer.id,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        ],
      },
    },
  });

  await prisma.solutionProposal.create({
    data: {
      problemId: problem2.id,
      teamLeadId: iitbFaculty.id,
      title: "LoRaWAN Non-Invasive Acoustic Pipe Flow Monitor",
      description: "Clamp-on ultrasonic sensor measuring acoustic vibration signatures to detect subterranean pipe micro-leaks before catastrophic bursts.",
      stage: "DEPLOYED",
      repoUrl: "https://github.com/samadhansetu-innovators/acoustic-water-monitor",
      pledges: {
        create: [
          {
            sponsorId: industryPartner2.id,
            pledgeType: "CSR_FUNDING",
            amount: 200000,
            description: "Complete hardware grant for 10 LoRaWAN nodes.",
            status: "FULFILLED",
          },
        ],
      },
    },
  });

  // Problem 3: Verified Challenge Open for Claims on Challenge Board (Koley Market)
  await prisma.problem.create({
    data: {
      title: "Garbage Overflow & Waste Segregation Breakdown at Koley Market Gate 2",
      description:
        "Daily vegetable and wholesale organic market waste accumulates into uncontrolled mounds near Sealdah, leading to stray animal feeding and health hazards. Requires smart organic compost conversion or solar incinerator prototype.",
      category: "WASTE_MANAGEMENT",
      status: "VERIFIED",
      latitude: 22.5685,
      longitude: 88.3712,
      address: "Koley Market, Beliaghata Main Road, Ward 36",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700014",
      mediaUrls: [
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop",
      ],
      reporterId: citizen1.id,
      verifiedById: govOfficer.id,
      verifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      timelineEvents: {
        create: [
          {
            eventType: "REPORTED",
            title: "Reported by Citizen",
            description: "Citizen logged Koley Market waste disposal crisis.",
            actorId: citizen1.id,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
          {
            eventType: "VERIFIED",
            title: "Verified by KMC Nodal Authority",
            description: "Sanitation inspectors verified site conditions. Published to University Challenge Board.",
            actorId: govOfficer.id,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        ],
      },
    },
  });

  // Problem 4: Pending Verification in Gov Triage Queue (Maa Flyover)
  await prisma.problem.create({
    data: {
      title: "Flickering & Non-Operational Streetlights along Maa Flyover, EM Bypass",
      description:
        "Over 8 LED streetlamp fixtures along the northbound Maa flyover ramp have suffered power supply failures, reducing visibility at night and increasing accident risk.",
      category: "ELECTRICITY_ENERGY",
      status: "PENDING_VERIFICATION",
      latitude: 22.5392,
      longitude: 88.3970,
      address: "Maa Flyover Connector near Science City, EM Bypass",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700046",
      mediaUrls: [
        "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop",
      ],
      reporterId: citizen2.id,
      timelineEvents: {
        create: [
          {
            eventType: "REPORTED",
            title: "Reported by Citizen",
            description: "Citizen reported lighting hazard via mobile portal.",
            actorId: citizen2.id,
          },
        ],
      },
    },
  });

  // Upvotes
  await prisma.problemUpvote.create({
    data: { problemId: problem1.id, userId: citizen2.id },
  });
  await prisma.problemUpvote.create({
    data: { problemId: problem2.id, userId: citizen1.id },
  });

  console.log("✅ Database Seeding Completed Successfully for Kolkata!");
  console.log("-----------------------------------------------");
  console.log("Demo Accounts (Password: Password@123):");
  console.log(" - Citizen OTP: 9876543210 (Demo OTP: 123456)");
  console.log(" - Government: officer.patil@kmc.gov.in");
  console.log(" - University: anita.kulkarni@jadavpuruniversity.in");
  console.log(" - University: vikram.rao@iiests.ac.in");
  console.log(" - Industry CSR: csr.mehta@tatatrusts.org");
  console.log(" - Industry CSR: csr.nair@infosys.org");
  console.log("-----------------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
