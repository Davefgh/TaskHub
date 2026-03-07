'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  sales: number;
  image: string;
  category: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
          <div className="flex items-center gap-8 text-gray-700">
            <h1 className="text-2xl font-bold text-shopee-orange">FES Marketplace</h1>
            <div className="hidden md:flex items-center bg-gray-100 rounded-md px-4 py-2 w-96">
              <input 
                type="text" 
                placeholder="Search for fire extinguishers..." 
                className="bg-transparent outline-none w-full text-sm text-gray-800"
              />
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <nav className="flex items-center gap-6 text-gray-600">
            <button className="text-sm font-medium hover:text-shopee-orange transition">Login</button>
            <button className="bg-shopee-orange text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-[#d73211] transition">
              Sign Up
            </button>
            <div className="relative cursor-pointer text-gray-500 hover:text-shopee-orange transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-shopee-orange text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Banner Section */}
        <section className="bg-gradient-to-r from-shopee-orange to-[#ff6600] rounded-xl p-8 mb-12 text-white overflow-hidden relative min-h-[300px] flex items-center">
          <div className="z-10 max-w-lg">
            <h2 className="text-4xl font-extrabold mb-4 shadow-lg text-white">Safety First, Always.</h2>
            <p className="text-lg opacity-100 mb-6 font-semibold text-white">Get the best deals on fire extinguishers for your home and office. Licensed and certified protection.</p>
            <button className="bg-white text-shopee-orange px-10 py-3 rounded-md font-black shadow-xl hover:bg-gray-100 transition transform hover:scale-105 active:scale-95 text-lg">
              SHOP NOW
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 flex justify-center items-center opacity-30 pointer-events-none">
             <div className="w-80 h-80 bg-white rounded-full blur-3xl"></div>
          </div>
        </section>

        {/* Product Grid */}
        <section>
          <div className="flex items-center justify-between mb-8 pb-2 border-b-2 border-shopee-orange w-fit">
            <h3 className="text-xl font-bold uppercase tracking-wider text-shopee-dark">Flash Sale</h3>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} className="bg-white rounded-sm shadow-sm p-4 animate-pulse">
                  <div className="bg-gray-200 aspect-square w-full mb-4"></div>
                  <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-sm shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col border border-transparent hover:border-shopee-orange">
                  <div className="relative aspect-square overflow-hidden bg-white border-b">
                    <img 
                      src={`/products.png`} 
                      alt={product.name}
                      className="object-contain w-full h-full p-4 transition transform group-hover:scale-110"
                    />
                    <div className="absolute top-0 right-0 bg-yellow-400 text-shopee-orange text-[10px] font-bold px-1.5 py-0.5">
                      10% OFF
                    </div>
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <h4 className="text-sm line-clamp-2 mb-2 text-shopee-dark group-hover:text-shopee-orange transition min-h-[40px] leading-tight font-medium">{product.name}</h4>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-shopee-orange font-bold text-lg">${product.price.toFixed(2)}</span>
                        <span className="text-[10px] text-gray-500">{product.sales}+ sold</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex text-yellow-500 text-[10px]">
                           {'★'.repeat(Math.floor(product.rating))}
                        </div>
                        <span className="text-[10px] text-gray-500">{product.rating}</span>
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
          <p className="text-sm text-gray-500 mb-4">&copy; 2026 FES Marketplace. Official Fire Extinguisher Supplier.</p>
          <div className="flex justify-center gap-8 text-xs text-gray-400 font-medium">
            <span className="cursor-pointer hover:text-shopee-orange transition">Terms of Service</span>
            <span className="cursor-pointer hover:text-shopee-orange transition">Privacy Policy</span>
            <span className="cursor-pointer hover:text-shopee-orange transition">Contact Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
