import { verify } from 'crypto';
import React, { useEffect, useState } from 'react';
import { useSignUp,useSignIn } from '@clerk/nextjs';
import { PhoneCodeFactor, SignInFirstFactor } from '@clerk/types';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';


const DropdownForm = ({ options,uid }: { options: any, uid:any }) => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedservice, setSelectedservice] = useState('');
  const [verifying, setverifying] = useState(false)
  const [phone, setphone] = useState('')
  const [name,setname] = useState('')
  const [code, setcode] = useState('')
  const [services, setservices] = useState([])
  const [popup, setpopup] = useState(false)
  const router=useRouter();
  const { signOut } = useClerk();

  const closepopup = () => {
    setpopup(false)
  }

  
  const handleChangedoc = (e: any) => {
    setSelectedOption(e.target.value);
    const s = options.filter((d: any) => d.Name === e.target.value).map((d: any) => d.services.service_list).flat();
    console.log(s)
    setservices(s)
  };
  
  const handleChangeservice = (e: any) => {
    setSelectedservice(e.target.value)
  }
  
  const verify = async() => {
    if (!isLoaded && !signIn) return null;

    try {
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: 'phone_code',
        code,
      });
      if (signInAttempt.status === 'complete') {
        await signOut();
        router.push(`/${uid}/chatbot`);
      } else {
        console.error(signInAttempt);
      }
    } catch (err) {
      console.error('Error:', JSON.stringify(err, null, 2));
    }

  }
  
  const handleSubmit = async(e: any) => {
    e.preventDefault();
    if (!isLoaded && !signIn) return null;
    try {
      const { supportedFirstFactors } = await signIn.create({
        identifier: phone,
      });
      const isPhoneCodeFactor = (
        factor: SignInFirstFactor
      ): factor is PhoneCodeFactor => {
        return factor.strategy === 'phone_code';
      };
      const phoneCodeFactor = supportedFirstFactors?.find(isPhoneCodeFactor);

      if (phoneCodeFactor) {
        const { phoneNumberId } = phoneCodeFactor;

        await signIn.prepareFirstFactor({
          strategy: 'phone_code',
          phoneNumberId,
        });
        setverifying(true);
      }
    } catch (err) {
      console.error('Error:', JSON.stringify(err, null, 2));
    }
  };

  if (verifying) {
    return <>
      <div className={`${popup ? `` : ``} flex fixed h-screen w-screen  justify-center items-center`}>
        <div className='flex flex-col justify-center items-center gap-4'>
          <div>This is the otp screen</div>
          <input className='border-2 w-72 border-black p-2 rounded-md' type='text' value={code} onChange={(e) => setcode(e.target.value)} />
          <button onClick={verify} className='bg-green-600 px-4 hover:bg-green-400 p-1 text-white rounded-md'>Verify</button>
          {/* <button onClick={closepopup} className='bg-red-500 text-white p-1'>no</button> */}
        </div>
      </div>
    </>
  }

  return (
    <>

      <form className={`flex ${popup ? `opacity-20` : ``} flex-col items-start p-4 gap-2 md:w-1/2`} onSubmit={handleSubmit}>
      <label className='text-xl' htmlFor="dropdown">Enter Name</label>
        <input className='border-2 w-full md:w-1/2 border-black p-2 rounded-md' type='text' value={name} onChange={(e) => setname(e.target.value)} />
        <label className='text-xl' htmlFor="dropdown">Choose Doctor:</label>
        <select className='border-2 w-full md:w-1/2 border-black p-2 rounded-md' id="dropdown" value={selectedOption} onChange={handleChangedoc}>
          <option className='border-1' value="" disabled>Select an option</option>
          {options.map((option: any, index: any) => (
            <option className='' key={index} value={option.Name}>
              {option.Name}
            </option>
          ))}
        </select>
        <label className='text-xl' htmlFor="dropdown">Choose Service:</label>
        <select className='border-2 w-full md:w-1/2 border-black p-2 rounded-md' id="dropdown" value={selectedservice} onChange={handleChangeservice}>
          {/* <option className='border-1' value="" disabled>Select an option</option> */}
          {services.map((service: any, index: any) => (
            <option className='' key={index} value={service.service_name}>
              {service.service_name}
            </option>
          ))}
        </select>
        <label className='text-xl' htmlFor="dropdown">Enter Phone number</label>
        <input className='border-2 w-full md:w-1/2 border-black p-2 rounded-md' type='text' value={phone} onChange={(e) => setphone(e.target.value)} />
        <button className='bg-green-600 px-4 hover:bg-green-400 p-1 text-white rounded-md' type="submit">Submit</button>
      </form>
    </>
  );
};

export default DropdownForm;
