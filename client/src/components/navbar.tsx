import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [, setLocation] = useLocation();
  
  const user = JSON.parse(localStorage.getItem("user") || '{"username": "User", "email": "user@example.com"}');

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLocation("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-slate-800">
                <i className="fas fa-robot text-primary mr-2"></i>
                AI Resume Screening
              </h1>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <button 
                  onClick={() => setLocation("/dashboard")}
                  className="text-primary-600 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-primary-500"
                  data-testid="nav-dashboard"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setLocation("/upload")}
                  className="text-slate-500 hover:text-slate-700 px-3 py-2 rounded-md text-sm font-medium"
                  data-testid="nav-upload"
                >
                  Upload Job
                </button>
                <button 
                  onClick={() => setLocation("/checkout")}
                  className="text-slate-500 hover:text-slate-700 px-3 py-2 rounded-md text-sm font-medium"
                  data-testid="nav-billing"
                >
                  Billing
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600" data-testid="user-email">
              {user.email}
            </span>
            <button className="text-slate-400 hover:text-slate-600">
              <i className="fas fa-bell text-lg"></i>
            </button>
            <div className="relative">
              <button 
                onClick={handleLogout}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                data-testid="button-logout"
              >
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user.username?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
