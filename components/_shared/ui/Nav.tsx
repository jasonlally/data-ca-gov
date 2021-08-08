import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Logo from './Logo';

/**
 * Displays a navigation bar with logo and menu links
 * @param {Object} props object with the following properties:
 * {
 *  logo: The relative url to the logo image
 *  navMenu: An array of objects with menu items. E.g : [{ title: 'Blog', path: '/blog' },{ title: 'Search', path: '/search' }]
 * }
 * @returns React Component
 */
const Nav = ({ logo, navMenu, bgColor }) => {
  const [open, setOpen] = useState(false);
  const handleClick = (event) => {
    event.preventDefault();
    setOpen(!open);
  };

  return (
    <nav
      className={classnames(
        `flex items-center justify-between flex-wrap bg-primary-background py-4`
      )}
    >
      <div className="flex items-center flex-shrink-0 text-white">
        <Link href="/">
          <div>
            <Logo />
          </div>
        </Link>
      </div>
      <div className="block lg:hidden mx-4">
        <button
          onClick={handleClick}
          className="flex items-center px-3 py-2 border rounded text-white border-orange-400 hover:text-black hover:border-black"
        >
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div className={`${open ? `block` : `hidden`} lg:block`}>
        {navMenu.map((menu, index) => {
          return (
            <Link href={menu.path} key={index}>
              <a
                href="/"
                className="block mt-4 lg:inline-block lg:mt-0 active:bg-primary-background text-white hover:text-black mr-6"
              >
                {menu.title}
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

Nav.propTypes = {
  logo: PropTypes.string.isRequired,
  navMenu: PropTypes.array.isRequired,
};
export default Nav;
