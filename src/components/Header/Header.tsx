import React from 'react';
import { API_BASE, API_URL } from '../../API/apiManager';
import { useAuth } from '../../context/UserContext';
import axios from 'axios';
import { useContextLogo } from '../../context/LogoContext';

const Header = () => {
  // const [logoNovo, setLogoNovo] = React.useState('');
  // const { setLogo, logo } = useAuth();
  const { link } = useContextLogo();

  // React.useEffect(() => {
  //   const options = {
  //     Base: API_BASE,
  //     Accept: 'application/json',
  //   };

  //   axios
  //     .get(API_URL + '/admin/customizations', { headers: options })
  //     .then((response) => {
  //       setLogo(response.data.body[0].LOGO_LINK);
  //       setLogoNovo(response.data.body[0].LOGO_LINK);
  //     });
  // }, [logoNovo]);

  // React.useEffect(() => {
  //   setLogoNovo(logo);
  // }, [logo]);
  return (
    <>
      <header className="w-full flex justify-center mt-2">
        {' '}
        <img src={link} alt="Logo Empresa" width="200px" />
      </header>
    </>
  );
};

export default Header;
