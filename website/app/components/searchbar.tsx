import { FaSearch } from 'react-icons/fa';

// beatiful clean searchbar component taking in appropriate properties with tailwind css

interface SearchbarProps {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  value: string;
}
const Searchbar: React.FC<SearchbarProps> = ({
  placeholder,
  onChange,
  onSearch,
  value,
}) => {
  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form
      className="flex items-center gap-4 rounded relative w-full"
      onSubmit={submitForm}
    >
      <input
        type="text"
        name="search"
        id="search"
        className="focus:ring-indigo-500  shadow-sm focus:border-indigo-500 block w-full py-2 pl-4 pr-12 sm:text-sm border-transparent rounded"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
      <button
        className="flex items-center bg-blue-500 p-2 w-[15%] justify-center rounded text-sm cursor-pointer text-white hover:opacity-75"
        type="submit"
      >
        Go
      </button>
    </form>
  );
};

export default Searchbar;
