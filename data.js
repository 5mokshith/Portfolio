const data = {
  general: {
    name: "Mokshith Rao",
    catchy: "Mokshith",
    email: "mokshithrao1481@gmail.com",
    location: "Hyderabad, Telangana, India",
    Phone: "1234567890"
  },
  hero: {
    Heading: "Hi, I'm Mokshith",
    tagline: "Computer Science Engineer | Web Developer | Machine Learning Enthusiast",
    description:
      "I design and develop responsive, scalable web applications with a strong focus on user experience and performance. Passionate about exploring cutting-edge technologies to build impactful, real-world solutions.",
  },
  about: {
    title: "About Me",
    paragraph:
      "I'm a Computer Science student passionate about building AI-powered, user-friendly web solutions. I thrive at the intersection of design, data, and real-world impact. I enjoy collaborating with diverse teams and constantly seek opportunities to learn new technologies and frameworks.",
    whyIDoIt:
      "I believe technology should solve real problems and improve lives. Whether it's helping someone navigate their city smarter or connecting people through intuitive design, I want to build solutions that matter.",
    bulletPoints: [
      "💻 Full-stack web & ML enthusiast",
      "🧠 Building AI travel assistant — Voyana",
      "🎯 Always exploring UI/UX magic",
      "🌐 Open source contributor",
      "📈 Data-driven problem solver",
      "🤝 Team player & mentor"
    ],
    resumeLink: "/resume.pdf",
    hoverFacts: `
      The journey of learning never ends. I am always curious, always building, and always striving to make technology more accessible and impactful. Whether it's experimenting with new frameworks or mentoring peers, I believe in sharing knowledge and growing together.
    `,
    profileImage: "/assets/image.jpg"
  },

  projects: {
    title: "Projects",
    tagline: "Here are some of my latest and most exciting projects, crafted with passion and innovation.",
    projects: [
      {
        title: "Trefloo",
        description: "An AI-powered travel platform focused on rural tourism, cultural immersion, and smart itinerary planning with features like local guides, AR tours, and multilingual support.",
        techstack: ["React", "Tailwind", "Supabase"],
        type: "video",
        link: "https://trefloo.vercel.app",
        media: "/assets/projects/Trefloo.mp4",
      },
      {
        title: "CardioGuard",
        description: "A real-time heart health monitoring and emergency alert system using ECG sensor data and machine learning to detect cardiac arrests and notify doctors and emergency contacts.",
        techstack: ["React", "Supabase", "Arduino", "Machine Learning", "Deno", "Typescript"],
        type: "video",
        link: "cardioGuard.vercel.app",
        media: "/assets/projects/cardioGuard.mp4",
      },
      {
        title: "Qconn",
        description: "A question-and-answer platform for students and mentors to interact, with role-based access, achievement points, and full CRUD support for content.",
        techstack: ["HTML", "CSS", "JavaScript", "Supabase"],
        type: "image",
        link: "https://5mokshith.github.io/Qconn",
        media: "/assets/projects/Qconn.png",
      },
      {
        title: "Chatbot",
        description: "An AI chatbot for public/enterprise use, handling queries about HR policies, IT support, and events. It features document analysis, profanity filtering, and scalable multi-user support.",
        techstack: ["FastAPI", "Python", "NLP", "Supabase", "BERT"],
        type: "video",
        link: "local development",
        media: "/assets/projects/chatBot.mp4",
      },
    
    ]
  },
  
  skills: {
    title: "Skill's",
    tagline: "A showcase of my technical and creative abilities.",
    skills: [
      {
        title: "Frontend Development",
        languages: ["TypeScript", "JavaScript", "HTML", "CSS"],
        frameWorks: ["React", "Tailwind"],
        tools: ["Vite", "DOM APIs"],
        relatedProjects: ["Trefloo", "CardioGuard", "ChefMate", "Crecon"]
      },
      {
        title: "Backend Development",
        languages: ["Python", "TypeScript", "Deno"],
        frameWorks: ["FastAPI"],
        tools: ["Supabase", "Firebase", "REST APIs"],
        relatedProjects: ["Chatbot", "CardioGuard", "Crecon"]
      },
      {
        title: "Machine Learning & AI",
        languages: ["Python"],
        frameWorks: ["Scikit-learn", "BERT", "LLMs"],
        tools: ["OpenAI API", "Anthropic API"],
        relatedProjects: ["CardioGuard", "Chatbot", "ChefMate"]
      },
      {
        title: "Database & Cloud",
        languages: ["SQL"],
        frameWorks: ["Express"],
        tools: ["Supabase", "Firebase", "PostgreSQL"],
        relatedProjects: ["Trefloo", "Qconn", "Crecon", "Chatbot"]
      },
      {
        title: "Embedded Systems & IoT",
        languages: ["C", "C++"],
        frameWorks: ["Arduino Framework"],
        tools: ["Arduino", "ECG Sensor"],
        relatedProjects: ["CardioGuard"]
      },
      {
        title: "UI/UX & Design Tools",
        languages: ["JavaScript"],
        frameWorks: ["React"],
        tools: ["Figma", "Canva", "Framer Motion"],
        relatedProjects: ["Trefloo", "ChefMate", "Crecon"]
      },
      {
        title: "Version Control & Dev Tools",
        languages: ["Shell"],
        frameWorks: ["Node.js"],
        tools: ["Git", "GitHub", "VS Code", "Postman"],
        relatedProjects: ["All Projects"]
      }
    ],
    skillDetails: {
      // Frontend Development Skills
        "HTML": {
          "description": "Markup language for structuring web content.",
          "experience": "2 years",
          "projects": 10,
          "proficiency": 90
        },
        "CSS": {
          "description": "Style sheet language used to design web pages.",
          "experience": "2 years",
          "projects": 10,
          "proficiency": 85
        },
        "JavaScript": {
          "description": "Core scripting language for interactive web functionality.",
          "experience": "2 years",
          "projects": 9,
          "proficiency": 85
        },
        "VS Code": {
          "description": "Code editor used for most development work.",
          "experience": "2 years",
          "projects": 20,
          "proficiency": 95
        },
        "Git": {
          "description": "Version control system for source code management.",
          "experience": "2 years",
          "projects": 20,
          "proficiency": 90
        },
        "GitHub": {
          "description": "Platform for hosting Git repositories and collaboration.",
          "experience": "2 years",
          "projects": 20,
          "proficiency": 90
        },
        "React": {
          "description": "JavaScript library for building user interfaces.",
          "experience": "1.5 years",
          "projects": 8,
          "proficiency": 80
        },
        "Tailwind": {
          "description": "Utility-first CSS framework for styling.",
          "experience": "1.5 years",
          "projects": 7,
          "proficiency": 75
        },
        "Vite": {
          "description": "Fast frontend build tool for modern web projects.",
          "experience": "1.5 years",
          "projects": 6,
          "proficiency": 70
        },
        "TypeScript": {
          "description": "Typed superset of JavaScript improving code quality.",
          "experience": "1 year",
          "projects": 5,
          "proficiency": 70
        },
        "DOM APIs": {
          "description": "Web APIs for interacting with document content.",
          "experience": "1 year",
          "projects": 5,
          "proficiency": 70
        },
      
        "Python": {
          "description": "General-purpose programming language used for backend and ML.",
          "experience": "1.5 years",
          "projects": 6,
          "proficiency": 75
        },
        "FastAPI": {
          "description": "Modern web framework for building APIs with Python.",
          "experience": "1 year",
          "projects": 3,
          "proficiency": 65
        },
        "Supabase": {
          "description": "Open-source Firebase alternative used for backend services.",
          "experience": "1 year",
          "projects": 4,
          "proficiency": 70
        },
        "Firebase": {
          "description": "Backend-as-a-Service used for auth and real-time DB.",
          "experience": "6 months",
          "projects": 2,
          "proficiency": 60
        },
        "REST APIs": {
          "description": "Standard protocol for backend communication.",
          "experience": "1.5 years",
          "projects": 5,
          "proficiency": 75
        },
        "Deno": {
          "description": "Secure runtime for JavaScript and TypeScript.",
          "experience": "6 months",
          "projects": 1,
          "proficiency": 40
        },
      
        "Scikit-learn": {
          "description": "Machine learning library in Python.",
          "experience": "1 year",
          "projects": 3,
          "proficiency": 60
        },
        "BERT": {
          "description": "Transformer model for NLP tasks.",
          "experience": "6 months",
          "projects": 2,
          "proficiency": 55
        },
        "LLMs": {
          "description": "Large Language Models for generative and NLP tasks.",
          "experience": "1 year",
          "projects": 3,
          "proficiency": 65
        },
        "OpenAI API": {
          "description": "API for integrating GPT-based models into apps.",
          "experience": "1 year",
          "projects": 3,
          "proficiency": 65
        },
        "Anthropic API": {
          "description": "API for Claude models used in AI applications.",
          "experience": "6 months",
          "projects": 1,
          "proficiency": 50
        },
      
        "SQL": {
          "description": "Structured language for managing relational databases.",
          "experience": "1 year",
          "projects": 4,
          "proficiency": 65
        },
        "PostgreSQL": {
          "description": "Advanced open-source relational database system.",
          "experience": "6 months",
          "projects": 2,
          "proficiency": 60
        },
        "Express": {
          "description": "Minimal web framework for Node.js backend development.",
          "experience": "6 months",
          "projects": 2,
          "proficiency": 55
        },
      
        "C": {
          "description": "Procedural programming language used in embedded systems.",
          "experience": "1 year",
          "projects": 2,
          "proficiency": 40
        },
        "C++": {
          "description": "Object-oriented programming language used occasionally.",
          "experience": "6 months",
          "projects": 1,
          "proficiency": 20
        },
        "Arduino Framework": {
          "description": "Open-source electronics platform based on simple I/O.",
          "experience": "1 year",
          "projects": 2,
          "proficiency": 50
        },
        "Arduino": {
          "description": "Microcontroller board platform for IoT development.",
          "experience": "1 year",
          "projects": 2,
          "proficiency": 50
        },
        "ECG Sensor": {
          "description": "Sensor for detecting heart signals used in IoT health systems.",
          "experience": "6 months",
          "projects": 1,
          "proficiency": 40
        },
      
        "Figma": {
          "description": "Collaborative interface design tool.",
          "experience": "1.5 years",
          "projects": 5,
          "proficiency": 75
        },
        "Canva": {
          "description": "Design tool used for quick UI/UX mockups.",
          "experience": "1.5 years",
          "projects": 4,
          "proficiency": 70
        },
        "Framer Motion": {
          "description": "Animation library for React.",
          "experience": "6 months",
          "projects": 2,
          "proficiency": 55
        },
      
        "Shell": {
          "description": "Command line operations and scripting.",
          "experience": "1 year",
          "projects": 5,
          "proficiency": 60
        },
        "Node.js": {
          "description": "JavaScript runtime environment for backend scripting.",
          "experience": "1 year",
          "projects": 3,
          "proficiency": 60
        },
        "Postman": {
          "description": "API testing and documentation tool.",
          "experience": "1.5 years",
          "projects": 7,
          "proficiency": 75
        }
    }
  }
};

export default data;
