import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">

          <div className="flex items-center lg:order-2">
            <button
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800 transition duration-200"
              onClick={() => navigate('/login')}
            >
              Logout
            </button>

            <button data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
            </button>
          </div>

          <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">

              <li>
                <button onClick={() => navigate('/admin/home')} className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white">
                  Home
                </button>
              </li>

              <li>
                <button onClick={() => navigate('/admin/users')} className="block py-2 pr-4 pl-3 text-gray-700 hover:text-primary-700 lg:p-0 dark:text-gray-400 dark:hover:text-white">
                  Users
                </button>
              </li>

              <li>
                <button onClick={() => navigate('/admin/stores')} className="block py-2 pr-4 pl-3 text-gray-700 hover:text-primary-700 lg:p-0 dark:text-gray-400 dark:hover:text-white">
                  Stores
                </button>
              </li>

              <li>
                <button className="block py-2 pr-4 pl-3 text-gray-700 lg:p-0 dark:text-gray-400" disabled>
                  {/* Empty or future section */}
                </button>
              </li>

            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
