const landingSections = [
  {
    sectionType: "hero",
    title: "Hero Section",
    content: {
      acceptedText: "Accepted the Offer",
      heroQuestion: "But not Joined yet?",
      orangeBoxText: "Don't worry - the window is still open!",
      description:
        "Reach out to the company that made you the offer.\nContact details are in your offer letter.",
      buttonText: "Reach Out Now",
      imageAlt: "PM Modi",
    },
    imageUrl: "https://picsum.photos/500/600?random=100",
    order: 1,
    isActive: true,
  },
  {
    sectionType: "eligibility",
    title: "Are You Eligible?",
    content: {
      criteria: [
        { label: "Age", value: "21-24 Years" },
        { label: "Job Status", value: "Not Employed Full Time" },
        { label: "Education", value: "Not Enrolled Full Time" },
        {
          label: "Family (Self/ Spouse / Parents)",
          value:
            "No one is Earning more than ₹8 Lakhs PA\nNo Member has a Govt. Job",
        },
      ],
    },
    order: 2,
    isActive: true,
  },
  {
    sectionType: "benefits",
    title: "Scheme",
    content: {
      benefits: [
        {
          text: "12 months real-life experience in India's top companies",
        },
        {
          text: "Monthly assistance of ₹4500 by Government of India and ₹500 by Industry",
        },
        { text: "One-time Grant of ₹6000 for incidentals" },
        { text: "Select from Various Sectors and from top Companies of India" },
      ],
    },
    order: 3,
    isActive: true,
  },
  {
    sectionType: "political_figures",
    content: {
      figures: [
        {
          name: "Shri Narendra Modi",
          title: "HON'BLE PRIME MINISTER",
          quote:
            "Skill development of the new generation is a national need and is the foundation of Aatmnirbhar Bharat",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/PM_Modi_2020.jpg/220px-PM_Modi_2020.jpg",
          alt: "Shri Narendra Modi",
        },
        {
          name: "Shri Jayant Chaudhary",
          title: "HON'BLE MINISTER OF STATE",
          quote:
            "New skills such as AI, machine learning, and automation are transforming industries and highlighting the critical need for continuous learning.",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Jayant_Chaudhary.jpg/220px-Jayant_Chaudhary.jpg",
          alt: "Shri Jayant Chaudhary",
        },
      ],
    },
    order: 4,
    isActive: true,
  },
  {
    sectionType: "features",
    title: "Building a Skilled India",
    content: {
      features: [
        {
          title: "Citizen Centric",
          description:
            "Designed to meet the skilling needs of India's diverse and aspirational population",
        },
        {
          title: "Career Focussed",
          description:
            "Relevant skill courses, certification, jobs and apprenticeships",
        },
        {
          title: "Multilingual",
          description:
            "Explore Skill India Digital Hub in Multiple Indian languages",
        },
      ],
    },
    order: 5,
    isActive: true,
  },
  {
    sectionType: "opportunities",
    content: {
      opportunities: [
        {
          title: "I want to learn!",
          subtitle: "Skill Courses",
        },
        {
          title: "I want to explore!",
          subtitle: "Job Exchange",
        },
      ],
    },
    order: 6,
    isActive: true,
  },
  {
    sectionType: "carousel",
    content: {
      slides: [
        {
          title: "Explore, Learn, Get Skill Certified",
          subtitle: "Find skill courses across sectors and locations",
          buttonText: "LEARN MORE",
        },
        {
          title: "Build Your Career Path",
          subtitle:
            "Discover opportunities that match your skills and aspirations",
          buttonText: "EXPLORE NOW",
        },
        {
          title: "Grow With Industry Leaders",
          subtitle:
            "Connect with top companies and accelerate your professional journey",
          buttonText: "GET STARTED",
        },
      ],
    },
    order: 7,
    isActive: true,
  },
];

const landingImages = [
  {
    name: "Hero Image",
    url: "https://picsum.photos/500/600?random=100",
    alt: "PM Modi",
    category: "hero",
    page: "landing",
  },
  {
    name: "PM Modi",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/PM_Modi_2020.jpg/220px-PM_Modi_2020.jpg",
    alt: "Shri Narendra Modi",
    category: "other",
    page: "landing",
  },
  {
    name: "Jayant Chaudhary",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Jayant_Chaudhary.jpg/220px-Jayant_Chaudhary.jpg",
    alt: "Shri Jayant Chaudhary",
    category: "other",
    page: "landing",
  },
];

