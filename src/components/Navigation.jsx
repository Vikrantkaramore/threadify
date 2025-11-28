import React from 'react';
import CardNav from '../ui/CardNav';
import logo from '@assets/logo.png';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const items = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Our Story", href: "/about", ariaLabel: "About Threadify" },
        { label: "Homepage", href: "/", ariaLabel: "Homepage" }
      ]
    },
    {
      label: "Provide Services",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Services", href: "/services",ariaLabel: "Services We Provide" },
        { label: "Pricing", href: "/pricing", ariaLabel: "Service Pricing" }
      ]
    },
    {
      label: "Contact",
      bgColor: "#271E37",
      textColor: "#fff",
      links: [
        { label: "Email", href: "https://mail.google.com/mail/u/0/#inbox" ,ariaLabel: "Email us" },
        { label: "Twitter", href: "" ,ariaLabel: "Twitter" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/vikrant-karamore-4b8b78257/" ,ariaLabel: "LinkedIn" },
        { label: "Contact Form", href: "/contact", ariaLabel: "Contact us" }
      ]
    }
  ];

  const cta = (
    <Link to="/login" className="card-nav-cta-button hidden md:inline-flex border-0 rounded-[calc(0.75rem-0.2rem)] px-4 items-center h-full font-medium cursor-pointer transition-colors duration-300 no-underline">
      Login
    </Link>
  );

  return (
    <CardNav
      logo={logo}
      cta={cta}
      logoAlt="Company Logo"
      items={items}
      baseColor="#fff"
      menuColor="#000"
      buttonBgColor="#111"
      buttonTextColor="#fff"
      ease="power3.out"
    />
  );
};

export default Navigation;
