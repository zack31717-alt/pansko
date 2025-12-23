
import React, { useState, useEffect } from 'react';
import { 
  Settings, Wind, RotateCw, Box, Layers, 
  ArrowRight, ShieldCheck,
  Activity, Phone, Mail, CheckCircle2,
  ArrowUp, LineChart,
  Target, HardHat, DollarSign, Puzzle,
  Printer, Hash, MapPin, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- 公司標誌 (純 SVG 生成) ---
const Logo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4L36 34H4L20 4Z" fill="#2563EB" fillOpacity="0.1" stroke="#2563EB" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M10 18C13 16 17 20 20 18C23 16 27 20 30 18" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 24C11 22 15 26 18 24C21 22 25 26 28 24" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 30C9 28 13 32 16 30C19 28 23 32 26 30" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// --- 工業設備 3D 風格 SVG 組件集 ---
const MachineryGraphics = {
  BulkBagStation: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="25" y="10" width="50" height="40" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      <path d="M25 50 L10 90 M75 50 L90 90 M25 20 L10 10 M75 20 L90 10" stroke="#64748b" strokeWidth="2" />
      <path d="M40 50 L40 70 L60 70 L60 50 Z" fill="#cbd5e1" stroke="#94a3b8" />
      <circle cx="50" cy="80" r="5" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" />
    </svg>
  ),
  Cyclone: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path d="M30 20 Q50 15 70 20 L70 50 Q50 55 30 50 Z" fill="#e2e8f0" stroke="#94a3b8" />
      <path d="M30 50 L50 90 L70 50" fill="#cbd5e1" stroke="#94a3b8" />
      <path d="M45 10 L55 10 L60 20 L40 20 Z" fill="#94a3b8" />
      <path d="M40 30 Q50 25 60 30" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  ScrewConveyor: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="10" y="45" width="70" height="10" rx="2" fill="#e2e8f0" stroke="#94a3b8" />
      <rect x="80" y="40" width="10" height="20" rx="1" fill="#475569" />
      <path d="M20 45 Q25 40 30 45 Q35 50 40 45 Q45 40 50 45" fill="none" stroke="#3b82f6" strokeWidth="1" />
    </svg>
  ),
  MeteringTank: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="30" y="20" width="40" height="40" rx="4" fill="#f1f5f9" stroke="#94a3b8" />
      <path d="M30 60 L50 85 L70 60" fill="#e2e8f0" stroke="#94a3b8" />
      <rect x="35" y="30" width="30" height="2" fill="#3b82f6" opacity="0.3" />
    </svg>
  ),
  Venturi: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path d="M10 40 L30 40 L45 48 L55 48 L70 40 L90 40 L90 60 L70 60 L55 52 L45 52 L30 60 L10 60 Z" fill="#e2e8f0" stroke="#94a3b8" />
      <path d="M15 50 L85 50" stroke="#3b82f6" strokeWidth="2" opacity="0.2" strokeDasharray="4,2" />
    </svg>
  ),
  StructuralPlatform: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="10" y="60" width="80" height="5" fill="#94a3b8" />
      <path d="M20 65 L20 95 M40 65 L40 95 M60 65 L60 95 M80 65 L80 95" stroke="#64748b" strokeWidth="2" />
    </svg>
  )
};

