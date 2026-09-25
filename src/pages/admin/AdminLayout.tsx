import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Heart, 
  Bell, 
  Calendar, 
  Image, 
  Mail, 
  FileText, 
  Clock,
  LogOut, 
  Home, 
  Shield, 
  UserCircle,
  Church 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, token, logout, isViewer, isAdmin, isEditor, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <span className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, roles: ['admin', 'editor', 'viewer'] },
    { path: '/admin/about', label: 'Edit About Us', icon: <FileText className="w-4 h-4" />, roles: ['admin', 'editor'] },
    { path: '/admin/timetable', label: 'Liturgical Timetable', icon: <Clock className="w-4 h-4" />, roles: ['admin', 'editor'] },
    { path: '/admin/subchurches', label: 'Outstations & Committees', icon: <Church className="w-4 h-4" />, roles: ['admin', 'editor'] },
    { path: '/admin/donations', label: 'Donation Ledger & CSV', icon: <Heart className="w-4 h-4" />, roles: ['admin', 'editor', 'viewer'] },
    { path: '/admin/announcements', label: 'Announcements CMS', icon: <Bell className="w-4 h-4" />, roles: ['admin', 'editor'] },
    { path: '/admin/events', label: 'Liturgical Events', icon: <Calendar className="w-4 h-4" />, roles: ['admin', 'editor'] },
    { path: '/admin/gallery', label: 'Gallery Media', icon: <Image className="w-4 h-4" />, roles: ['admin', 'editor'] },
    { path: '/admin/messages', label: 'Parishioner Inquiries', icon: <Mail className="w-4 h-4" />, roles: ['admin', 'editor', 'viewer'] },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 text-white flex flex-col justify-between shrink-0 border-r border-slate-800">
        
        {/* Brand */}
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold font-liturgical text-xl shadow">
              ✠
            </div>
            <div>
              <span className="font-liturgical font-bold text-sm text-white block leading-tight">
                HOLY SPIRIT CMS
              </span>
              <span className="text-[10px] text-amber-400 font-medium tracking-wide uppercase">
                Staff Management
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              const hasAccess = item.roles.includes(user.role);

              if (!hasAccess) return null;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                    active
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={active ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white block truncate">{user.name}</span>
              <span className="text-[10px] text-amber-400 uppercase font-semibold tracking-wider block">
                Role: {user.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
            <Link
              to="/"
              className="flex-1 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-medium transition-colors flex items-center justify-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="py-1.5 px-3 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 text-[11px] font-medium transition-colors flex items-center justify-center gap-1"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};
