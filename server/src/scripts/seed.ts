import { prisma } from "../lib/prisma.js";

async function main() {
  console.log("Seeding Cipher Club initial data...");

  // 1. Team Members
  const existingMembers = await prisma.teamMember.count();
  if (existingMembers === 0) {
    console.log("Seeding team members...");
    const members = [
      {
        name: "Nazmin Ziya",
        role: "TREASURER",
        photoUrl: "/assets/leaders/nazmin.jpg",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 1,
      },
      {
        name: "Jeslin Ninora",
        role: "JOINT TREASURER",
        photoUrl: "/assets/leaders/jeslin.jpg",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 2,
      },
      {
        name: "Elston Herold Pereira",
        role: "PRESIDENT",
        photoUrl: "/assets/leaders/elston.jpg",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 3,
      },
      {
        name: "Raynell Lewis",
        role: "VICE PRESIDENT",
        photoUrl: "/assets/leaders/raynell.jpg",
        modalPhotoUrl: "/assets/leaders/raynell_modal.jpg",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 4,
      },
      {
        name: "Chaitra R M",
        role: "SECRETARY",
        photoUrl: "/assets/leaders/chaitra.jpg",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 5,
      },
    ];

    for (const m of members) {
      await prisma.teamMember.create({ data: m });
    }
  }

  // 2. Events & Slides
  const existingEvents = await prisma.event.count();
  if (existingEvents === 0) {
    console.log("Seeding events & slides...");
    await prisma.event.create({
      data: {
        title: "Lumière — The Gala",
        tag: "BRANCH GALA",
        dateTag: "29 OCT 2025",
        subTitle: "29 OCTOBER 2025 · KALAM AUDITORIUM",
        slug: "LUMIERE_GALA",
        cardSub: "CSE Branch Entry · Kalam Auditorium",
        shortDesc: "The CSE branch entry programme at Kalam Auditorium, themed “Where Glam Meets Glow.” Organised by the Cipher Association with coordinated red, gold and black décor, it welcomed students into the department and reinforced a shared sense of collective identity.",
        fullDescription: JSON.stringify([
          "The Department of Computer Science and Engineering (CSE) held its branch entry programme, “Lumière – The Gala,” on 29 October 2025 at the Kalam Auditorium. Organised by the Cipher Association, the event welcomed students into the department through a formal gathering centred on the theme “Where Glam Meets Glow.” The venue featured coordinated red, gold and black décor, floral arrangements, illuminated panels and a central Lumière backdrop.",
          "The programme gave students an opportunity to interact with peers and take part in a shared departmental event beyond academics, highlighting the role of the Cipher Association in organising student-led activities. It concluded as a formal branch entry that marked the students’ transition into the department and reinforced a sense of collective identity."
        ]),
        displayOrder: 1,
        isPublished: true,
        slides: {
          create: Array.from({ length: 8 }, (_, i) => ({
            imageUrl: `/assets/lumiere/slide_${String(i + 1).padStart(2, "0")}.jpg`,
            order: i + 1,
          })),
        },
      },
    });

    await prisma.event.create({
      data: {
        title: "PROMPT OPS-2K26",
        tag: "COMPETITION",
        dateTag: "25 MAR 2026",
        subTitle: "25 MARCH 2026 · PROMPT ENGINEERING COMPETITION",
        slug: "PROMPT_OPS",
        cardSub: "AgentBlazer Club × Cipher",
        shortDesc: "A technical competition on prompt engineering and AI tools by the AgentBlazer Club and Cipher. Track 1 covered invitation, logo and image recreation; Track 2 tested JSON conversion, Python debugging and a Gemini AI security prompt challenge.",
        fullDescription: JSON.stringify([
          "Organized by the AgentBlazer Club and Cipher under the guidance of Ms. Nisha J Roche, Ms. Jaishma K, and HOD Dr. Melwyn D’Souza, this technical competition focused on prompt engineering and AI tools.",
          "Track 1 featured invitation generation, logo recreation, and image recreation rounds.",
          "Track 2 tested students in JSON conversion, Python code debugging, and a Gemini AI security prompt extraction challenge."
        ]),
        displayOrder: 2,
        isPublished: true,
        slides: {
          create: Array.from({ length: 8 }, (_, i) => ({
            imageUrl: `/assets/promptops/slide_${String(i + 1).padStart(2, "0")}.jpg`,
            order: i + 1,
          })),
        },
      },
    });
  }

  // 3. Activities
  const existingActivities = await prisma.activity.count();
  if (existingActivities === 0) {
    console.log("Seeding activities...");
    const activities = [
      { numberId: "01", title: "Applied Machine Learning", displayOrder: 1 },
      { numberId: "02", title: "Industrial Visit", displayOrder: 2 },
      { numberId: "03", title: "LaTeX Tool", displayOrder: 3 },
      { numberId: "04", title: "Robotic Process Automation using UiPath", displayOrder: 4 },
      { numberId: "05", title: "HackTO Future 20", displayOrder: 5 },
      { numberId: "06", title: "How to Win at the Sport of Programming", displayOrder: 6 },
      { numberId: "07", title: "Introduction to Google Crowdsource", displayOrder: 7 },
      { numberId: "08", title: "Educational Session on GitHub", displayOrder: 8 },
      { numberId: "09", title: "Industrial Visit", displayOrder: 9 },
      { numberId: "10", title: "UDAAN Mock Interview", displayOrder: 10 },
      { numberId: "11", title: "Freshers Onboarding Programme", displayOrder: 11 },
      { numberId: "12", title: "Projects Funded by KSCST", displayOrder: 12 },
      { numberId: "13", title: "Generative AI Tools for Research", displayOrder: 13 },
      { numberId: "14", title: "Introduction to Blockchain: Solidity Workshop", displayOrder: 14 },
      { numberId: "15", title: "Star UML", displayOrder: 15 },
      { numberId: "16", title: "Generative AI: Custom Solutions using OpenAI", displayOrder: 16 },
      { numberId: "17", title: "React.js and Node.js Workshop", displayOrder: 17 },
    ];

    for (const a of activities) {
      await prisma.activity.create({ data: a });
    }
  }

  // 4. Domains
  const existingDomains = await prisma.domain.count();
  if (existingDomains === 0) {
    console.log("Seeding domains...");
    const domains = [
      {
        name: "Technical Skill Building",
        sessionsLabel: "5 SESSIONS",
        iconName: "Code2",
        description: "Hands-on workshops, coding sessions, and tech talks that turn theory into working software.",
        displayOrder: 1,
      },
      {
        name: "Leadership & Governance",
        sessionsLabel: "3 SESSIONS",
        iconName: "Crown",
        description: "Annual elections for President, Secretary, and office bearers — guided by the HOD and Faculty Coordinator.",
        displayOrder: 2,
      },
      {
        name: "Events & Collaboration",
        sessionsLabel: "8 SESSIONS",
        iconName: "Users",
        description: "Hackathons, seminars, and department-level competitions that bring students together.",
        displayOrder: 3,
      },
      {
        name: "Industry Readiness",
        sessionsLabel: "4 SESSIONS",
        iconName: "Rocket",
        description: "Bridging classroom learning with real-world application to prepare students for the field.",
        displayOrder: 4,
      },
    ];

    for (const d of domains) {
      await prisma.domain.create({ data: d });
    }
  }

  // 5. Website Content
  console.log("Seeding website content...");
  const contentItems = [
    { key: "site_logo_url", value: "/assets/logo.png", section: "brand", label: "Navbar & Club Logo Image", type: "image" },
    { key: "allow_theme_toggle", value: "true", section: "brand", label: "Allow Public Theme Mode Switch", type: "text" },
    { key: "hero_title", value: "Student Association of Computer Science & Engineering", section: "hero", label: "Hero Main Title", type: "text" },
    { key: "hero_subtitle", value: "Bridging academic knowledge and practical application – a community of aspiring professionals in computing.", section: "hero", label: "Hero Subtitle", type: "textarea" },
    { key: "hero_join_btn", value: "JOIN CIPHER", section: "hero", label: "Hero Join Button Text", type: "text" },
    { key: "hero_events_btn", value: "EXPLORE EVENTS", section: "hero", label: "Hero Events Button Text", type: "text" },
    { key: "about_title", value: "Who we are", section: "about", label: "About Section Heading", type: "text" },
    { key: "about_text", value: "CIPHER is the student association of the Department of Computer Science & Engineering. It serves as a platform for students to nurture their technical and interpersonal skills through innovative and collaborative activities. The association strives to bridge the gap between academic knowledge and practical application, fostering a community of aspiring professionals dedicated to excellence in computing.", section: "about", label: "About Section Description", type: "textarea" },
    { key: "about_photo_1", value: "/assets/about/about_1.jpg", section: "about", label: "About Photo 1", type: "url" },
    { key: "about_photo_2", value: "/assets/about/about_2.jpg", section: "about", label: "About Photo 2", type: "url" },
    { key: "about_photo_3", value: "/assets/about/about_3.jpg", section: "about", label: "About Photo 3", type: "url" },
    { key: "about_photo_4", value: "", section: "about", label: "About Photo 4", type: "url" },
    { key: "about_photo_5", value: "", section: "about", label: "About Photo 5", type: "url" },
    { key: "about_photo_6", value: "", section: "about", label: "About Photo 6", type: "url" },
    { key: "about_photo_7", value: "", section: "about", label: "About Photo 7", type: "url" },
    { key: "about_photo_8", value: "", section: "about", label: "About Photo 8", type: "url" },
    { key: "about_stat_1_val", value: "CSE Dept", section: "about", label: "Stat 1 Value", type: "text" },
    { key: "about_stat_1_label", value: "Founded Under", section: "about", label: "Stat 1 Label", type: "text" },
    { key: "about_stat_2_val", value: "250+", section: "about", label: "Stat 2 Value", type: "text" },
    { key: "about_stat_2_label", value: "Active Members", section: "about", label: "Stat 2 Label", type: "text" },
    { key: "about_stat_3_val", value: "17+", section: "about", label: "Stat 3 Value", type: "text" },
    { key: "about_stat_3_label", value: "Events Hosted", section: "about", label: "Stat 3 Label", type: "text" },
    { key: "about_stat_4_val", value: "SJEC", section: "about", label: "Stat 4 Value", type: "text" },
    { key: "about_stat_4_label", value: "Campus Chapter", section: "about", label: "Stat 4 Label", type: "text" },
    { key: "about_mission_title", value: "Empowering Engineers Through Creation", section: "about", label: "Mission Heading", type: "text" },
    { key: "about_mission_desc", value: "CIPHER serves as the catalytic platform for Computer Science & Engineering students to transform theoretical computer science concepts into scalable software products, competitive programming acumen, and impactful community initiatives.", section: "about", label: "Mission Description", type: "textarea" },
    { key: "about_vision_title", value: "A Legacy of Technical Excellence", section: "about", label: "Vision Heading", type: "text" },
    { key: "about_vision_desc", value: "To be recognized across technological universities as a beacon of student-driven innovation, producing ethical technologists, visionary startup founders, and research pioneers equipped to solve computing's next grand challenges.", section: "about", label: "Vision Description", type: "textarea" },
    { key: "about_pillars_title", value: "How We Operate", section: "about", label: "Pillars Heading", type: "text" },
    { key: "about_pillars_badge", value: "Department Pillars", section: "about", label: "Pillars Badge", type: "text" },
    { key: "about_timeline_title", value: "Association Timeline", section: "about", label: "Timeline Heading", type: "text" },
    { key: "about_timeline_badge", value: "Chronological Journey", section: "about", label: "Timeline Badge", type: "text" },
    { key: "about_timeline_desc", value: "Pivotal milestones, high-impact events, and technical milestones shaping the CIPHER community.", section: "about", label: "Timeline Subtitle", type: "textarea" },
    { key: "activities_desc", value: "Hands-on workshops, industrial visits, and technical sessions run by the Cipher Association — spanning AI, blockchain, research tooling, and career prep.", section: "activities", label: "Activities Section Intro", type: "textarea" },
    { key: "join_heading", value: "Join the Team", section: "join", label: "Join Section Heading", type: "text" },
    { key: "join_text", value: "Whether you want to build, lead, or simply learn — CIPHER is where CSE students turn curiosity into capability. Join the community and help shape what comes next.", section: "join", label: "Join Section Description", type: "textarea" },
    { key: "contact_email", value: "cipher@sjec.ac.in", section: "footer", label: "Contact Email", type: "text" },
    { key: "linkedin_url", value: "https://linkedin.com", section: "footer", label: "LinkedIn URL", type: "url" },
    { key: "github_url", value: "https://github.com", section: "footer", label: "GitHub URL", type: "url" },
    { key: "instagram_url", value: "https://instagram.com", section: "footer", label: "Instagram URL", type: "url" },
    { key: "footer_copyright", value: "> © 2026 CIPHER SJEC.", section: "footer", label: "Footer Copyright Text", type: "text" },
  ];

  for (const item of contentItems) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    });
  }

  // 6. Blog Posts
  const existingPosts = await prisma.blogPost.count();
  if (existingPosts === 0) {
    console.log("Seeding blog posts...");
    const samplePosts = [
      {
        title: "Inside PROMPT OPS-2K26: How We Built an Adversarial Gemini AI Prompt Challenge",
        slug: "inside-prompt-ops-2k26",
        category: "AI & PROMPTS",
        readTime: "4 MIN READ",
        author: "Technical Committee",
        authorRole: "Cipher Core",
        coverImage: "/assets/promptops/slide_01.jpg",
        summary: "A deep dive into how Cipher and AgentBlazer created real-world prompt extraction testbeds, JSON transformation challenges, and Python debugging rounds for CSE students.",
        content: JSON.stringify([
          "On March 25, 2026, Kalam Auditorium saw over 120 students compete in PROMPT OPS-2K26. Rather than conventional coding rounds, this competition treated language models as runtime environments requiring adversarial testing, structured output extraction, and guardrail navigation.",
          "Track 1 tested foundational image and visual generation prompting. Participants were provided intricate technical diagrams and had to reconstruct high-fidelity vectors and banners through iterative prompt refinement.",
          "Track 2 introduced system-prompt extraction and JSON normalization under constraint. Contestants were presented with hardened LLM endpoints and had to extract secret keys while verifying schema compliance through automated Python unit tests.",
          "The competition demonstrated that prompt engineering in 2026 is no longer about guessing adjectives—it is about deterministic structured input/output design, API schema adherence, and security awareness."
        ]),
        displayOrder: 1,
        isPublished: true,
      },
      {
        title: "From Zero to Solidity: What We Covered in the Smart Contract Workshop",
        slug: "from-zero-to-solidity-workshop",
        category: "BLOCKCHAIN",
        readTime: "5 MIN READ",
        author: "Domain Leads",
        authorRole: "Technical Domain",
        coverImage: "/assets/lumiere/slide_01.jpg",
        summary: "Key takeaways from our hands-on Solidity workshop: EVM architecture, gas optimization, smart contract state variables, and deploying on Sepolia testnets.",
        content: JSON.stringify([
          "Decentralized systems remain one of the most intellectually rewarding paradigms for software engineers. In Session 14 of Cipher's Technical Domain track, we hosted an intensive Solidity and Web3 developer crash course.",
          "We started with the Ethereum Virtual Machine (EVM) stack model, memory vs storage vs calldata, and why gas optimization matters when deploying production code.",
          "Students created their own ERC-20 token contract, wrote automated test suites with Hardhat, and successfully broadcasted deployment transactions to the Sepolia testnet.",
          "Code repositories and deployment guides are available on the Cipher GitHub organization for all club members."
        ]),
        displayOrder: 2,
        isPublished: true,
      },
      {
        title: "Cracking Technical Interviews: Lessons from the UDAAN Mock Drives",
        slug: "cracking-technical-interviews-udaan",
        category: "CAREERS",
        readTime: "6 MIN READ",
        author: "Senior Council",
        authorRole: "Cipher Alumni",
        summary: "Insights from senior CSE students and alumni on data structures, system design fundamentals, resume curation, and navigating high-pressure technical interviews.",
        content: JSON.stringify([
          "The UDAAN Mock Interview initiative was established to simulate real-world campus recruitment and off-campus tech evaluations.",
          "Through three rigorous rounds—DSA problem solving, system architecture discussions, and HR behavioral screenings—candidates received real-time constructive feedback from seniors placed in top product companies.",
          "Key takeaway 1: Communicate thought processes before writing code. Interviewers prioritize how you formulate constraints and edge cases.",
          "Key takeaway 2: Deep fundamentals in operating systems, DBMS indexing, and networking protocols matter far more than buzzwords on resumes."
        ]),
        displayOrder: 3,
        isPublished: true,
      },
      {
        title: "Modern Research Tooling: Accelerating Academic Paper Reviews with AI",
        slug: "modern-research-tooling-ai",
        category: "RESEARCH",
        readTime: "3 MIN READ",
        author: "Faculty Advisory",
        authorRole: "CSE Department",
        summary: "How CSE undergraduate researchers can leverage LaTeX, citation graphing, and semantic search tools to organize literature reviews without sacrificing academic integrity.",
        content: JSON.stringify([
          "Academic publishing demands rigorous synthesis of related work. During Session 13, the department reviewed modern literature review tools and reproducible experimentation pipelines.",
          "We highlighted the proper usage of LaTeX for IEEE format typesetting, reference indexing with BibTeX, and semantic paper clustering.",
          "Advisory reminder: AI assistants are aids for summarizing and formatting, but empirical validation and peer review standards remain paramount."
        ]),
        displayOrder: 4,
        isPublished: true,
      }
    ];

    for (const post of samplePosts) {
      await prisma.blogPost.create({ data: post });
    }
  }

  // 7. Contributors
  const existingContributors = await prisma.contributor.count();
  if (existingContributors === 0) {
    console.log("Seeding event contributors...");
    const sampleContributors = [
      {
        name: "Chinmayee",
        role: "Event Co-Lead & Track Winner",
        eventName: "Prompt Ops-2K26",
        department: "Computer Science & Engineering",
        batch: "1st Year CSE",
        photoUrl: "/assets/leaders/chaitra.jpg",
        bio: "Top honors in Track 1 of Prompt Ops-2K26; assisted in prompt engineering testbed documentation and peer mentoring.",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 1,
        isPublished: true,
      },
      {
        name: "Chris Royston Monteiro",
        role: "Technical Evaluator",
        eventName: "Prompt Ops-2K26",
        department: "Computer Science & Engineering",
        batch: "2nd Year CSE",
        photoUrl: "/assets/leaders/elston.jpg",
        bio: "Designed evaluation criteria for image generation prompts and assisted in participant scoring automation.",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 2,
        isPublished: true,
      },
      {
        name: "Harimurali K S",
        role: "API Security Challenge Lead",
        eventName: "Prompt Ops-2K26",
        department: "Computer Science & Engineering",
        batch: "3rd Year CSE",
        photoUrl: "/assets/leaders/raynell.jpg",
        bio: "Built the adversarial Gemini prompt extraction challenges for Track 2 and configured live rate limiting.",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 3,
        isPublished: true,
      },
      {
        name: "Venus Suhani D’Lima",
        role: "Stage & Logistics Coordinator",
        eventName: "Lumière — The Gala",
        department: "Computer Science & Engineering",
        batch: "2nd Year CSE",
        photoUrl: "/assets/leaders/nazmin.jpg",
        bio: "Coordinated stage arrangements, entry pass management, and hospitality for faculty guests during the branch entry gala.",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 4,
        isPublished: true,
      },
      {
        name: "Deeksha Ravi Moger",
        role: "Creative Media & Banner Lead",
        eventName: "Lumière — The Gala",
        department: "Computer Science & Engineering",
        batch: "2nd Year CSE",
        photoUrl: "/assets/leaders/jeslin.jpg",
        bio: "Designed main stage backdrop visual assets, social media flyers, and coordinated lighting aesthetics.",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 5,
        isPublished: true,
      },
      {
        name: "Venisha Snehal D’Souza",
        role: "Workshop Mentor",
        eventName: "Smart Contract Bootcamp",
        department: "Computer Science & Engineering",
        batch: "4th Year CSE",
        photoUrl: "/assets/leaders/chaitra.jpg",
        bio: "Helped 60+ junior students debug Hardhat smart contract deployments and Sepolia faucet transactions.",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 6,
        isPublished: true,
      },
    ];

    for (const c of sampleContributors) {
      await prisma.contributor.create({ data: c });
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });