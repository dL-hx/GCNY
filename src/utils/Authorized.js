import RenderAuthorize from '@/components/Authorized';
import { getAuthority, setAuthority } from './authority';

let Authorized = RenderAuthorize(getAuthority()); // eslint-disable-line

// Reload the rights component
const reloadAuthorized = () => {
  Authorized = RenderAuthorize(getAuthority());
};


const setAuthorized = setAuthority;

export { reloadAuthorized, setAuthorized };

export default Authorized;
