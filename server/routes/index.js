import { Router } from 'express';
import auth from './auth.js';
import church from './church.js';
import leaders from './leaders.js';
import ministries from './ministries.js';
import activities from './activities.js';
import sermons from './sermons.js';
import events from './events.js';
import announcements from './announcements.js';
import contact from './contact.js';
import media from './media.js';
import users from './users.js';
import profile from './profile.js';
import admin from './admin.js';

const r = Router();

r.get('/health', (_req, res) => res.json({ ok: true, service: 'gbbc-api' }));

r.use('/auth', auth);
r.use('/church', church);
r.use('/leaders', leaders);
r.use('/ministries', ministries);
r.use('/activities', activities);
r.use('/sermons', sermons);
r.use('/events', events);
r.use('/announcements', announcements);
r.use('/contact', contact);
r.use('/media', media);
r.use('/users', users);
r.use('/profile', profile);
r.use('/admin', admin);

export default r;