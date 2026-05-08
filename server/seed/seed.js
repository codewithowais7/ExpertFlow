require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Expert = require('../models/Expert');

const experts = [
  {
    name: 'Dr. Aisha Patel',
    title: 'Senior AI & Machine Learning Engineer',
    bio: 'Former Google AI researcher with 12+ years of experience in deep learning, NLP, and computer vision. Published 30+ papers in top-tier conferences. Passionate about making AI accessible.',
    avatar: 'https://ui-avatars.com/api/?name=Aisha+Patel&background=6C63FF&color=fff&size=256&bold=true',
    specialties: ['AI', 'Machine Learning', 'Deep Learning', 'NLP', 'Python'],
    hourlyRate: 150,
    rating: 4.9,
    reviewCount: 234,
    availability: [
      { day: 'Mon', timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
      { day: 'Wed', timeSlots: ['09:00', '10:00', '14:00', '15:00', '16:00'] },
      { day: 'Fri', timeSlots: ['10:00', '11:00', '13:00', '14:00'] }
    ]
  },
  {
    name: 'Marcus Chen',
    title: 'Full-Stack Developer & Tech Lead',
    bio: 'Tech lead at a Series B startup. Expert in React, Node.js, and scalable system design. Built products used by 2M+ users. Loves mentoring junior developers and code reviews.',
    avatar: 'https://ui-avatars.com/api/?name=Marcus+Chen&background=00C9A7&color=fff&size=256&bold=true',
    specialties: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'System Design'],
    hourlyRate: 120,
    rating: 4.8,
    reviewCount: 189,
    availability: [
      { day: 'Mon', timeSlots: ['10:00', '11:00', '14:00', '15:00', '16:00'] },
      { day: 'Tue', timeSlots: ['09:00', '10:00', '11:00', '14:00'] },
      { day: 'Thu', timeSlots: ['09:00', '10:00', '14:00', '15:00', '16:00'] },
      { day: 'Sat', timeSlots: ['10:00', '11:00', '12:00'] }
    ]
  },
  {
    name: 'Sofia Rodriguez',
    title: 'Principal Cloud Architect',
    bio: 'AWS Solutions Architect Professional & Google Cloud Fellow. 15 years designing multi-region, fault-tolerant architectures for Fortune 500 companies. Speaker at re:Invent and KubeCon.',
    avatar: 'https://ui-avatars.com/api/?name=Sofia+Rodriguez&background=FF6B6B&color=fff&size=256&bold=true',
    specialties: ['AWS', 'Google Cloud', 'Kubernetes', 'Terraform', 'DevOps'],
    hourlyRate: 180,
    rating: 4.9,
    reviewCount: 156,
    availability: [
      { day: 'Tue', timeSlots: ['09:00', '10:00', '11:00', '15:00', '16:00'] },
      { day: 'Wed', timeSlots: ['10:00', '11:00', '14:00', '15:00'] },
      { day: 'Fri', timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'] }
    ]
  },
  {
    name: 'James Okafor',
    title: 'Senior Mobile Developer',
    bio: 'React Native specialist with 8+ years in mobile development. Shipped 15+ apps on App Store and Google Play with combined 5M+ downloads. Expert in performance optimization and native modules.',
    avatar: 'https://ui-avatars.com/api/?name=James+Okafor&background=FFA726&color=fff&size=256&bold=true',
    specialties: ['React Native', 'iOS', 'Android', 'Flutter', 'Mobile UI/UX'],
    hourlyRate: 100,
    rating: 4.7,
    reviewCount: 142,
    availability: [
      { day: 'Mon', timeSlots: ['09:00', '10:00', '11:00'] },
      { day: 'Wed', timeSlots: ['09:00', '10:00', '14:00', '15:00', '16:00'] },
      { day: 'Thu', timeSlots: ['10:00', '11:00', '14:00', '15:00'] },
      { day: 'Sat', timeSlots: ['09:00', '10:00', '11:00', '12:00'] }
    ]
  },
  {
    name: 'Elena Volkov',
    title: 'Cybersecurity Consultant & Ethical Hacker',
    bio: 'OSCP, CISSP certified. Former penetration tester at Crowdstrike. Specializes in application security, threat modeling, and incident response. Bug bounty hunter with $200K+ in rewards.',
    avatar: 'https://ui-avatars.com/api/?name=Elena+Volkov&background=AB47BC&color=fff&size=256&bold=true',
    specialties: ['Cybersecurity', 'Penetration Testing', 'Network Security', 'OWASP', 'Incident Response'],
    hourlyRate: 200,
    rating: 4.8,
    reviewCount: 98,
    availability: [
      { day: 'Tue', timeSlots: ['10:00', '11:00', '14:00', '15:00'] },
      { day: 'Thu', timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
      { day: 'Fri', timeSlots: ['10:00', '11:00', '14:00'] }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Expert.deleteMany({});
    console.log('🗑️  Cleared existing experts');

    const created = await Expert.insertMany(experts);
    console.log(`🌱 Seeded ${created.length} experts:`);
    created.forEach(e => console.log(`   → ${e.name} (${e.title})`));

    await mongoose.connection.close();
    console.log('✅ Done — connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
