/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@mui/material';
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode | React.ReactNode[];
  props?: any;
  onClick?: () => void | undefined;
  bgColor?: string;
  color?: string;
  hoverColor?: string;
  fontSize?: string;
  hoverBgColor?: string;
  size?: string;
  type?: 'submit' | 'reset' | 'button';
}

const ButtonSecondary = ({
  onClick,
  children,
  bgColor = 'bg-blue',
  color = 'text-white',
  hoverColor = 'blue-300',
  type = 'button',
  fontSize = 'text-sm md:text-base',
  size = 'w-full',

  ...props
}: Props) => {
  return (
    <button
      onClick={onClick}
      type={type}
      {...props}
      className={` ${color} ${bgColor} ${hoverColor} font-inter py-2 md:py-3 md:px-4 px-2 border-none rounded gap-3 ${size} ${fontSize}`}
    >
      {children}
    </button>
  );
};

export default ButtonSecondary;
