import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import {
  User, Leader, Sermon, Event, Announcement, Activity,
  Ministry, ChurchSettings
} from '../models/index.js';

await connectDB();

/* ---------- wipe (development reset) ---------- */
await Promise.all([
  User.deleteMany({}),
  Leader.deleteMany({}),
  Sermon.deleteMany({}),
  Event.deleteMany({}),
  Announcement.deleteMany({}),
  Activity.deleteMany({}),
  Ministry.deleteMany({}),
  ChurchSettings.deleteMany({})
]);

/* ---------- admin ---------- */
await User.create({
  name: 'Administrator',
  email: process.env.ADMIN_EMAIL,
  password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
  role: 'Super Admin'
});

/* ---------- church settings ---------- */
await ChurchSettings.create({
  churchName: 'Grace Bible Baptist Church Kitwe',
  motto: 'Loving God. Loving Others.',
  about:
    'Grace Bible Baptist Church Kitwe is a Bible-believing Baptist church located in Nkana East, near the CBU East Gate in Kitwe, Zambia. [Edit in dashboard]',
  mission: '[Add Church Mission]',
  vision: '[Add Church Vision]',
  beliefs: '[Add What We Believe]',
  history: '[Add Church History]',
  phone: '[Add Church Phone]',
  email: 'gracebiblebaptistchurchkitwe@gmail.com',
  address: 'Nkana East, near CBU East Gate, Kitwe, Zambia',

  serviceTimes: [
    {
      title: 'Sunday School',
      day: 'Sunday',
      time: '09:00hrs – 10:00hrs',
      description: ''
    },
    {
      title: 'Teens Class',
      day: 'Sunday',
      time: '09:00hrs – 10:00hrs',
      description: ''
    },
    {
      title: 'Sunday Service',
      day: 'Sunday',
      time: '10:00hrs – 12:00hrs',
      description: ''
    }
  ],

  socialLinks: {
    facebook: 'https://www.facebook.com/share/1DkEgAXFJx/?mibextid=wwXIfr',
    instagram: '',
    youtube: '',
    whatsapp: 'https://wa.me/260969172928'
  },
  mapLocation: {
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.5451492779275!2d28.230354974651057!3d-12.808009756540383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x196ce6211b4f50a7%3A0x938f43646c2aa0d3!2sGrace%20Baptist%20Church!5e0!3m2!1sen!2szm!4v1790024421640!5m2!1sen!2szm'
  }
});

/* ---------- leaders: 2 pastors + 2 deacons ---------- */
await Leader.insertMany([
  {
    name: 'Pastor Ngandu Elvis',
    position: 'Senior Pastor',
    biography: '[Add Senior Pastor biography]',
    photo: '/leaders/pastor-01.jpg',
    ministry: 'Pastoral',
    bibleVerse: '[Add Bible verse]',
    displayOrder: 1,
    isActive: true
  },
  {
    name: 'Pastor Mwansa Lucky',
    position: 'Assistant Pastor',
    biography: '[Add Assistant Pastor biography]',
    photo: '/leaders/pastor-02.jpg',
    ministry: 'Pastoral',
    bibleVerse: '[Add Bible verse]',
    displayOrder: 2,
    isActive: true
  },
  {
    name: 'Deacon Siame Chikusi',
    position: 'Deacon',
    biography: '[Add Deacon biography]',
    photo: '/leaders/deacon-01.jpg',
    ministry: 'Diaconate',
    bibleVerse: '[Add Bible verse]',
    displayOrder: 3,
    isActive: true
  },
  {
    name: 'Deacon Teza Simutowe',
    position: 'Deacon',
    biography: '[Add Deacon biography]',
    photo: '/leaders/deacon-02.jpg',
    ministry: 'Diaconate',
    bibleVerse: '[Add Bible verse]',
    displayOrder: 4,
    isActive: true
  }
]);

