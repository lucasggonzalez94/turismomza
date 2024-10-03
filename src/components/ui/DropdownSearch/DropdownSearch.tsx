import { Input } from '@nextui-org/react';
import { IoSearch } from 'react-icons/io5';
import DropdownButton from '../DropdownButton/DropdownButton';

const DropdownSearch = () => {
  return (
    <DropdownButton icon={<IoSearch size={25} color="#fff" />}>
      <div className="flex items-center bg-gray-800/60 rounded-md p-4 shadow-md">
        <Input
          isClearable
          radius="md"
          classNames={{
            input: ['text-black/90', 'placeholder:text-default-700/50'],
            inputWrapper: ['shadow-xl', 'bg-default-200'],
          }}
          placeholder="Buscar..."
          startContent={
            <IoSearch className="text-gray-700 pointer-events-none flex-shrink-0" />
          }
        />
      </div>
    </DropdownButton>
  );
};

export default DropdownSearch;
