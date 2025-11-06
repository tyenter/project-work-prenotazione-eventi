import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface SearchBarProps {
  onSearch: (title: string) => void; 
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>(''); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); 
  };

  return (
    <TextField
      label="Cerca"
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={handleChange}
      placeholder="Cerca evento..."
    />
  );
};

export default SearchBar;
