/* eslint-disable no-var */
import DenunciasAdmin from './DenunciasAdmin';
import DenunciasCompliance from './DenunciasCompliance';
import DenunciasEthical from './DenunciasEthical';

export default function Denuncias() {
  const getToken = sessionStorage.getItem('tokeRBAC');

  if (getToken !== null) {
    var token = JSON.parse(atob(getToken.split('.')[1]));
  }
  const isAdmin = token.user_access;

  // console.log(isAdmin);

  const BASE = 'USJ';
  console.log(BASE);

  return (
    <>
      {isAdmin === 'ADMIN' ? (
        <DenunciasAdmin />
      ) : isAdmin === 'ETHICAL' ? (
        <DenunciasEthical />
      ) : isAdmin === 'COMPLIANCE' ? (
        <DenunciasCompliance />
      ) : (
        <DenunciasAdmin />
      )}
    </>
  );
}
