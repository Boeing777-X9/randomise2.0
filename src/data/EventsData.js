const events = [
  {
    id: "0",
    title: "Web Dev 1",
    date: "11 Oct 2025",
    description:
      "Web Dev Workshop Day 1 ended with energy and creativity! Fresh minds dove into code, ideas sparked, and projects came alive. Day 1 set the bar high and we’re just getting started!",
    image:
      "https://res.cloudinary.com/dwh5daoyd/image/upload/v1760536148/web_development2026_gph5a1.png",
  },

  {
    id: "1",
    title: "Hello world",
    date: "25-26 Aug 2024",
    description:
      "Hello World got everyone coding and curious, laying down the first brick for many bright futures.Our Webdev Workshop Trilogy in its very first day brought the heat with killer projects and a crowd that truly showed up and shone.",
    image:
      "https://res.cloudinary.com/dwh5daoyd/image/upload/v1760534537/A4_-_1187_hbwabb.png",
  },
  {
    id: "2",
    title: "Freshman Meetup",
    date: "11 Aug 2025",
    description:
      "The vibe at our Freshman Meetup was electric. New faces, new friendships, and the perfect start to the journey. A forever memory!",
    image:
      "https://res.cloudinary.com/dwh5daoyd/image/upload/v1760534577/image_2025-10-15_185252182_d2weo6.png",
  },
  {
    id: "3",
    title: "Expert Talk",
    date: "11 July 2025",
    description:
      "Not just tech, but Entrepreneurship. Chaitra Chidanand showed us what it means to Dream, Dare, and Do.  From Simpl to SALT, it wasn’t just startups. It was stories of mindset, money, and meaning.  Because building isn’t just code; it’s courage.",
    image:
      "https://res.cloudinary.com/dwh5daoyd/image/upload/v1760534590/Screenshot_2025-10-15_185133_fnv7fr.png",
  },
  {
    id: "4",
    title: "Fest 2.0",
    date: "4-6 April 2025",
    description:
      "From cracking codes in CryptX to stargazing in Nebula Nights, our journey was a mix of thrill and wonder.The Hackathon ignited innovation, while Tech Debate tested wit and logic.Together, we coded, argued, discovered, and created memories beyond bytes!",
    image:
      "https://res.cloudinary.com/dwh5daoyd/image/upload/v1760535541/Screenshot_2025-10-15_190519_btdnh6.png",
  },
  {
    id: "5",
    title: "CPP",
    date: "19 Feb 2025",
    description:
      "Ever wondered why coders sit long with their laptops? Get your answer and Master logic and precision at CPP Workshop get your syntax straight and your skills sharper than ever.",
    image:
      "https://res.cloudinary.com/dwh5daoyd/image/upload/v1760532961/cpp_rnq6uf.png",
  },
  {
    id: "6",
    title: "Web Dev 3",
    date: "16 Feb 2025",
    description:
      "Build smart and bold with Web Dev 3 and dont forget, it’s not just code, it’s creation that stands out, work that builds confidence. ",
    image:
      "https://res.cloudinary.com/dwh5daoyd/image/upload/v1760532958/web_development_3_cu7kat.png",
  },
  {
    id: "7",
    title: "Neural Network",
    date: "15 Feb 2025",
    description:
      "Step into the future at the Neural Network Workshop and power up your ideas with the brain behind AI",
    image:
      "https://res.cloudinary.com/dwh5daoyd/image/upload/v1760532958/neural_jizjce.png",
  },
  {
    id: "8",
    title: "ML workshop",
    date: "8 Feb 2025",
    description:
      "Push boundaries with our Machine Learning Workshop  where we decode data, design intelligence, and leave the average behind. Become the rare with the rare",
    image:
      "https://res.cloudinary.com/dwh5daoyd/image/upload/v1760532959/ml_nzmxlk.png",
  },
  {
    id: "9",
    title: "EP Workshop",
    date: "5 Dec 2024",
    description:
      "Randomize hosted an engaging session focused on the 1st Year EP syllabus, offering in-depth explanations, practice questions, and interactive doubt-solving to help students prepare effectively for their MTE.",
    image:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737912586/Website/Events/Ep-workshop_llvcui.jpg",
  },
  {
    id: "10",
    title: "Web Dev Workshop - Part 2",
    description:
      "Level up your web dev game! Dive deeper into JavaScript, learn the tricks of creating interactive websites, and take home skills that'll make your portfolio pop. Let's code something amazing together!",
    date: "20th Nov 2024",
    image:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737912591/Website/Events/WebDevWS-2_zzidyh.png",
  },
  {
    id: "11",
    title: "Hello World 2.O",
    date: "16-17 Oct 2024",
    description:
      'RANDOMIZE is back with our most anticipated and flagship event "HELLO WORLD!" Buckle up for a two-day of fun and exploration in the amazing universe of Computer Science!',
    image:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737912595/Website/Events/hello-world-2024_cahxla.png",
  },
  {
    id: "12",
    title: "Freshman Meetup",
    date: "8 Oct 2024",
    description:
      "The RANDOMIZE Freshman Meetup brought together first-year students for an evening filled with laughter, engaging conversations, and valuable insights. Attendees connected with their peers, got answers to their questions, and learned from their seniors, all while enjoying the vibrant and welcoming atmosphere.",
    image:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737912589/Website/Events/freshman-meetup_eorghl.png",
  },
  {
    id: "13",
    title: "Web Dev Workshop",
    date: "1 Sept 2024",
    description:
      "Whether you're a beginner or have some coding experience, this hands-on session will help you design and code your own personalized portfolio website from scratch. Our experienced developers will guide you through every step! No prerequisites—just bring your thirst for knowledge and creativity!",
    image:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737912587/Website/Events/WebDevWS-1_srdxwm.jpg",
  },
  {
    id: "14",
    title: "Panel Talk with a Googler",
    date: "14 April 2024",
    description:
      "Randomize(); is hosting an exclusive panel talk event this weekend with a distinguished industry expert. Details-Speaker: Kalyan Kumar Dubey, an employee at Google and a 5-star Coder on CodeChef. Topic: Gain insights and strategies to enhance coding skills, and understand the work environment at Google. This is an opportunity to learn from an experienced professional at Google, get your questions answered, and improve your coding abilities.",
    image:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737915875/Website/Events/googler_mke1bd.jpg",
  },
  {
    id: "15",
    title: "Building a Neural Network from Scratch",
    description:
      "This is a slightly advanced workshop focused on building neural networks from the ground up. Participants should have a foundational understanding of linear algebra, calculus, and Python programming. The workshop will likely cover key concepts such as network architecture, activation functions, backpropagation, and optimization algorithms. It offers a practical, hands-on approach to understanding the inner workings of neural networks.",
    image:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737912597/Website/Events/ANN_Class_bjcrhy.png",
    date: "10th Feb, 2024",
  },
  {
    id: "16",
    title: "Git Workshop",
    date: "3 Feb 2024",
    description:
      "Randomize is conducting a session to teach Git and GitHub from scratch, which are essential skills for developers and enthusiasts. This workshop is ideal for anyone looking to start with version control.",
    image:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737912590/Website/Events/GitHub_Workshop_ttcyex.png",
  },
  {
    id: "17",
    title: "The Fest",
    date: "19 Jan 2024",
    description:
      "Randomize(); is organizing a 3-Day Technological Festival called 'The Fest' from 19th to 21st January. Events include: 1) The Hackathon (19th Jan 9PM - 21st Jan Morning), a 36-hour duration challenge. 2) The Cryptic Hunt (20th Jan 10AM onwards). 3) The Ideathon (20th Jan 2PM), where participants pitch ideas (tech or otherwise) for funding, mentorship, and incubation. 4) The Bollywood DJ Night (21st Jan 5PM).",
    image:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737914588/Website/Events/fest_mbjr9x.jpg",
  },
  {
    id: "18",
    title: "DSA Workshop",
    description:
      "Got DSA on your mind? Join us for a packed session that covers all the essentials for your 2nd Year MTE. From sample problems to live doubt clearing, we've got your back!",
    date: "3rd and 4th Oct 2023",
    image:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737912593/Website/Events/dsaWs_ej95bv.png",
  },
  {
    id: "19",
    title: "Hello World",
    date: "13 Sept 2023",
    description:
      "Learn about various topics at the upcoming two-day event on 13th and 14th September 2023. Topics include: Graphic Design + UI/UX, Generative AI + Fundamentals of AI, DSA + Competitive Programming, Full Stack Development + App Development, and an Introduction to Decentralized Technologies (blockchain, Web3, NFTs, Crypto).",
    image:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737912586/Website/Events/hello-world_bh9wc9.jpg",
  },
  {
    id: "20",
    title: "Competitive Programming Workshop",
    date: "9 Sept 2023",
    description:
      "A 2-hour session where we'll tackle a programming problem, break it down, discuss approaches, solve with flowcharts and logic, and then code it. No prior programming knowledge required.",
    image:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737912586/Website/Events/cp-workshop_gheuws.jpg",
  },
  {
    id: "21",
    title: "Freshman Meetup 2023",
    description:
      "Are you a freshman? Come hang out with us! We'll help you navigate college life and share our insider tips. This is your chance to ask anything, meet your seniors, and have some fun along the way.",
    date: "28th Aug 2023",
    image:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737912595/Website/Events/freshman-meetup-2023_usdi5k.png",
  },
];

export default events;
