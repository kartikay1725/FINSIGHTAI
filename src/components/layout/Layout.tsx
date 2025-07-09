import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gradient-to-br from-gray-50 via-slate-100 to-white p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
