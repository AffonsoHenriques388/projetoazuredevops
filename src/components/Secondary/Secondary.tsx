import React from 'react';

interface SecondaryProps {
  children: React.ReactNode;
}

export default function Secondary({ children }: SecondaryProps) {
  return (
    <div className="flex justify-center align-center mb-6 mt-3 ">
      <div className="bg-gray100 md:p-5 rounded md:shadow-md shadow p-4">
        <div className="flex justify-center align-center md:p-5 gap-5 bg-white rounded md:shadow-md shadow flex-col p-4 w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
