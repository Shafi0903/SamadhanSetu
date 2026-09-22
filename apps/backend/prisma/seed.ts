import { PrismaClient, UserRole, ProblemCategory, ProblemStatus, SolutionStage, PledgeType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SamadhanSetu Database Seeding...");

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

  // Government Officials
  const govOfficer = await prisma.user.create({
    data: {
      fullName: "Officer Rajesh Patil",
      email: "officer.patil@pmc.gov.in",
      passwordHash: defaultPasswordHash,
      role: "GOVERNMENT",
      organizationName: "Pune Municipal Corporation (PMC)",
      designation: "Executive Engineer - Ward 4",
      isVerified: true,
    },
  });

  // University Faculty & Innovation Teams
  const univFaculty = await prisma.user.create({
    data: {
      fullName: "Dr. Anita Kulkarni",
      email: "anita.kulkarni@coep.ac.in",
      passwordHash: defaultPasswordHash,
      role: "UNIVERSITY",
      organizationName: "COEP Technological University",
      designation: "Professor of Civil & Environmental Engineering",
      isVerified: true,
    },
  });

  const iitbFaculty = await prisma.user.create({
    data: {
      fullName: "Prof. Vikram Rao",
      email: "vikram.rao@iitb.ac.in",
      passwordHash: defaultPasswordHash,
      role: "UNIVERSITY",
      organizationName: "Indian Institute of Technology (IIT) Bombay",
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

  console.log("Creating Verified Civic Challenges & Lifecycles...");

  // Problem 1: Claimed & Solution Proposed with CSR Funding (The Active Showcase)
  const problem1 = await prisma.problem.create({
    data: {
      title: "Severe Monsoon Potholes & Road Subsidence on FC Road Junction",
      description:
        "Deep structural potholes have formed across a 300-meter stretch near Goodluck Cafe, causing multiple motorcycle skids and heavy traffic bottlenecks during monsoon rains. Heavy vehicles aggravate sub-base erosion.",
      category: "ROADS_INFRASTRUCTURE",
      status: "SOLUTION_PROPOSED",
      latitude: 18.5218,
      longitude: 73.8415,
      address: "Fergusson College Rd, Shivajinagar",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411004",
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
            description: "Geotagged road hazard grievance filed with photographic evidence.",
            actorId: citizen1.id,
            createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          },
          {
            eventType: "VERIFIED",
            title: "Verified by PMC Nodal Officer",
            description: "On-ground road structural failure validated by Officer Rajesh Patil.",
            actorId: govOfficer.id,
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          },
          {
            eventType: "CLAIMED",
            title: "Claimed by COEP Technological University",
            description: "Dr. Anita Kulkarni claimed this challenge for the Advanced Pavement Capstone team.",
            actorId: univFaculty.id,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          {
            eventType: "SOLUTION_PROPOSED",
            title: "Solution Prototype Proposed",
            description: "COEP team submitted proposal for Quick-Cure Polymer Cold Mix with automated pothole depth sensors.",
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

  // Attach Solution Proposal & Pledge to Problem 1
  const solution1 = await prisma.solutionProposal.create({
    data: {
      problemId: problem1.id,
      teamLeadId: univFaculty.id,
      title: "Eco-Polymer Cold Mix Asphalt with Pre-Cast Modular Filling",
      description:
        "A zero-heat, rapid-curing asphalt matrix utilizing recycled plastic aggregate and polymer bitumen binder. Sets in 30 minutes under active precipitation, eliminating post-monsoon rework.",
      stage: "PROTOTYPE",
      repoUrl: "https://github.com/samadhansetu-innovators/eco-polymer-pothole",
      documentUrls: ["https://example.com/coep-asphalt-research.pdf"],
      pledges: {
        create: [
          {
            sponsorId: industryPartner1.id,
            pledgeType: "CSR_FUNDING",
            amount: 150000,
            description: "Seed funding for manufacturing 2 metric tonnes of test polymer cold mix and pilot road deployment.",
            status: "ACCEPTED",
          },
          {
            sponsorId: industryPartner2.id,
            pledgeType: "MENTORSHIP",
            description: "Weekly materials testing mentorship from civil engineering specialists at Infosys Campus Infrastructure.",
            status: "ACCEPTED",
          },
        ],
      },
    },
  });

  // Problem 2: Fully RESOLVED & Field Deployed Showcase
  const problem2 = await prisma.problem.create({
    data: {
      title: "High-Volume Clean Water Pipeline Leakage at Kothrud Junction",
      description:
        "Sub-surface drinking water distribution line suffered severe joint rupture, causing thousands of liters of treated water to pool on the street daily.",
      category: "WATER",
      status: "RESOLVED",
      latitude: 18.5074,
      longitude: 73.8077,
      address: "Karve Road, near Paud Phata, Kothrud",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411038",
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
            description: "Reported with geo-tag by citizen Priya Sharma.",
            actorId: citizen2.id,
            createdAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000),
          },
          {
            eventType: "VERIFIED",
            title: "Verified by Nodal Authority",
            description: "Pipeline loss confirmed by PMC Water Works.",
            actorId: govOfficer.id,
            createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          },
          {
            eventType: "CLAIMED",
            title: "Claimed by IIT Bombay",
            description: "Adopted by IITB IoT Sensor Lab under Prof. Vikram Rao.",
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

  // Problem 3: Verified Challenge Open for Claims on Challenge Board
  await prisma.problem.create({
    data: {
      title: "Garbage Overflow & Waste Segregation Breakdown at Market Yard Gate 3",
      description:
        "Daily vegetable and organic market waste accumulates into uncontrolled mounds, leading to stray animal feeding and health hazards. Requires smart organic compost conversion or solar incinerator prototype.",
      category: "WASTE_MANAGEMENT",
      status: "VERIFIED",
      latitude: 18.4947,
      longitude: 73.8682,
      address: "Gultekdi Market Yard",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411037",
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
            description: "Citizen logged market yard waste disposal crisis.",
            actorId: citizen1.id,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
          {
            eventType: "VERIFIED",
            title: "Verified by Nodal Authority",
            description: "Sanitation inspectors verified site conditions. Published to University Challenge Board.",
            actorId: govOfficer.id,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        ],
      },
    },
  });

  // Problem 4: Pending Verification in Gov Triage Queue
  await prisma.problem.create({
    data: {
      title: "Flickering & Non-Operational Streetlights along Pune University Flyover",
      description:
        "Over 8 LED streetlamp fixtures along the northbound flyover ramp have suffered power supply failures, reducing visibility at night and increasing accident risk.",
      category: "ELECTRICITY_ENERGY",
      status: "PENDING_VERIFICATION",
      latitude: 18.5362,
      longitude: 73.8298,
      address: "Savitribai Phule Pune University Flyover, Ganeshkhind",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411007",
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

  console.log("✅ Database Seeding Completed Successfully!");
  console.log("-----------------------------------------------");
  console.log("Demo Accounts (Password: Password@123):");
  console.log(" - Citizen OTP: 9876543210 (Demo OTP: 123456)");
  console.log(" - Government: officer.patil@pmc.gov.in");
  console.log(" - University: anita.kulkarni@coep.ac.in");
  console.log(" - University: vikram.rao@iitb.ac.in");
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
