// client/src/components/common/Navbar.jsx (improved version)
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../store/actions/authActions';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  
  return (
    <nav className="bg-white border-b border-secondary-200 py-2 px-4 flex justify-end items-center">
      <div className="flex items-center space-x-3">
        {/* Quick actions */}
        <button
          className="p-2 rounded-full text-secondary-600 hover:bg-secondary-100 focus:outline-none"
          title="Add New Trade"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        
        <button
          className="p-2 rounded-full text-secondary-600 hover:bg-secondary-100 focus:outline-none"
          title="Notifications"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        
        <div className="relative">
          <button
            onClick={toggleProfileMenu}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary-500 text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </button>
          
          {isProfileOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                <div className="px-4 py-2 border-b border-secondary-100">
                  <p className="text-sm font-medium text-secondary-900">{user?.name}</p>
                  <p className="text-xs text-secondary-500">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                  role="menuitem"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Your Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                  role="menuitem"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsProfileOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                  role="menuitem"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;