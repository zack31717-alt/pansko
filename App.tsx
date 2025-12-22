
import React, { useState, useEffect } from 'react';
import { 
  Settings, Wind, Zap, RotateCw, Filter, Box, Trash2, Gauge, Layers, 
  X, ArrowRight, ShieldCheck,
  Activity, Phone, Mail, MapPin, CheckCircle2,
  Cpu, ArrowUp, Award, Briefcase, Maximize2, ImageIcon, FileDown, LineChart,
  FileText, MessageSquare, AlertCircle, ImageOff, ClipboardList, Target, HardHat, DollarSign, Puzzle,
  Search, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import pptxgen from "pptxgenjs";

// --- 安全圖片元件 ---
const SafeImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  return (
    <div className={`relative overflow-hidden bg-white rounded-[2rem] border border-slate-200 shadow-inner ${className}`}>
      {status === 'loading' && (
        <div className="absolute inset-0 bg-slate-50 animate-pulse flex flex-col items-center justify-center gap-2">
          <ImageIcon className="text-blue-200" size={40} />
          <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Loading Media</span>
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
          <ImageOff className="text-slate-200 mb-2" size={32} />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter leading-tight">{alt}<br/>IMAGE NOT FOUND</span>
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`w-full h-full object-contain p-4 transition-all duration-1000 ${status === 'loaded' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      />
    </div>
  );
};

// --- PDF 產品資料集 (根據 14 頁 PDF 內容) ---
const products = [
  {
    id: "infeed",
    cat: "1. 進料 (Infeed/Unloading)",
    title: "太空包投料站 (Bulk Bag Unloading Station)",
    subtitle: "產線自動化的起點，兼顧效率與環境安全",
    image: "input_file_4.png",
    advantages: [
      "提升效率：原料可快速、批量投入，縮短換料時間。",
      "節省人力：單人即可操作，降低人工搬運與高處作業風險。",
      "環境潔淨：結合集塵器與密封結構，有效防止粉塵外洩。",
      "高度客製：可依物料特性選配拆袋刀、振動器、除鐵器等功能。",
      "智慧整合：可無縫連結後段自動計量、配料及輸送系統。"
    ],
    scenarios: ["食品工業：麵粉、奶粉", "化學產業：粉體、樹脂", "製藥行業：藥品原料", "塑膠工業：塑膠粒", "建材產業：水泥、石灰"]
  },
  {
    id: "conveying",
    cat: "2. 輸送 (Conveying)",
    title: "DNU/SNU 輸送裝置",
    subtitle: "簡化結構，革新輸送效能",
    image: "input_file_5.png",
    advantages: [
      "無背壓下料：獨特設計可產生微負壓，確保粉粒順利下料，不受輸送背壓影響。",
      "革新設計：可取代傳統的 AirLock 迴轉閥，提升效能與可靠性。",
      "極簡可靠：純機械結構簡單，有效節省設備費用，並降低故障率。",
      "密封防塵：減少氣體及粉塵外洩，維持產線潔淨。",
      "關鍵規格：DNU 兩段式可支持 2.5 Bar，SNU 輸送量可達 4T~6T/HR。"
    ]
  },
  {
    id: "rcu",
    cat: "2. 輸送 (Conveying)",
    title: "智慧型 RCU 氣體節能控制輸送裝置",
    subtitle: "精準控制，智慧節能，優化您的輸送成本",
    image: "input_file_6.png",
    advantages: [
      "顯著節能：增配洩漏氣體回收裝置，節省氣體消耗達 5~30%。",
      "精準控制：可精確控制輸送壓力及流量，確保輸送穩定性。",
      "模式可選：DILUTE (稀相) 及 DENSE (濃相) 輸送模式可選。",
      "系統簡化：不須裝設額外排氣管及集塵機，簡化配管費用。"
    ],
    table: [
      { model: "RCU2550", inlet: "1\"", outlet: "2\"" },
      { model: "RCU4080", inlet: "1-1/2\"", outlet: "3\"" },
      { model: "RCU50100", inlet: "2\"", outlet: "4\"" },
      { model: "RCU65125", inlet: "2-1/2\"", outlet: "5\"" },
      { model: "RCU80150", inlet: "3\"", outlet: "6\"" },
      { model: "RCU100200", inlet: "4\"", outlet: "8\"" }
    ]
  },
  {
    id: "mixer",
    cat: "2. 輸送 (Conveying)",
    title: "螺旋輸送機含攪拌機",
    subtitle: "輸送與攪拌同步完成，實現高效整合",
    image: "input_file_7.png",
    advantages: [
      "功能整合：集物料輸送與攪拌於一體，有效防止物料架橋。",
      "高效緊湊：體積小、效率高，節省廠房空間。",
      "完全客製：可依據客戶需求客製化長度與容量。",
      "串聯自動化：可連結自動計量、配料系統，實現智慧製造。"
    ],
    scenarios: ["食品製造：粉體計量輸送", "化學工廠：顆粒與液體混合", "塑膠產業：塑膠粒輸送", "營建材料：砂石、水泥混合"]
  },
  {
    id: "metering",
    cat: "3. 製程 (Processing)",
    title: "計量桶 (Metering Tank)",
    subtitle: "千分之一的精準，是您產品質量的基石",
    image: "input_file_8.png",
    advantages: [
      "超高精度：桶槽計量精度可達 1/1000。",
      "規格齊全：提供 50L 至 1000L 多種標準規格。",
      "整合設計：可搭配螺旋輸送機、攪拌器、液位開關。",
      "客製彈性：可根據需求客製進出料口、液位開關位置。"
    ]
  },
  {
    id: "cyclone",
    cat: "3. 製程 (Processing)",
    title: "旋風分離器 (Cyclone Separator)",
    subtitle: "高效氣固分離，實現物料回收與初步過濾",
    image: "input_file_9.png",
    advantages: [
      "高效分離：去除 5~10 微米以上的粉塵，作為輸送末端氣粉分離過濾。",
      "結構簡單：無活動部件，安裝維護極為方便，使用壽命長。",
      "耐用可靠：可耐高溫高壓，適合處理高溫煙氣。",
      "節能降耗：壓損低，運行成本低，是極具經濟效益的選擇。"
    ]
  },
  {
    id: "dust",
    cat: "4. 環境 (Environmental)",
    title: "集塵機 (Dust Collector)",
    subtitle: "維護產線潔淨與人員安全的核心保障",
    image: "input_file_10.png",
    advantages: [
      "高效過濾：採用多層濾材設計，過濾效率高達 99% 以上。",
      "自動清灰：具備氣動脈衝反吹系統，自動保持濾材潔淨。",
      "穩定吸力：搭載高效能風機與渦輪葉片，吸力穩定不衰退。",
      "維護簡便：採模組化設計，濾材更換快速，組件各自獨立。"
    ]
  },
  {
    id: "platform",
    cat: "5. 整合 (Integration)",
    title: "客製化設備鋼構架台",
    subtitle: "穩固的系統基石，量身打造的整合工藝",
    image: "input_file_11.png",
    advantages: [
      "高度客製：可根據客戶設備需求、廠房空間與承重規格進行設計。",
      "堅固耐用：採用高強度鋼材製造，確保結構穩定與長期安全。",
      "安裝快速：採模組化設計，可預製，縮短現場安裝時間。",
      "完美整合：確保設備安裝位置精準，管線配置合理。"
    ]
  }
];

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const exportCatalogue = async () => {
    setIsExporting(true);
    try {
      const pres = new pptxgen();
      pres.title = "錕興機械產品型錄 - 智慧輸送系統整合方案";
      pres.layout = 'LAYOUT_16x9';

      // P1: Cover
      const s1 = pres.addSlide();
      s1.background = { color: "020617" };
      s1.addText("錕興機械股份有限公司", { x: 0.5, y: 1.5, w: "90%", h: 1, fontSize: 48, bold: true, color: "3B82F6", align: 'center' });
      s1.addText("智慧輸送，系統整合", { x: 0.5, y: 2.6, w: "90%", h: 1, fontSize: 32, color: "FFFFFF", align: 'center', bold: true });
      s1.addText("從進料到製程的完整粉體物料處理方案", { x: 0.5, y: 3.5, w: "90%", h: 1, fontSize: 18, color: "94A3B8", align: 'center' });

      // P2: Challenges
      const s2 = pres.addSlide();
      s2.addText("您的挑戰，我們的專業承諾", { x: 0.5, y: 0.5, w: 9, fontSize: 28, bold: true, color: "1E40AF" });
      s2.addText("• 效率瓶頸：物料輸送不順、系統頻繁停機\n• 環境安全：粉塵外洩影響工安與健康\n• 成本壓力：能源消耗過高、物料浪費\n• 整合困難：設備規格不一，難以整合成自動化產線", { x: 0.5, y: 1.5, w: 4, fontSize: 14, color: "334155" });
      s2.addText("我們的理念：以系統思維打造客製化整合方案", { x: 5, y: 1.5, w: 4.5, fontSize: 20, bold: true, color: "1E40AF" });
      s2.addText("深耕製程需求，提供從設計到施工的一站式解決方案。", { x: 5, y: 2.5, w: 4.5, fontSize: 12, color: "475569" });

      // P3: Journey
      const s3 = pres.addSlide();
      s3.addText("一覽無遺的製程之旅", { x: 0.5, y: 0.5, w: 9, fontSize: 24, bold: true, color: "1E40AF", align: 'center' });
      const steps = ["1.進料", "2.輸送", "3.製程", "4.環境", "5.整合"];
      steps.forEach((st, i) => {
        s3.addText(st, { x: 0.5 + i * 1.8, y: 2.5, w: 1.7, h: 1, fontSize: 12, bold: true, color: "FFFFFF", fill: { color: "3B82F6" }, align: 'center' });
      });

      // P4-11: Products (Matches screenshots)
      products.forEach(p => {
        const slide = pres.addSlide();
        slide.addText(p.title, { x: 0.5, y: 0.4, w: 9, fontSize: 24, bold: true, color: "1E3A8A" });
        slide.addText(p.subtitle, { x: 0.5, y: 1.0, w: 9, fontSize: 14, italic: true, color: "3B82F6" });
        slide.addText("核心優勢：\n• " + p.advantages.join("\n• "), { x: 0.5, y: 1.8, w: 5.5, fontSize: 11, color: "475569" });
        if (p.table) {
          slide.addTable([['型號', '入氣管徑', '出氣管徑'], ...p.table.map(r => [r.model, r.inlet, r.outlet])], { x: 0.5, y: 4.0, w: 5, fontSize: 9, border: { pt: 1, color: "CBD5E1" } });
        }
      });

      // P12: Integration Example
      const s12 = pres.addSlide();
      s12.addText("系統整合實例", { x: 0.5, y: 0.5, w: 9, fontSize: 24, bold: true, color: "1E40AF", align: 'center' });
      s12.addText("從太空包進料到精確計量的完整端到端解決方案", { x: 0.5, y: 1.2, w: 9, fontSize: 14, color: "64748B", align: 'center' });

      // P13: Why Choose Us
      const s13 = pres.addSlide();
      s13.addText("為何選擇錕興機械？", { x: 0.5, y: 0.5, w: 9, fontSize: 28, bold: true, color: "1E40AF", align: 'center' });
      s13.addText("• 系統級專業：深度的製程理解與動態優化\n• 深度客製化能力：量身打造最合適方案\n• 驗證的可靠性：結構堅固，降低維護故障\n• 端到端服務：從諮詢、設計到安裝的全方位支持", { x: 1, y: 1.5, w: 8, fontSize: 16, color: "334155", lineSpacing: 35 });

      // P14: Contact
      const s14 = pres.addSlide();
      s14.addText("立即啟動您的產線升級計畫", { x: 0.5, y: 1.5, w: 9, fontSize: 32, bold: true, color: "1E40AF", align: 'center' });
      s14.addText("聯絡電話：03-9908036\n電子郵件：zack31717@gmail.com\n官方網站：掃描二維碼或點擊連結", { x: 0.5, y: 2.8, w: 9, fontSize: 18, color: "475569", align: 'center' });

      await pres.writeFile({ fileName: "錕興機械_智慧輸送整合方案.pptx" });
    } catch (err) {
      console.error(err);
      alert("下載型錄失敗，請稍後再試。");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] font-sans text-slate-200 antialiased selection:bg-blue-600/30">
      {/* 科技感背景 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-600/5 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
      </div>

      {/* 導覽列 */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-xl py-3 border-b border-white/5 shadow-2xl' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">K</div>
            <div className="text-white">
              <div className="font-black text-xl leading-none tracking-tight">錕興機械</div>
              <div className="text-[9px] opacity-40 font-bold tracking-[0.2em] uppercase">Kun Xing Machinery</div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
             <button onClick={() => scrollTo('challenges')} className="hover:text-blue-400 transition-colors">挑戰與承諾</button>
             <button onClick={() => scrollTo('journey')} className="hover:text-blue-400 transition-colors">製程流程</button>
             <button onClick={() => scrollTo('products')} className="hover:text-blue-400 transition-colors">設備系列</button>
             <button onClick={() => scrollTo('integration')} className="hover:text-blue-400 transition-colors">整合實例</button>
             <button onClick={() => scrollTo('contact')} className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 text-xs">聯絡專家</button>
          </div>
        </div>
      </nav>

      {/* Hero 區塊 */}
      <header className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12 rounded-full shadow-lg">
              Smart Conveying & System Integration
            </div>
            <h1 className="text-7xl lg:text-9xl font-black mb-10 leading-[0.85] tracking-tighter text-white">
              智慧輸送<br/><span className="text-blue-600">系統整合</span>
            </h1>
            <p className="text-2xl text-slate-400 mb-12 font-medium leading-relaxed italic border-l-4 border-blue-600 pl-8">
              錕興機械：從進料到製程的完整粉體物料處理方案
            </p>
            <div className="flex flex-wrap gap-6">
               <button onClick={() => scrollTo('products')} className="px-12 py-6 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 shadow-2xl shadow-blue-600/30 text-lg flex items-center gap-4 transition-all">
                 探索設備方案 <ArrowRight size={22} />
               </button>
               <button 
                 onClick={exportCatalogue} 
                 disabled={isExporting} 
                 className="px-12 py-6 bg-white/5 text-slate-300 font-black rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-lg flex items-center gap-4 group"
               >
                 {isExporting ? <div className="w-5 h-5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" /> : <FileDown size={22} className="group-hover:translate-y-1 transition-transform" />}
                 下載智慧輸送整合方案型錄
               </button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
             <SafeImage src="input_file_1.png" alt="智慧輸送系統整線圖" className="aspect-video shadow-3xl border border-white/5 bg-white/5" />
          </motion.div>
        </div>
      </header>

      {/* 產品展示區 */}
      <section id="products" className="py-40 scroll-mt-24">
        <div className="container mx-auto px-6">
          {products.map((p, idx) => (
            <div key={p.id} className={`flex flex-col lg:flex-row gap-24 items-center mb-48 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <motion.div 
                initial={{ opacity: 0, x: idx % 2 === 1 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:w-1/2"
              >
                <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-600/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-blue-500/10">
                  {p.cat}
                </div>
                <h3 className="text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">{p.title}</h3>
                <p className="text-2xl text-blue-400 font-bold mb-12 italic opacity-80">{p.subtitle}</p>
                
                <div className="mb-12">
                   <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                     <span className="w-8 h-[1px] bg-slate-800"></span> 核心優勢 Core Advantages
                   </h4>
                   <ul className="grid grid-cols-1 gap-y-6">
                     {p.advantages.map((adv, i) => (
                       <li key={i} className="flex gap-6 text-slate-300 leading-relaxed font-semibold items-start text-lg">
                         <CheckCircle2 size={24} className="text-blue-500 shrink-0 mt-0.5" /> {adv}
                       </li>
                     ))}
                   </ul>
                </div>

                {p.table && (
                   <div className="mb-12 overflow-hidden rounded-2xl border border-white/5 bg-white/5">
                      <table className="w-full text-left text-sm">
                         <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                            <tr>
                               <th className="px-6 py-4">型號 (Model)</th>
                               <th className="px-6 py-4">入氣管徑</th>
                               <th className="px-6 py-4">出氣管徑</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {p.table.map((row, i) => (
                               <tr key={i} className="hover:bg-white/5 transition-colors">
                                  <td className="px-6 py-4 font-black text-blue-400">{row.model}</td>
                                  <td className="px-6 py-4 text-slate-300">{row.inlet}</td>
                                  <td className="px-6 py-4 text-slate-300">{row.outlet}</td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                )}
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="lg:w-1/2 w-full"
              >
                <SafeImage src={p.image} alt={p.title} className="aspect-[4/3] shadow-4xl p-10 bg-white" />
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* 整合案例 */}
      <section id="integration" className="py-48 bg-slate-900/50 scroll-mt-24">
        <div className="container mx-auto px-6 text-center mb-32">
          <h2 className="text-6xl font-black text-white mb-8 tracking-tighter">系統整合實例</h2>
          <p className="text-2xl text-slate-500 max-w-4xl mx-auto font-medium leading-relaxed italic">
            「整合太空包進料、DNU輸送及精確計量」的示範案例。
          </p>
        </div>
        <div className="container mx-auto px-6">
           <div className="max-w-7xl mx-auto p-6 bg-white rounded-[4rem] shadow-5xl border border-slate-200">
              <img src="input_file_12.png" alt="整線整合實例" className="w-full h-auto rounded-[3.5rem]" />
           </div>
        </div>
      </section>

      {/* 聯絡資訊 */}
      <section id="contact" className="py-48 bg-slate-900/50 scroll-mt-24">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto bg-gradient-to-br from-slate-900 to-slate-950 rounded-[5rem] p-16 md:p-32 flex flex-col lg:flex-row gap-24 items-center border border-white/5 shadow-5xl relative overflow-hidden">
             <div className="flex-1 relative z-10">
                <h2 className="text-7xl lg:text-8xl font-black mb-12 italic text-white leading-[0.9] tracking-tighter">啟動您的<br/><span className="text-blue-600">產線升級計畫</span></h2>
                <div className="space-y-12">
                   <div className="flex items-center gap-12 group">
                      <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 border border-blue-500/10">
                        <Phone size={32} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">聯絡電話</div>
                        <div className="font-black text-3xl text-white tracking-tighter">03-9908036</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-12 group">
                      <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 border border-blue-500/10">
                        <Mail size={32} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">電子郵件</div>
                        <div className="font-black text-3xl text-blue-400 italic tracking-tight">zack31717@gmail.com</div>
                      </div>
                   </div>
                </div>
             </div>
             <div className="lg:w-[35%] w-full relative z-10">
                <div className="bg-white p-16 rounded-[4.5rem] text-center shadow-6xl border border-slate-200">
                   <img src="input_file_14.png" className="w-full h-auto mx-auto mb-10" alt="QR Code" />
                   <div className="text-xl font-black text-blue-900 tracking-tight">掃描瀏覽官方網站</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <footer className="py-24 border-t border-white/5 text-center bg-slate-950">
         <p className="text-slate-800 font-black uppercase tracking-[0.6em] text-[9px]">© 2024 KUN XING MACHINERY CO., LTD. All rights reserved.</p>
      </footer>

      {/* 浮動按鈕 */}
      <div className="fixed bottom-10 right-10 z-[60] flex flex-col gap-6">
         <button 
           onClick={exportCatalogue} 
           className="w-16 h-16 bg-slate-900/90 backdrop-blur-xl border border-white/10 text-blue-400 rounded-2xl shadow-4xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all active:scale-90 group"
         >
            <FileDown size={28} />
            <span className="absolute right-full mr-6 px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-widest">下載數位型錄</span>
         </button>
         <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-4xl flex items-center justify-center hover:bg-blue-500 transition-all active:scale-90 shadow-blue-600/40">
            <ArrowUp size={28} />
         </button>
      </div>
    </div>
  );
};

export default App;