// --- 產品資料集 ---
const products = [
  {
    id: "infeed",
    cat: "1. 進料 (Infeed/Unloading)",
    title: "太空包投料站 (Bulk Bag Unloading Station)",
    subtitle: "產線自動化的起點，兼顧效率與環境安全",
    Graphic: MachineryGraphics.BulkBagStation,
    advantages: [
      "提升效率：原料可快速、批量投入，縮短換料時間。",
      "節省人力：單人即可操作，降低人工搬運與高處作業風險。",
      "環境潔淨：結合集塵器與密封結構，有效防止粉塵外洩。",
      "高度客製：可依物料特性選配拆袋刀、振動器、除鐵器等功能。"
    ]
  },
  {
    id: "conveying",
    cat: "2. 輸送 (Conveying)",
    title: "DNU/SNU 輸送裝置",
    subtitle: "簡化結構，革新輸送效能",
    Graphic: MachineryGraphics.Venturi,
    advantages: [
      "無背壓下料：獨特設計可產生微負壓，確保粉粒順利下料。",
      "革新設計：可取代傳統的 AirLock 迴轉閥，提升效能。",
      "極簡可靠：純機械結構簡單，有效節省設備費用。",
      "關鍵規格：DNU 支持至 2.5 Bar，SNU 輸送量可達 4T~6T/HR。"
    ]
  },
  {
    id: "mixer",
    cat: "2. 輸送 (Conveying)",
    title: "螺旋輸送機含攪拌機",
    subtitle: "輸送與攪拌同步完成，實現高效整合",
    Graphic: MachineryGraphics.ScrewConveyor,
    advantages: [
      "功能整合：集物料輸送與攪拌於一體，有效防止物料架橋。",
      "高效緊湊：體積小、效率高，節省廠房空間。",
      "串聯自動化：可連結自動計量、配料系統，實現智慧製造。"
    ]
  },
  {
    id: "metering",
    cat: "3. 製程 (Processing)",
    title: "計量桶 (Metering Tank)",
    subtitle: "千分之一的精準，是您產品質量的基石",
    Graphic: MachineryGraphics.MeteringTank,
    advantages: [
      "超高精度：桶槽計量精度可達 1/1000。",
      "規格齊全：提供 50L 至 1000L 多種標準規格。",
      "整合設計：可搭配螺旋輸送機、攪拌器、液位開關。"
    ]
  },
  {
    id: "cyclone",
    cat: "3. 製程 (Processing)",
    title: "旋風分離器 (Cyclone Separator)",
    subtitle: "高效氣固分離，實現物料回收與初步過濾",
    Graphic: MachineryGraphics.Cyclone,
    advantages: [
      "高效分離：去除 5~10 微米以上的粉塵，作為輸送末端氣粉分離。",
      "結構簡單：無活動部件，安裝維護極為方便，使用壽命長。",
      "耐用可靠：可耐高溫高壓，適合處理高溫煙氣。"
    ]
  },
  {
    id: "platform",
    cat: "5. 整合 (Integration)",
    title: "客製化設備鋼構架台",
    subtitle: "穩固的系統基石，量身打造的整合工藝",
    Graphic: MachineryGraphics.StructuralPlatform,
    advantages: [
      "高度客製：根據客戶設備需求、廠房空間與承重規格設計。",
      "堅固耐用：採用高強度鋼材製造，確保結構穩定與安全性。",
      "安裝快速：模組化設計，縮短現場安裝時間。"
    ]
  }
];

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-sky-50 font-sans text-slate-800 antialiased">
      {/* 科技感背景 */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-200/40 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-200/40 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-grid-slate-200/[0.1] bg-[size:50px_50px]"></div>
      </div>

      {/* 導覽列 */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md py-3 border-b border-blue-100 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <Logo className="w-10 h-10" />
            <div>
              <div className="font-black text-xl leading-none tracking-tight text-blue-900">錕興機械</div>
              <div className="text-[9px] opacity-60 font-bold tracking-[0.2em] uppercase text-blue-700">Kun Xing Machinery</div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
             <button onClick={() => scrollTo('flow')} className="hover:text-blue-600 transition-colors">設備流程</button>
             <button onClick={() => scrollTo('products')} className="hover:text-blue-600 transition-colors">產品系列</button>
             <button onClick={() => scrollTo('contact')} className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all shadow-md text-xs">聯絡專家</button>
          </div>
        </div>
      </nav>

      {/* Hero 區塊 */}
      <header className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-600/5 border border-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] mb-12 rounded-full">
              Smart Conveying & System Integration
            </div>
            <h1 className="text-6xl lg:text-9xl font-black mb-10 leading-tight tracking-tighter text-blue-950">
              智慧輸送<br/><span className="text-blue-600">系統整合</span>
            </h1>
            <p className="text-2xl text-slate-600 mb-12 font-medium max-w-3xl mx-auto italic">
              從進料到製程的完整粉體物料處理方案
            </p>
            <button onClick={() => scrollTo('flow')} className="px-12 py-6 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-600/20 text-lg flex items-center gap-4 transition-all mx-auto">
              查看設備流程 <ArrowRight size={22} />
            </button>
          </motion.div>
        </div>
      </header>

      {/* 設備流程視覺化區塊 */}
      <section id="flow" className="py-32 scroll-mt-24 relative z-10">
        <div className="container mx-auto px-6 text-center mb-24">
          <div className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-6">Equipment Flow</div>
          <h2 className="text-5xl font-black text-blue-950 mb-8 tracking-tighter">智慧生產流程圖</h2>
          <div className="h-1.5 w-32 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="container mx-auto px-6 overflow-x-auto lg:overflow-visible">
          <div className="flex flex-col lg:flex-row items-center justify-between min-w-[1000px] lg:min-w-0 gap-8 relative">
            {/* 連接線 (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-blue-400 to-blue-100 -translate-y-12 z-0 opacity-30"></div>

            {[
              { title: "太空包進料", icon: MachineryGraphics.BulkBagStation, step: "01" },
              { title: "氣動輸送", icon: MachineryGraphics.Venturi, step: "02" },
              { title: "攪拌混合", icon: MachineryGraphics.ScrewConveyor, step: "03" },
              { title: "精確計量", icon: MachineryGraphics.MeteringTank, step: "04" },
              { title: "旋風分離", icon: MachineryGraphics.Cyclone, step: "05" },
            ].map((node, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative z-10 flex flex-col items-center group"
              >
                <div className="w-40 h-40 bg-white rounded-3xl border border-blue-100 shadow-sm group-hover:shadow-xl transition-all p-8 mb-6 flex items-center justify-center group-hover:-translate-y-2">
                   <node.icon />
                </div>
                <div className="text-blue-600 font-black text-xs mb-2 opacity-50 tracking-widest uppercase">Step {node.step}</div>
                <h3 className="text-xl font-black text-blue-900 mb-4">{node.title}</h3>
                {i < 4 && (
                  <div className="lg:hidden">
                    <ChevronRight className="text-blue-300 mb-6" size={32} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-24 max-w-4xl mx-auto p-10 bg-white/60 backdrop-blur-md rounded-[3rem] border border-blue-100 text-center">
           <p className="text-slate-600 font-medium leading-relaxed italic">
             「錕興機械的流程整合系統，確保從原料進入到最終分離的每一階段皆能精確控制，<br className="hidden md:block"/>不僅提升 30% 以上的生產效率，更達到近乎零粉塵的環保作業環境。」
           </p>
        </div>
      </section>

      {/* 產品展示區 */}
      <section id="products" className="py-40 bg-white/40 backdrop-blur-sm scroll-mt-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-20 max-w-6xl mx-auto">
            {products.map((p) => (
              <motion.div 
                key={p.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-10 lg:p-16 rounded-[4rem] border border-blue-50 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
              >
                <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-blue-100">
                      {p.cat}
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-black text-blue-950 mb-6 tracking-tight">{p.title}</h3>
                    <p className="text-xl text-blue-600 font-bold mb-12 italic opacity-80">{p.subtitle}</p>
                    
                    <div className="space-y-6">
                       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-4">
                         <span className="w-8 h-[1px] bg-blue-200"></span> 核心優勢 Core Advantages
                       </h4>
                       <ul className="grid grid-cols-1 gap-4">
                         {p.advantages.map((adv, i) => (
                           <li key={i} className="flex gap-4 text-slate-600 leading-relaxed font-semibold items-start text-lg">
                             <CheckCircle2 size={24} className="text-blue-500 shrink-0 mt-0.5" /> {adv}
                           </li>
                         ))}
                       </ul>
                    </div>
                  </div>

                  {/* 程式碼生成之設備圖示區 */}
                  <div className="lg:w-[35%] w-full aspect-square bg-slate-50 rounded-[3rem] border border-blue-50 flex items-center justify-center p-12 group-hover:bg-white transition-colors">
                     <p.Graphic />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 聯絡資訊區塊 */}
      <section id="contact" className="py-40 bg-white scroll-mt-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto bg-blue-950 rounded-[4rem] p-16 md:p-24 flex flex-col lg:flex-row gap-20 items-center shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>
             
             <div className="flex-1 relative z-10 text-center lg:text-left">
                <div className="text-blue-400 font-black text-[10px] uppercase tracking-[0.5em] mb-12">Contact Us</div>
                <h2 className="text-6xl lg:text-7xl font-black mb-16 italic text-white leading-tight tracking-tighter uppercase">啟動您的<br/><span className="text-blue-400">產線升級</span></h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/20">
                        <Phone size={24} />
                      </div>
                      <div className="text-center lg:text-left">
                        <div className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">聯絡電話 (TEL)</div>
                        <div className="font-black text-2xl text-white">03-9908036</div>
                      </div>
                   </div>

                   <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/20">
                        <Printer size={24} />
                      </div>
                      <div className="text-center lg:text-left">
                        <div className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">傳真號碼 (FAX)</div>
                        <div className="font-black text-2xl text-white">03-9905853</div>
                      </div>
                   </div>

                   <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/20">
                        <Hash size={24} />
                      </div>
                      <div className="text-center lg:text-left">
                        <div className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">統一編號 (Tax ID)</div>
                        <div className="font-black text-2xl text-white">29113377</div>
                      </div>
                   </div>

                   <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/20">
                        <Mail size={24} />
                      </div>
                      <div className="text-center lg:text-left">
                        <div className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">電子郵件</div>
                        <div className="font-black text-xl text-blue-200 italic">zack31717@gmail.com</div>
                      </div>
                   </div>
                </div>

                <div className="mt-16 pt-10 border-t border-white/10 flex flex-col lg:flex-row items-center lg:items-start gap-6">
                   <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/20 shrink-0">
                     <MapPin size={24} />
                   </div>
                   <div className="text-center lg:text-left text-white/90">
                      <div className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">公司地址 (Address)</div>
                      <div className="font-black text-2xl tracking-tighter italic">宜蘭縣五結鄉利工一路二段116巷15號</div>
                   </div>
                </div>
             </div>

             <div className="lg:w-[30%] w-full relative z-10">
                <div className="bg-white/5 p-16 rounded-[4rem] text-center border border-white/10 backdrop-blur-sm">
                   <Logo className="w-24 h-24 mx-auto mb-8" />
                   <h3 className="text-white font-black text-3xl mb-4 tracking-tight">錕興機械</h3>
                   <p className="text-blue-300 text-xs font-bold uppercase tracking-widest opacity-80">Kun Xing Machinery</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      <footer className="py-16 border-t border-blue-100 text-center bg-white">
         <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
               <Logo className="w-8 h-8" />
               <div className="text-left">
                  <div className="font-black text-sm text-blue-900 leading-none">錕興機械</div>
                  <div className="text-[7px] text-blue-400 font-bold uppercase tracking-widest">Kun Xing Machinery</div>
               </div>
            </div>
            <div className="text-[9px] text-slate-400 font-black uppercase tracking-[0.6em]">
              © 2024 KUN XING MACHINERY CO., LTD. All rights reserved.
            </div>
         </div>
      </footer>

      {/* 浮動置頂按鈕 */}
      <div className="fixed bottom-10 right-10 z-[60]">
         <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-xl flex items-center justify-center hover:bg-blue-700 transition-all active:scale-90">
            <ArrowUp size={28} />
         </button>
      </div>
    </div>
  );
};

export default App;
