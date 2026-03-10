/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { IconButton } from '@mui/material';
import { useMediaQuery, Theme } from '@mui/material';

interface Field {
  name: string;
  role: string;
}

interface DynamicFieldsProps {
  onFieldsChange2: (fields: Field[]) => void;
}

const DynamicFields2: React.FC<DynamicFieldsProps> = ({ onFieldsChange2 }) => {
  const [fields, setFields] = React.useState<Field[]>([{ name: '', role: '' }]);

  const addField = () => {
    setFields([...fields, { name: '', role: '' }]);
  };

  React.useEffect(() => {
    const savedFields = sessionStorage.getItem('fields2');
    if (savedFields) {
      setFields(JSON.parse(savedFields));
    }
  }, []);
  React.useEffect(() => {
    sessionStorage.setItem('fields2', JSON.stringify(fields));
  }, [fields]);

  const removeField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
    onFieldsChange2(newFields);
    sessionStorage.removeItem('fields2');
  };

  const handleFieldChange = (
    index: number,
    fieldName: keyof Field,
    value: string,
  ) => {
    const newFields = [...fields];
    newFields[index] = {
      ...newFields[index],
      [fieldName]: value,
    };
    setFields(newFields);
    onFieldsChange2(newFields); // Chame a função de retorno de chamada do pai com os novos dados
  };
  return (
    <div className="flex justify-center flex-col">
      {fields.map((field: Field, index: any) => (
        <div key={index} className="flex md:flex-row flex-col">
          <DynamicField
            field={field}
            onFieldChange={(fieldName, value) =>
              handleFieldChange(index, fieldName, value)
            }
          />
          <IconButton onClick={() => removeField(index)} disableRipple={true}>
            <AiOutlineMinus
              style={{
                color: '#009CDE',
              }}
            />
          </IconButton>
        </div>
      ))}

      <div className="flex justify-center align-center">
        {fields.length >= 10 ? null : (
          <IconButton onClick={addField} disableRipple={true}>
            <AiOutlinePlus
              style={{
                backgroundColor: '#009CDE',
                color: 'white',
                borderRadius: '50%',
                padding: 3,
              }}
            />
          </IconButton>
        )}
      </div>
      {/* 
      {fields.map((field: Field, index: any) => (
        <DynamicField
          key={index}
          field={field}
          onFieldChange={(fieldName, value) =>
            handleFieldChange(index, fieldName, value)
          }
        />
      ))} */}
    </div>
  );
};

interface DynamicFieldProps {
  field: Field;
  onFieldChange: (fieldName: keyof Field, value: string) => void;
}

const DynamicField: React.FC<DynamicFieldProps> = ({
  field,
  onFieldChange,
}) => {
  const isMobile = useMediaQuery((theme: Theme) => {
    return theme.breakpoints.down('sm');
  });

  return (
    <div className="flex md:flex-row flex-col gap-3 justify-center">
      <input
        style={{ width: isMobile ? '100%' : '450px' }}
        type="text"
        value={field.name}
        className="inputProtocolo text-sm md:text-base"
        placeholder="Nome "
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onFieldChange('name', e.target.value)
        }
      />
      <input
        style={{ width: isMobile ? '100%' : '450px' }}
        type="text"
        value={field.role}
        className="inputProtocolo text-sm md:text-base"
        placeholder="Cargo"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onFieldChange('role', e.target.value)
        }
      />
    </div>
  );
};

export default DynamicFields2;
