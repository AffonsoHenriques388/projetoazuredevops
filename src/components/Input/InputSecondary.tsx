/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components';
import React from 'react';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

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
  onChange?: (value?: string | any) => void;
  checked?: boolean;
  className?: string;
  required?: boolean;
  color?: string;
  disabled?: boolean;
  maxLength?: number;
  style?: React.CSSProperties;
  defaultValue?: string;
  onChangeText?: (value?: string | any) => void;
}

const MyInput = styled.input<{ $inputWidth?: string }>`
  width: ${({ $inputWidth }) => $inputWidth || '100%'}; // 100% é o padrão
`;
const InputSecondary = ({
  type = 'text',
  onChange = () => {},
  iconStart,
  iconEnd,
  color = 'black',
  ...props
}: Props) => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
  };

  return (
    <div className="pt-3 pb-3 pl-3 text-sm pr-5 w-full border border-gray300 rounded flex items-center gap-5">
      <label htmlFor={props.id}>{props.label}</label>
      <MyInput
        required
        {...props}
        type={type === 'password' && !passwordVisible ? 'password' : 'text'}
        onChange={handleInputChange}
        id={props.id}
        maxLength={props.maxLength}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        className={`outline-none ${color} w-full font-inter disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray200`}
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
  );
};

export default InputSecondary;
