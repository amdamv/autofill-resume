import type { MockJobPosting } from '../types/resume';

export const MOCK_JOBS: MockJobPosting[] = [
  {
    id: 'job-1',
    company: 'Stripe',
    role: 'Senior Frontend Engineer',
    location: 'San Francisco, CA (Remote/Hybrid)',
    salary: '$170,000 - $220,000',
    description: `We are looking for a Senior Frontend Engineer to join our cloud infrastructure platform team.

Responsibilities:
- Build scalable dashboard interfaces using React and TypeScript
- Improve application performance and optimize Core Web Vitals
- Refactor legacy frontend modules into modern reusable architecture
- Collaborate closely with product managers, designers, and backend engineers
- Write maintainable, tested, and well-documented code

Requirements:
- 4+ years of commercial experience with React and TypeScript
- Strong knowledge of JavaScript ES6+, HTML5, CSS3, and Tailwind CSS
- Experience optimizing large-scale web applications
- Understanding of clean architecture and modular frontend design
- Experience with Jest, Playwright, or Cypress testing tools
- Nice to have: Experience with WebSockets, Canvas, or D3.js`,
  },
  {
    id: 'job-2',
    company: 'Netflix',
    role: 'Full-Stack Engineer (Node.js/React)',
    location: 'Los Angeles, CA (Remote)',
    salary: '$145,000 - $195,000',
    description: `We are expanding our internal analytics platform team and looking for a Full-Stack Engineer passionate about scalable systems.

Responsibilities:
- Develop responsive frontend applications with React and TypeScript
- Build and maintain backend microservices using Node.js and Express
- Design performant APIs and caching strategies
- Participate in architecture discussions and code reviews
- Improve developer experience and engineering standards

Requirements:
- Strong experience with Node.js and React ecosystem
- Experience with PostgreSQL, MySQL, or NoSQL databases
- Solid understanding of REST APIs, HTTP protocols, and authentication flows
- Experience building scalable production systems
- Ability to write clean, maintainable, and modular code`,
  },
  {
    id: 'job-3',
    company: 'Airbnb',
    role: 'Senior Product Designer',
    location: 'New York, NY (Hybrid)',
    salary: '$150,000 - $190,000',
    description: `We are looking for a Senior Product Designer to help shape the future of our platform experience.

Responsibilities:
- Design intuitive user experiences for complex B2B and consumer products
- Conduct UX research, usability testing, and user interviews
- Create high-fidelity prototypes and interactive flows in Figma
- Collaborate closely with engineers and product managers
- Contribute to the growth of the design system and accessibility standards

Requirements:
- Strong portfolio with complex product design case studies
- Deep understanding of UX principles and interaction design
- Ability to communicate design decisions using user and business metrics
- Experience working closely with frontend engineering teams
- Experience designing scalable multi-platform products`,
  },
];
