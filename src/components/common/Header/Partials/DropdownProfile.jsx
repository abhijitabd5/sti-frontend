import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Transition from '@/components/common/Transition/Transition';
import { useAuth } from '@/hooks/useAuth';

function DropdownProfile({
  align
}) {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/auth/login');
  };

  const formatRole = (role) => {
    if (!role) return 'User';
    const roleMap = {
      'super_admin': 'Super Admin',
      'admin': 'Admin',
      'account': 'Account',
      'student': 'Student',
      'instructor': 'Instructor'
    };
    return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getUserName = () => {
    if (!user) return 'User';
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'User';
  };

  const getUserImage = () => {
    return user?.profile_image || null;
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        {getUserImage() ? (
          <img className="w-8 h-8 rounded-full object-cover" src={getUserImage()} width="32" height="32" alt="User" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </span>
          </div>
        )}
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white">
            {getUserName()}
          </span>
          <svg className="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500" viewBox="0 0 12 12">
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200 dark:border-gray-700/60">
            <div className="font-medium text-gray-800 dark:text-gray-100">{getUserName()}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 italic">{formatRole(user?.role)}</div>
          </div>
          <ul>
            <li>
              <Link
                className="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                to="/admin/profile"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                className="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3 w-full text-left"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  )
}

export default DropdownProfile;