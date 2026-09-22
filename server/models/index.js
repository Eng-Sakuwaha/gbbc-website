import mongoose from 'mongoose';

const base = { timestamps: true };

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Super Admin', 'Admin', 'Editor'], default: 'Admin' }
}, base);

const LeaderSchema = new mongoose.Schema({
  name: String,
  position: String,
  biography: String,
  photo: String,
  ministry: String,
  bibleVerse: String,
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, base);

const SermonSchema = new mongoose.Schema({
  title: String,
  speaker: String,
  scripture: String,
  bibleBook: String,
  category: String,
  description: String,
  sermonDate: Date,
  audioUrl: String,
  videoUrl: String,
  youtubeUrl: String,
  thumbnail: String,
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' }
}, base);

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  startTime: String,
  endTime: String,
  location: String,
  image: String,
  registrationUrl: String,
  isFeatured: { type: Boolean, default: false },
  showCountdown: { type: Boolean, default: true },
  status: { type: String, default: 'published' }
}, base);

const AnnouncementSchema = new mongoose.Schema({
  title: String,
  summary: String,
  content: String,
  image: String,
  author: String,
  publishDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  isFeatured: { type: Boolean, default: false }
}, base);

const ActivitySchema = new mongoose.Schema({
  title: String,
  day: String,
  startTime: String,
  endTime: String,
  location: String,
  description: String,
  image: String,
  ministry: String,
  isActive: { type: Boolean, default: true }
}, base);

const MinistrySchema = new mongoose.Schema({
  name: String,
  description: String,
  leader: String,
  image: String,
  schedule: String,
  contact: String,
  isActive: { type: Boolean, default: true }
}, base);

const ContactMessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  isRead: { type: Boolean, default: false }
}, base);

const ChurchSettingsSchema = new mongoose.Schema({
  churchName: { type: String, default: 'Grace Bible Baptist Church Kitwe' },
  motto: { type: String, default: 'Loving God. Loving Others.' },
  about: String,
  mission: String,
  vision: String,
  history: String,
  beliefs: String,
  address: { type: String, default: 'Nkana East, near CBU East Gate, Kitwe, Zambia' },
  phone: String,
  email: String,
  serviceTimes: [{ title: String, day: String, time: String, description: String }],
  socialLinks: { facebook: String, instagram: String, youtube: String, whatsapp: String },
  mapLocation: { lat: Number, lng: Number, embedUrl: String },
  logo: { type: String, default: '/logo.png' }
}, base);

export const User = mongoose.model('User', UserSchema);
export const Leader = mongoose.model('Leader', LeaderSchema);
export const Sermon = mongoose.model('Sermon', SermonSchema);
export const Event = mongoose.model('Event', EventSchema);
export const Announcement = mongoose.model('Announcement', AnnouncementSchema);
export const Activity = mongoose.model('Activity', ActivitySchema);
export const Ministry = mongoose.model('Ministry', MinistrySchema);
export const ContactMessage = mongoose.model('ContactMessage', ContactMessageSchema);
export const ChurchSettings = mongoose.model('ChurchSettings', ChurchSettingsSchema);