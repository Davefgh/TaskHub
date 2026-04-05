'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  sales: number;
  image: string;
  category: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mocking as logged in
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-shopee-light font-sans text-shopee-dark">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8 text-shopee-dark">
            <h1 className="text-2xl font-bold text-[#e53935]">ALARMA</h1>
            <div className="hidden md:flex items-center bg-gray-100 rounded-md px-4 py-2 w-96">
              <input 
                type="text" 
                placeholder="Search for fire extinguishers..." 
                className="bg-transparent outline-none w-full text-sm text-gray-800 placeholder-gray-500"
              />
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <nav className="flex items-center gap-6 text-shopee-dark">
            {!isLoggedIn ? (
              <>
                <Link href="/login" className="text-sm font-semibold hover:text-[#e53935] transition-colors">Login</Link>
                <Link href="/register" className="bg-[#e53935] text-white px-5 py-2 rounded-sm text-sm font-bold hover:bg-[#b71c1c] transition-all shadow-sm">
                   Sign Up
                </Link>
              </>
            ) : (
              <>
                <div className="cursor-pointer text-gray-700 hover:text-[#e53935] transition-colors" title="Profile">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="cursor-pointer text-gray-700 hover:text-[#e53935] transition-colors flex items-center"
                    title="Settings"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-[100]">
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#e53935] transition-colors">
                         Edit Profile
                      </button>
                      <button 
                         onClick={() => {
                           setIsLoggedIn(false);
                           setDropdownOpen(false);
                           router.push('/register');
                         }}
                         className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#e53935] transition-colors border-t border-gray-50"
                      >
                         Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
             <div className="relative cursor-pointer text-gray-700 hover:text-[#e53935] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-[#e53935] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Banner Section */}
        <section className="bg-gradient-to-r from-[#e53935] to-[#ff1744] rounded-sm p-10 mb-12 text-white overflow-hidden relative min-h-[320px] shadow-lg flex items-center">
          <div className="z-10 max-w-lg">
            <h2 className="text-5xl font-extrabold mb-4 text-white tracking-tight">Fire Extinguisher Corp</h2>
            <p className="text-xl opacity-100 mb-8 font-medium text-white max-md leading-relaxed">Get the best deals on fire extinguishers for your home and office. Licensed and certified protection.</p>
            <button className="bg-white px-10 py-4 rounded-sm font-black shadow-2xl hover:bg-gray-50 transition-all transform hover:scale-105 active:scale-95 text-[#e53935] uppercase tracking-widest border-2 border-white">
              SHOP NOW
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 flex justify-center items-center opacity-40 pointer-events-none">
             <div className="w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
        </section>

        {/* Product Grid */}
        <section>
          <div className="flex items-center justify-between mb-8 pb-3 border-b-2 border-[#e53935] w-fit">
            <h3 className="text-xl font-bold uppercase tracking-widest text-[#e53935]">Flash Sale</h3>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} className="bg-white rounded-sm shadow-sm p-4 animate-pulse">
                  <div className="bg-gray-100 aspect-square w-full mb-4"></div>
                  <div className="h-4 bg-gray-100 w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-100 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product, index) => (
                <div key={product.id} className="bg-white rounded-sm shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col border border-transparent hover:border-[#e53935] relative">
                  <div className="relative aspect-square overflow-hidden bg-white border-b p-2">
                    <img 
                      src={`/products.png`} 
                      alt={product.name}
                      className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-0 right-0 bg-yellow-400 text-[#e53935] text-[10px] font-bold px-2 py-0.5 shadow-sm">
                      10% OFF
                    </div>
                    {index === 0 && (
                      <div className="absolute top-0 left-0 bg-[#e53935] text-white text-[10px] font-bold px-2 py-0.5">
                        Preferred
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="text-sm line-clamp-2 mb-3 text-shopee-dark group-hover:text-[#e53935] transition-colors min-h-[40px] leading-snug font-medium">{product.name}</h4>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-[#e53935] font-bold text-xl">${product.price.toFixed(2)}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{product.sales}+ sold</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <div className="flex text-yellow-500 text-[10px]">
                           {'★'.repeat(Math.floor(product.rating))}
                        </div>
                        <span className="text-[10px] text-gray-500 font-semibold">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>


      <footer className="mt-12 bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 mb-4">&copy; 2026 ALARMA. Official Fire Extinguisher Supplier.</p>
          <div className="flex justify-center gap-8 text-xs text-gray-400 font-medium">
            <span className="cursor-pointer hover:text-shopee-red transition">Terms of Service</span>
            <span className="cursor-pointer hover:text-shopee-red transition">Privacy Policy</span>
            <span className="cursor-pointer hover:text-shopee-red transition">Contact Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
