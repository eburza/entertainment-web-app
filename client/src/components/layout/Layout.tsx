import { Outlet } from 'react-router-dom';
import SearchBar from './SearchBar';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div>
      <Sidebar />
      <SearchBar />
      <Outlet />
    </div>
  );
}
