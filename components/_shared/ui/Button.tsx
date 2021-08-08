import React, { forwardRef, ReactNode, Fragment } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Popover, Transition } from '@headlessui/react';

type Props = {
  children?: ReactNode;
  href?: string;
  icon?: IconProp;
  label: string;
  color: string;
  textColor: string;
  className?: string;
  popover?: boolean;
  onClick?: any;
};

export type Ref = any;

// eslint-disable-next-line react/display-name
const Button = forwardRef<Ref, Props>(
  (
    { href, label, color, icon, textColor, className, children, onClick },
    ref
  ) => {
    const classes = classNames(
      {
        [`bg-${color}`]: React.Children.count(children) === 0,
        [`text-${textColor}`]: true,
      },
      'hover:bg-accent-bright inline-block py-1 px-4 mr-2 relative',
      className
    );
    const iconSVG = icon ? (
      <FontAwesomeIcon icon={icon} className="mr-1" />
    ) : null;
    const buttonProps = { className: classes, href, ref, onClick };
    let buttonEl: any;
    if (href) {
      buttonEl = (
        <a {...buttonProps}>
          {iconSVG}
          {label}
        </a>
      );
    } else if (React.Children.count(children) > 0) {
      buttonEl = buttonWithPopover(
        buttonEl,
        buttonProps,
        iconSVG,
        label,
        color,
        textColor,
        children
      );
    } else {
      buttonEl = (
        <button {...buttonProps}>
          {iconSVG}
          {label}
        </button>
      );
    }
    return <Popover className="inline-block relative">{buttonEl}</Popover>;
  }
);

function buttonWithPopover(
  buttonEl: any,
  buttonProps: {
    className: string;
    href: string;
    ref: ((instance: any) => void) | React.MutableRefObject<any>;
  },
  iconSVG: JSX.Element,
  label: string,
  color: string,
  textColor: string,
  children:
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
) {
  // eslint-disable-next-line react/display-name
  buttonEl = ({ open }) => (
    <>
      <Popover.Button
        type="button"
        {...buttonProps}
        className={`${open ? 'bg-accent-bright' : 'bg-primary'} ${
          buttonProps.className
        }`}
      >
        {iconSVG}
        {label}{' '}
        <FontAwesomeIcon
          icon={'chevron-down'}
          className={`${open ? 'transform rotate-90' : ''}`}
        />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute z-50 w-screen max-w-sm p-2 transform -translate-x-1/2 left-1/2 lg:max-w-2xl bg-accent-bright">
          {children}
        </Popover.Panel>
      </Transition>
    </>
  );
  return buttonEl;
}

(Button as React.FC).displayName = 'Button';

export default Button;
