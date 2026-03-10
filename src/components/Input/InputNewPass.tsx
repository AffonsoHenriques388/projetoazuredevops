import styled from 'styled-components';
import React from 'react';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { type } from 'os';

interface Props {
  label?: string;
  iconStart: React.ReactNode | React.ReactNode[];
  iconEnd?: React.ReactNode | React.ReactNode[];
  id?: string;
  props?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  type?: 'text' | 'password';
  $inputWidth?: string;
  onChange?: (value?: string) => void;
  checked?: boolean;
  className?: string;
  required?: boolean;
  color?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const MyInput = styled.input<{ $inputWidth?: string }>`
  width: ${({ $inputWidth }) => $inputWidth || '100%'}; // 100% é o padrão
`;

export default function InputNewPass({
  type = 'text',
  onChange = () => {},
  iconStart,
  iconEnd,
  color = 'black',

  ...props
}: Props) {
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
  };

  

  return (
    <>
      <div className="border border-gray300 rounded flex gap-3 items-center p-2 md:p-3">
        <label htmlFor={props.id}>{props.label}</label>
        <MyInput
          required
          {...props}
          type={type === 'password' && !passwordVisible ? 'password' : 'text'}
          onChange={handleInputChange}
          id={props.id}
          placeholder={props.placeholder}
          className="outline-none font-inter text-sm md:text-md rounded flex gap-3 bg-white items-center text-center disabled:opacity-75 disabled:cursor-not-allowed"
        />
        {type === 'password' && (
          <div onClick={togglePasswordVisibility}>
            {passwordVisible ? (
              <BsEyeSlashFill size={20} color="rgba(188, 188, 188, 0.40)" />
            ) : (
              <BsEyeFill size={20} color="rgba(188, 188, 188, 0.40)" />
            )}
          </div>
        )}
        {iconEnd}
      </div>
    </>
  );
}
