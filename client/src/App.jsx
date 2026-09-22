import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Leadership from './pages/Leadership.jsx';
import Ministries from './pages/Ministries.jsx';
import WeeklyActivities from './pages/WeeklyActivities.jsx';
import Sermons from './pages/Sermons.jsx';
import Events from './pages/Events.jsx';
import Announcements from './pages/Announcements.jsx';
import Contact from './pages/Contact.jsx';
import Give from './pages/Give.jsx';
import NotFound from './pages/NotFound.jsx';

import AdminLogin from './admin/AdminLogin.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import Dashboard from './admin/Dashboard.jsx';
import AdminCollection from './admin/AdminCollection.jsx';
import AdminSettings from './admin/AdminSettings.jsx';
import AdminMessages from './admin/AdminMessages.jsx';
import AdminMedia from './admin/AdminMedia.jsx';
import AdminProfile from './admin/AdminProfile.jsx';
import ProtectedRoute from './admin/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/leadership" element={<Leadership />} />
        <Route path="/ministries" element={<Ministries />} />
        <Route path="/weekly-activities" element={<WeeklyActivities />} />
        <Route path="/sermons" element={<Sermons />} />
        <Route path="/events" element={<Events />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/give" element={<Give />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route
          path="leaders"
          element={<AdminCollection resource="leaders" fields={['name','position','biography','photo','ministry','bibleVerse','displayOrder','isActive']} />}
        />
        <Route
          path="sermons"
          element={<AdminCollection resource="sermons" fields={['title','speaker','scripture','bibleBook','category','description','sermonDate','youtubeUrl','audioUrl','thumbnail','isFeatured','status']} />}
        />
        <Route
          path="events"
          element={<AdminCollection resource="events" fields={['title','description','date','startTime','endTime','location','image','registrationUrl','isFeatured','showCountdown','status']} />}
        />
        <Route
          path="announcements"
          element={<AdminCollection resource="announcements" fields={['title','summary','content','author','status','isFeatured']} />}
        />
        <Route
          path="activities"
          element={<AdminCollection resource="activities" fields={['title','day','startTime','endTime','location','description','isActive']} />}
        />
        <Route
          path="ministries"
          element={<AdminCollection resource="ministries" fields={['name','description','leader','schedule','contact','isActive']} />}
        />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="media" element={<AdminMedia />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}