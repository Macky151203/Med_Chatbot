import React, { useState } from 'react';

const DropdownForm = ({ options }:{options:any}) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedservice, setSelectedservice] = useState('');
  const [services,setservices]=useState([])
  const [popup,setpopup]=useState(false)

  const closepopup=()=>{
    setpopup(false)
  }

  const handleChangedoc = (e:any) => {
    setSelectedOption(e.target.value);
    const s=options.filter((d:any)=>d.Name===e.target.value).map((d:any)=>d.services.service_list).flat();
    console.log(s)
    setservices(s)
  };

  const handleChangeservice=(e:any)=>{
    setSelectedservice(e.target.value)
  }

  const handleSubmit = (e:any) => {
    e.preventDefault();
    setpopup(true)
    //alert(`You selected: ${selectedOption}`);
  };

  return (
    <>
    <div className={`${popup?`flex`:`hidden`} fixed h-screen w-screen  justify-center items-center`}>
      <div>
      This is the otp screen
      <button onClick={closepopup} className='bg-red-500 text-white p-1'>no</button>
      </div>
    </div>
    <form className={`flex ${popup?`opacity-20`:``} flex-col items-start p-4 gap-2 md:w-1/2`} onSubmit={handleSubmit}>
      <label className='text-xl' htmlFor="dropdown">Choose Doctor:</label>
      <select className='border-2 w-full md:w-1/2 border-black py-2' id="dropdown" value={selectedOption} onChange={handleChangedoc}>
        <option className='border-1' value="" disabled>Select an option</option>
        {options.map((option:any, index:any) => (
          <option className='' key={index} value={option.Name}>
            {option.Name}
          </option>
        ))}
      </select>
      <label className='text-xl' htmlFor="dropdown">Choose Service:</label>
      <select className='border-2 w-full md:w-1/2 border-black py-2' id="dropdown" value={selectedservice} onChange={handleChangeservice}>
        {/* <option className='border-1' value="" disabled>Select an option</option> */}
        {services.map((service:any, index:any) => (
          <option className='' key={index} value={service.service_name}>
            {service.service_name}
          </option>
        ))}
      </select>
      <button className='bg-green-600 px-4 hover:bg-green-400 p-1 text-white rounded-md' type="submit">Submit</button>
    </form>
    </>
  );
};

export default DropdownForm;
