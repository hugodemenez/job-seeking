export const fakePersona = {
  name: "Alex Johnson",
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "Tech University",
      year: 2018
    }
  ],
  skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
  workExperience: [
    {
      title: "Junior Software Developer",
      company: "TechCorp",
      startDate: "2018-06",
      endDate: "2020-05",
      responsibilities: [
        "Developed and maintained web applications using React and Node.js",
        "Collaborated with cross-functional teams to deliver high-quality software solutions"
      ]
    }
  ]
}

interface JobOffer {
  company: string;
  companyLogo: string;
  position: string;
  description: string;
  postedDate: string;
  recruiter: {
    name: string;
    email: string;
    linkedinUrl: string;
    avatar: string;
  };
  hiringManager: {
    name: string;
    email: string;
    linkedinUrl: string;
    avatar: string;
  };
}