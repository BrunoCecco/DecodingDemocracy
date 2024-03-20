import React, { useEffect, useState } from 'react';
import { BsCaretDownFill, BsCaretUpFill } from 'react-icons/bs';
import { usePathname } from 'next/navigation';

interface DropdownProps {
  options: IOption[];
  initialOption: IOption | null;
  onOptionClick: (option: string) => void;
}

interface IOption {
  label: string;
  value?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  initialOption,
  onOptionClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<IOption | null>(
    initialOption
  );

  useEffect(() => {
    setSelectedOption(initialOption);
  }, [initialOption]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const clickOption = (option: IOption) => {
    onOptionClick(option.value);
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative flex flex-col items-end w-[300px] text-center z-50">
      <button
        onClick={toggleDropdown}
        className="bg-white  py-2 px-4 flex items-center justify-center gap-4 w-full rounded focus:outline-none focus:ring focus:border-blue-300"
      >
        {selectedOption?.label || ''}
        {isOpen ? <BsCaretUpFill /> : <BsCaretDownFill />}
      </button>

      {isOpen && (
        <div className="absolute top-10 mt-2 max-h-[300px] overflow-scroll w-full bg-white border border-gray-300 shadow-lg rounded">
          {options.map((option, i) => (
            <div
              key={option.label}
              onClick={() => clickOption(option)}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100 w-full"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
