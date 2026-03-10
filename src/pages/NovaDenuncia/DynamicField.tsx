/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { IconButton } from '@mui/material';
import { useMediaQuery, Theme } from '@mui/material';
import Input from '../../components/Input/Input';
import { MdEdit } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa6';

interface Field {
  name: string;
  role: string;
  type: string;
}

interface DynamicFieldsProps {
  onFieldsChange: (fields: Field[]) => void;
}

const DynamicFields: React.FC<DynamicFieldsProps> = ({ onFieldsChange }) => {
  const [fields, setFields] = React.useState<Field[]>([
    { name: '', role: '', type: '' },
  ]);
  React.useEffect(() => {
    const savedFields = sessionStorage.getItem('fields');
    if (savedFields) {
      setFields(JSON.parse(savedFields));
    }
  }, []);
  const addField = () => {
    setFields([...fields, { name: '', role: '', type: '' }]);
  };
  React.useEffect(() => {
    sessionStorage.setItem('fields', JSON.stringify(fields));
  }, [fields]);
  const removeField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
    onFieldsChange(newFields);
    sessionStorage.removeItem('fields');
  };

  const handleFieldChange = (
    index: number,
    fieldName: keyof Field,
    value: string,
  ) => {
    // Crie uma cópia dos campos atuais
    const newFields = [...fields];

    // Atualize o campo específico com o novo valor
    newFields[index] = {
      ...newFields[index],
      [fieldName]: value,
    };
    console.log(newFields);
    // Atualize o estado com os novos campos
    setFields(newFields);

    // Chame a função de retorno de chamada do pai aqui
    onFieldsChange(newFields);
  };

  // function handleEdit(): void {
  //   throw new Error('Function not implemented.');
  // }

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
            <AiOutlineMinus style={{ color: '#009CDE' }} />
          </IconButton>
        </div>
      ))}

      <div className="flex justify-center">
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

      {/* {fields.map((field: Field, index: any) => (
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
  // const [isEditing, setIsEditing] = React.useState(true);

  // const handleEdit = () => {
  //   setIsEditing(!isEditing);
  // };
  const conhecimentos = [
    { id: 0, name: 'Selecione uma opção' }, // Adiciona uma opção com valor vazio

    {
      id: 1,
      name: 'Testemunha',
    },
    {
      id: 2,
      name: 'Vítima',
    },
    {
      id: 3,
      name: 'Envolvido',
    },
  ];

  return (
    <div className="flex md:flex-row flex-col gap-3">
      {/* <button type="button" onClick={handleEdit}>
        {!isEditing ? (
          <MdEdit size={20} color="009CDE" />
        ) : (
          <FaCheck size={20} color="009CDE" />
        )}
      </button> */}
      <Input
        style={{ width: isMobile ? '100%' : '300px' }}
        type="text"
        value={field.name ? field.name : field.name}
        className="inputProtocolo text-sm md:text-base"
        placeholder="Nome "
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onFieldChange('name', e.target.value)
        }
        // disabled={!isEditing}
      />
      <Input
        style={{ width: isMobile ? '100%' : '300px' }}
        type="text"
        value={field.role}
        className="inputProtocolo text-sm md:text-base"
        placeholder="Cargo"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onFieldChange('role', e.target.value)
        }
        // disabled={!isEditing}
      />
      <select
        style={{ width: isMobile ? '100%' : '300px' }}
        value={field.type}
        className="inputProtocolo text-sm md:text-base"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onFieldChange('type', e.target.value)
        }
        // disabled={!isEditing}
      >
        {conhecimentos.map((option, optionIndex) => (
          <option key={optionIndex} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DynamicFields;
