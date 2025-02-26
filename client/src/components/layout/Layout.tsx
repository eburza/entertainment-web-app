import { Outlet } from 'react-router-dom';
import SearchBar from './SearchBar';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dark w-full">
      <Sidebar />
      <main className="flex-1 px-4 md:pl-32 md:pr-8 pt-8">
        <SearchBar />
        <Outlet />
      </main>
    </div>
  );
}
