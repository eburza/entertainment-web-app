import { Outlet } from 'react-router-dom';
import SearchBar from './SearchBar';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col gap-4">
        <SearchBar />
        <Outlet />
      </div>
    </div>
  );
}
