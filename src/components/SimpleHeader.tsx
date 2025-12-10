"use client";

export default function SimpleHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-red-500 text-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl">SIMPLE HEADER</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/product" className="hover:text-gray-200">Product</a>
            <a href="/pricing" className="hover:text-gray-200">Pricing</a>
            <a href="/mobile" className="hover:text-gray-200">Mobile</a>
            <a href="/api-docs" className="hover:text-gray-200">API</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <a href="/auth/signin">
              <button className="bg-white text-red-500 px-4 py-2 rounded">
                Sign In
              </button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}