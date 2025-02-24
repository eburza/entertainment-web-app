import { Outlet } from 'react-router-dom';
import SearchBar from './SearchBar';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-dark w-full">
      <Sidebar />
      <main className="flex-1 pl-32 pr-8 pt-8">
        <SearchBar />
        <Outlet />
      </main>
    </div>
  );
}
