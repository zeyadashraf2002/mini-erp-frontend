export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-1 bg-slate-50">
      <div className="flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-[400px] flex flex-col space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
