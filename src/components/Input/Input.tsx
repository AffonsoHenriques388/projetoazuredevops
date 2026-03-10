import styled from 'styled-components';
import React from 'react';

interface Props {
  label?: string;
  id?: string;
  props?: string;
  autoComplete?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  type?: string;
  $inputWidth?: string;
  maxLength?: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const MyInput = styled.input<{ $inputWidth?: string }>`
  width: ${({ $inputWidth }) => $inputWidth || '100%'}; // 100% é o padrão
`;
const Input = (props: Props) => {
  return (
    <div>
      <label htmlFor={props.id}>{props.label}</label>
      <MyInput
        required
        {...props}
        className={props.className}
        type={props.type}
        id={props.id}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
      />
    </div>
  );
};

export default Input;
