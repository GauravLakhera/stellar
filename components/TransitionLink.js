"use client";
import Link from 'next/link';
import { useNavigate } from '../hooks/useNavigate';

export const TransitionLink = ({ href, children, className, ...props }) => {
  const { navigate } = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <Link 
      href={href} 
      onClick={handleClick} 
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
};