/* ---------- ministries: 8 with leaders, contacts, photos ---------- */
await Ministry.insertMany([
  {
    name: "Children's Ministry",
    description:
      'Teaching children the Word of God in a joyful, safe, and nurturing environment.',
    leader: 'Sis Loveness Lumbwe',
    image: '/ministries/children.jpg',
    schedule: 'Sundays 09:00hrs – 10:00hrs',
    contact: '097 670 9849',
    isActive: true
  },
  {
    name: 'Teens Ministry',
    description:
      'Helping teenagers grow in their faith, build godly friendships, and discover their purpose in Christ.',
    leader: 'Deacon Teza Simutowe',
    image: '/ministries/teens.jpg',
    schedule: 'Saturdays 09:00hrs – 10:00hrs',
    contact: '097 776 8044',
    isActive: true
  },
  {
    name: 'Youth Ministry',
    description:
      'Equipping young people to grow in Christ, study Scripture, and serve the church.',
    leader: 'Bro. Lawrence Chula Bwalya',
    image: '/ministries/youth.jpg',
    schedule: 'Saturdays 14:00hrs – 16:00hrs',
    contact: '096 940 6480',
    isActive: true
  },
  {
    name: 'Campus Outreach Ministry',
    description:
      'Reaching students on campuses in Kitwe with the Gospel and discipling them in Christ.',
    leader: 'Bro. Temwananji Simunyola',
    image: '/ministries/campus-outreach.jpg',
    schedule: 'Fridays 18:00hrs – 19:00hrs',
    contact: '097 992 8917',
    isActive: true
  },
  {
    name: 'Music Ministry',
    description:
      'Leading the congregation in Christ-centered worship through song and praise.',
    leader: 'Bro. Ezekiel Nketani',
    image: '/ministries/music.jpg',
    schedule: 'Saturdays 16:00hrs – 17:00hrs (Rehearsal)',
    contact: '097 258 8810',
    isActive: true
  },
  {
    name: 'Couples Ministry',
    description:
      'Strengthening marriages and families through biblical teaching, fellowship, and prayer.',
    leader: 'Pastor Mwansa Lucky',
    image: '/ministries/couples.jpg',
    schedule: 'Saturdays 10:00hrs – 12:00hrs (Monthly)',
    contact: '096 320 7119',
    isActive: true
  },
  {
    name: "Men's Ministry",
    description:
      'Building godly men through Bible study, accountability, and service.',
    leader: 'Deacon Chikosi Siame',
    image: '/ministries/men.jpg',
    schedule: 'Saturdays 10:00hrs – 12:00hrs (Monthly)',
    contact: '096 535 1841',
    isActive: true
  },
  {
    name: 'Ladies Ministry',
    description:
      'Encouraging women to grow in faith, prayer, and Christian fellowship.',
    leader: 'Mrs Ngandu Lisa',
    image: '/ministries/women.jpg',
    schedule: 'Saturdays 10:00hrs – 12:00hrs (Monthly)',
    contact: '097 716 9760',
    isActive: true
  }
]);

/* ---------- weekly activities ---------- */
await Activity.insertMany([
  {
    title: 'Sunday School',
    day: 'Sunday',
    startTime: '09:00',
    endTime: '10:00',
    location: 'Main Sanctuary',
    isActive: true
  },
  {
    title: 'Teens Class',
    day: 'Sunday',
    startTime: '09:00',
    endTime: '10:00',
    location: 'Main Sanctuary',
    isActive: true
  },
  {
    title: 'Sunday Service',
    day: 'Sunday',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Main Sanctuary',
    isActive: true
  },
  {
    title: 'Wednesday Bible Study',
    day: 'Wednesday',
    startTime: '17:30',
    endTime: '18:00',
    location: 'Main Sanctuary',
    isActive: true
  }
]);

/* ---------- sample sermon ---------- */
await Sermon.create({
  title: '[Sample Sermon] The Faithfulness of God',
  speaker: 'Pastor Ngandu Elvis',
  scripture: 'Lamentations 3:22\u201323',
  bibleBook: 'Lamentations',
  category: 'Sermon',
  description: 'Sample sermon \u2014 replace from the dashboard.',
  sermonDate: new Date(),
  isFeatured: true,
  status: 'published'
});

/* ---------- sample announcement ---------- */
await Announcement.create({
  title: 'Welcome to Grace Bible Baptist Church Kitwe',
  summary: 'We are glad you are here.',
  content: 'Sample announcement \u2014 replace from the dashboard.',
  author: 'Administrator',
  status: 'published',
  isFeatured: true
});

/* ---------- sample upcoming events (with countdown) ---------- */
const nowMs = Date.now();
const DAY = 24 * 60 * 60 * 1000;

await Event.insertMany([
  {
    title: 'Sunday Worship Service',
    description:
      'Join us for a morning of worship and the preaching of God\u2019s Word.',
    date: new Date(nowMs + 3 * DAY),
    startTime: '10:00',
    endTime: '12:00',
    location: 'Main Sanctuary',
    isFeatured: true,
    showCountdown: true,
    status: 'published'
  },
  {
    title: 'Youth Conference',
    description:
      'A weekend of teaching, worship, and fellowship for young people.',
    date: new Date(nowMs + 14 * DAY),
    startTime: '14:00',
    endTime: '18:00',
    location: 'Main Sanctuary',
    showCountdown: true,
    status: 'published'
  },
  {
    title: 'Baptism Service',
    description:
      'Celebrating new believers publicly declaring their faith in Christ.',
    date: new Date(nowMs + 30 * DAY),
    startTime: '10:00',
    location: 'Main Sanctuary',
    showCountdown: true,
    status: 'published'
  }
]);

console.log('\u2705 Seeded. Admin:', process.env.ADMIN_EMAIL);
await mongoose.disconnect();