const internships = [
  {
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=60",
    title: "Digital Marketing Intern",
    name: "SkillSprint Labs",
    time: "Full Time Internship",
    industry: "Digital Marketing",
    city: "Mumbai",
    Stipend: "₹12,000 / month",
    weeks: "12 Weeks",
  },
  {
    img: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=400&q=60",
    title: "Data Analytics Intern",
    name: "AnalytIQ Insights",
    time: "Work From Home Internship",
    industry: "Analytics",
    city: "Bangalore",
    Stipend: "₹15,000 / month",
    weeks: "16 Weeks",
  },
  {
    img: "https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=400&q=60",
    title: "Product Design Intern",
    name: "BuildBetter Labs",
    time: "Part Time Internship",
    industry: "Product Design",
    city: "Delhi",
    Stipend: "₹10,000 / month",
    weeks: "10 Weeks",
  },
  {
    img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=400&q=60",
    title: "Full Stack Engineering Intern",
    name: "NextGen Works",
    time: "Full Time Internship",
    industry: "Engineering",
    city: "Hyderabad",
    Stipend: "₹18,000 / month",
    weeks: "20 Weeks",
  },
  {
    img: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=400&q=60",
    title: "HR & People Ops Intern",
    name: "PeopleFirst",
    time: "Full Time Internship",
    industry: "Human Resources",
    city: "Pune",
    Stipend: "₹9,000 / month",
    weeks: "8 Weeks",
  },
];

const jobs = [
  {
    img: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=400&q=60",
    title: "Junior Data Scientist",
    name: "Thinklytics",
    time: "Full Time Job",
    industry: "Analytics",
    city: "Bangalore",
    Stipend: "₹8 - 10 LPA",
    weeks: "Immediate Joiner",
  },
  {
    img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=60",
    title: "UX Research Associate",
    name: "Northstar Labs",
    time: "Full Time Job",
    industry: "Product Design",
    city: "Mumbai",
    Stipend: "₹6 - 8 LPA",
    weeks: "30 Days Notice",
  },
  {
    img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=400&q=60",
    title: "Growth Marketing Executive",
    name: "DemandLab India",
    time: "Full Time Job",
    industry: "Marketing",
    city: "Delhi",
    Stipend: "₹5 - 7 LPA",
    weeks: "Immediate Joiner",
  },
  {
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=60",
    title: "Operations Associate",
    name: "UrbanStacks",
    time: "Full Time Job",
    industry: "Operations",
    city: "Hyderabad",
    Stipend: "₹4 - 5 LPA",
    weeks: "15 Days Notice",
  },
  {
    img: "https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=400&q=60",
    title: "Associate Software Engineer",
    name: "CodeCraft",
    time: "Full Time Job",
    industry: "Technology",
    city: "Chennai",
    Stipend: "₹7 - 9 LPA",
    weeks: "Immediate Joiner",
  },
];

const onlineCourses = [
  {
    images:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=60",
    title: "Digital Marketing Professional",
    description:
      "Performance marketing, SEO, automation workflows and campaign analytics.",
    Price: 4499,
    strikethrough_Price: "₹6,999",
    know: "KNOW MORE",
    emi: "EMI starting at ₹375 / month",
    incart: 0,
  },
  {
    images:
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=400&q=60",
    title: "Product Management Foundations",
    description:
      "Roadmaps, discovery frameworks and stakeholder management for PMs.",
    Price: 4999,
    strikethrough_Price: "₹7,999",
    know: "KNOW MORE",
    emi: "EMI starting at ₹410 / month",
    incart: 0,
  },
  {
    images:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=60",
    title: "Python for Data Careers",
    description:
      "Python fundamentals, pandas, APIs and dashboarding for analysts.",
    Price: 4299,
    strikethrough_Price: "₹6,499",
    know: "KNOW MORE",
    emi: "EMI starting at ₹355 / month",
    incart: 0,
  },
  {
    images:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=60",
    title: "Full Stack Launchpad",
    description:
      "React, Node.js, MongoDB and deployment pipelines for beginners.",
    Price: 5599,
    strikethrough_Price: "₹8,999",
    know: "KNOW MORE",
    emi: "EMI starting at ₹465 / month",
    incart: 0,
  },
];

const classroomCourses = [
  {
    images:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=60",
    title: "Finance & Investment Bootcamp",
    description:
      "In-person cohort on equity research, valuation and wealth management.",
    Price: 7499,
    strikethrough_Price: "₹9,999",
    know: "KNOW MORE",
    emi: "Pay in 3 installments",
    incart: 0,
  },
  {
    images:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=60",
    title: "Advanced Excel & Power BI",
    description:
      "Master enterprise reporting with guided classroom assignments.",
    Price: 6899,
    strikethrough_Price: "₹8,499",
    know: "KNOW MORE",
    emi: "Pay in 3 installments",
    incart: 0,
  },
  {
    images:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=60",
    title: "Cloud & DevOps Accelerator",
    description:
      "Weekend batches on AWS, containers, CI/CD tooling and monitoring.",
    Price: 8999,
    strikethrough_Price: "₹11,499",
    know: "KNOW MORE",
    emi: "Pay in 4 installments",
    incart: 0,
  },
];

module.exports = {
  landingSections,
  landingImages,
  internships,
  jobs,
  onlineCourses,
  classroomCourses,
};

