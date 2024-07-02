import React, { useState } from 'react';

const DropdownForm = ({ options }:{options:any}) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (e:any) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    alert(`You selected: ${selectedOption}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="dropdown">Choose an option:</label>
      <select id="dropdown" value={selectedOption} onChange={handleChange}>
        <option value="" disabled>Select an option</option>
        {options.map((option:any, index:any) => (
          <option key={index} value={option.Name}>
            {option.Name}
          </option>
        ))}
      </select>
      <button type="submit">Submit</button>
    </form>
  );
};

export default DropdownForm;
