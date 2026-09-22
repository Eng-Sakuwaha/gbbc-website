import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  User,
  Leader,
  Sermon,
  Event,
  Announcement,
  Activity,
  Ministry,
  ContactMessage,
  ChurchSettings
} from '../models/index.js';
import { sendContactNotification } from '../utils/email.js';

/* ---------------- AUTH ---------------- */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please enter your email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server misconfigured.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (e) {
    console.error('login error:', e);
    res.status(500).json({ message: 'Unable to sign in. Please try again.' });
  }
};

export const me = (req, res) => res.json(req.user);

/* ---------------- CHURCH SETTINGS ---------------- */
export const getSettings = async (_req, res) => {
  try {
    let s = await ChurchSettings.findOne();
    if (!s) s = await ChurchSettings.create({});
    res.json(s);
  } catch (e) {
    console.error('getSettings error:', e);
    res.status(500).json({ message: 'Unable to load settings.' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let s = await ChurchSettings.findOne();
    if (!s) {
      s = await ChurchSettings.create(req.body);
    } else {
      Object.assign(s, req.body);
      await s.save();
    }
    res.json(s);
  } catch (e) {
    console.error('updateSettings error:', e);
    res.status(400).json({ message: e.message || 'Unable to save settings.' });
  }
};

/* ---------------- GENERIC CRUD ---------------- */
export const makeCrud = (Model, { activeField, publicFilter } = {}) => ({
  list: async (req, res) => {
    try {
      const q = {};
      if (activeField && !req.user) q[activeField] = true;
      if (publicFilter && !req.user) Object.assign(q, publicFilter);
      const items = await Model.find(q).sort({ createdAt: -1 });
      res.json(Array.isArray(items) ? items : []);
    } catch (e) {
      console.error('list error:', e);
      res.status(500).json({ message: 'Unable to load records.' });
    }
  },

  getOne: async (req, res) => {
    try {
      const doc = await Model.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Not found.' });
      res.json(doc);
    } catch (e) {
      console.error('getOne error:', e);
      res.status(400).json({ message: 'Invalid ID.' });
    }
  },

  create: async (req, res) => {
    try {
      const doc = await Model.create(req.body);
      res.status(201).json(doc);
    } catch (e) {
      console.error('create error:', e);
      res.status(400).json({ message: e.message || 'Unable to create.' });
    }
  },

  update: async (req, res) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!doc) return res.status(404).json({ message: 'Not found.' });
      res.json(doc);
    } catch (e) {
      console.error('update error:', e);
      res.status(400).json({ message: e.message || 'Unable to update.' });
    }
  },

  remove: async (req, res) => {
    try {
      await Model.findByIdAndDelete(req.params.id);
      res.json({ ok: true });
    } catch (e) {
      console.error('remove error:', e);
      res.status(400).json({ message: 'Unable to delete.' });
    }
  }
});

/* ---------------- CONTACT ---------------- */
export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: 'Please complete all required fields.' });
    }

    const msg = await ContactMessage.create(req.body);

    // Fire-and-forget optional email notification.
    sendContactNotification(msg).catch((e) =>
      console.warn('Email notification skipped:', e.message)
    );

    res.status(201).json({ ok: true, id: msg._id });
  } catch (e) {
    console.error('submitContact error:', e);
    res.status(500).json({ message: 'Unable to send message.' });
  }
};

export const listMessages = async (_req, res) => {
  try {
    const msgs = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(msgs);
  } catch (e) {
    res.status(500).json({ message: 'Unable to load messages.' });
  }
};

export const markMessageRead = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(msg);
  } catch (e) {
    res.status(400).json({ message: 'Unable to update message.' });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ message: 'Unable to delete message.' });
  }
};

/* ---------------- DASHBOARD ---------------- */
export const dashboardStats = async (_req, res) => {
  try {
    const [sermons, events, activities, announcements, leaders, unread] =
      await Promise.all([
        Sermon.countDocuments(),
        Event.countDocuments({ date: { $gte: new Date() } }),
        Activity.countDocuments({ isActive: true }),
        Announcement.countDocuments({ status: 'published' }),
        Leader.countDocuments({ isActive: true }),
        ContactMessage.countDocuments({ isRead: false })
      ]);
    res.json({ sermons, events, activities, announcements, leaders, unread });
  } catch (e) {
    console.error('dashboardStats error:', e);
    res.status(500).json({ message: 'Unable to load dashboard.' });
  }
};