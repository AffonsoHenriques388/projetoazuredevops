import React from 'react';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import './styles.css';

interface PropsInputPrimary {
  id?: string;
  iconStart: React.ReactNode | React.ReactNode[];
  iconEnd?: React.ReactNode | React.ReactNode[];
  type?: 'text' | 'password';
  placeholder?: string;
  value?: string;
  required: boolean;
  style?: React.CSSProperties;
  onChange?: (value: string) => void;
  className?: string;
  placeholderColor?: string;
  color?: string;
}

export default function InputPrimary({
  iconStart,
  iconEnd,
  required,
  type = 'text',
  placeholder = '',
  value = '',
  // placeholderColor = 'placeholder-gray300',
  color = 'black',
  onChange = () => {},
}: PropsInputPrimary) {
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
      <div className="pt-3 pb-3 pl-3 text-md pr-5 w-full border border-gray300 rounded flex gap-3 items-center gap-5 bg-white">
        {iconStart}
        <input
          id="input-primary"
          required={required}
          type={type === 'password' && !passwordVisible ? 'password' : 'text'}
          placeholder={placeholder}
          style={{
            background: 'white',
            width: '100%',
            textAlign: 'center',
          }}
          value={value}
          onChange={handleInputChange}
          className={`outline-none ${color} w-full font-inter bg-white text-sm md:text-base`}
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
