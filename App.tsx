
import React, { useState, useEffect, useRef } from 'react';
import { 
  Wind, RotateCw, Layers, ArrowRight, Activity, Phone, Mail, CheckCircle2,
  ArrowUp, MapPin, Upload, X, Gauge, Terminal, Database, Download, Copy, Info,
  Loader2, Image as ImageIcon, FolderOpen, FileCheck, Star, Settings, Truck, ShieldCheck,
  Layout, PhoneCall, Building2, Printer, Fingerprint, Search, ClipboardCheck, Wrench,
  TrendingDown, Puzzle, Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IMAGE_BASE = "https://raw.githubusercontent.com/zack31717-alt/pansko/main/";

// --- 公司標誌 ---
const Logo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4L36 34H4L20 4Z" fill="#2563EB" fillOpacity="0.1" stroke="#2563EB" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M10 18C13 16 17 20 20 18C23 16 27 20 30 18" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 24C11 22 15 26 18 24C21 22 25 26 28 24" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 30C9 28 13 32 16 30C19 28 23 32 26 30" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// --- 挑戰與承諾視覺組件 (新) ---
const ChallengeCommitmentGraphic = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-[2.5rem] border border-slate-200 shadow-2xl p-8 lg:p-10 text-left relative overflow-hidden h-full flex flex-col justify-center">
    <div className="absolute top-0 right-0 p-4 opacity-5">
      <Logo className="w-32 h-32" />
    </div>
    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* 左側：挑戰 */}
      <div className="space-y-6">
        <h4 className="text-xl font-black text-slate-900 border-l-4 border-blue-600 pl-4 mb-6 italic">您是否面臨以下挑戰？</h4>
        <div className="space-y-5">
          {[
            { icon: Activity, title: "效率瓶頸", desc: "物料輸送不順、換料時間過長、系統頻繁停機？" },
            { icon: Leaf, title: "環境與安全", desc: "粉塵外洩汙染產線，影響人員健康與工安？" },
            { icon: TrendingDown, title: "成本壓力", desc: "能源消耗過高、維護成本攀升、物料浪費？" },
            { icon: Puzzle, title: "整合困難", desc: "各家設備規格不一，難以整合成高效產線？" }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <item.icon size={20} />
              </div>
              <div>
                <div className="text-sm font-black text-slate-800">{item.title}</div>
                <div className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 右側：理念 */}
      <div className="md:border-l border-slate-200 md:pl-10 flex flex-col justify-center">
        <h4 className="text-xl font-black text-slate-900 mb-6 italic">我們的理念：<br/><span className="text-blue-600">以系統思維打造客製化整合方案</span></h4>
        <p className="text-sm text-slate-600 leading-loose font-medium">
          <span className="font-black text-blue-700">PANSKO</span> 不僅提供單一設備，我們更專注於深入了解您的製程需求。
          我們以系統整合的角度，提供從前端設計、設備客製化到現場施工的完整解決方案，確保每一環節無縫銜接，為您打造穩定、高效且安全的智慧化產線。
        </p>
      </div>
    </div>
  </div>
);

// --- 設備圖示集 ---
const MachineryGraphics = {
  BulkBagStation: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40"><rect x="25" y="10" width="50" height="40" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" /><path d="M25 50 L10 90 M75 50 L90 90" stroke="#64748b" strokeWidth="2" /><circle cx="50" cy="80" r="5" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" /></svg>
  ),
  Cyclone: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40"><path d="M30 20 Q50 15 70 20 L70 50 Q50 55 30 50 Z" fill="#e2e8f0" stroke="#94a3b8" /><path d="M30 50 L50 90 L70 50" fill="#cbd5e1" stroke="#94a3b8" /></svg>
  ),
  ScrewConveyor: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40"><rect x="10" y="45" width="70" height="12" rx="2" fill="#e2e8f0" stroke="#94a3b8" /><circle cx="85" cy="51" r="8" fill="#475569" /></svg>
  ),
  MeteringTank: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40"><rect x="30" y="15" width="40" height="45" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" /><path d="M30 60 L50 90 L70 60" fill="#cbd5e1" stroke="#94a3b8" /></svg>
  ),
  Venturi: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40"><path d="M10 40 L30 40 L45 48 L55 48 L70 40 L90 40 L90 60 L10 60 Z" fill="#e2e8f0" stroke="#94a3b8" /></svg>
  ),
  RCUAIR: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40"><path d="M20 30 L80 30 C85 30 90 35 90 40 L90 60 C90 65 85 70 80 70 L20 70 C15 70 10 65 10 60 L10 40 C10 35 15 30 20 30" fill="none" stroke="#3b82f6" strokeWidth="3" /><path d="M30 30 L30 70 M50 30 L50 70 M70 30 L70 70" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,2" /><circle cx="20" cy="50" r="6" fill="#3b82f6" fillOpacity="0.3" /><circle cx="80" cy="50" r="6" fill="#3b82f6" fillOpacity="0.3" /></svg>
  ),
  DustCollector: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40"><rect x="35" y="15" width="30" height="45" fill="#e2e8f0" stroke="#94a3b8" /><path d="M35 60 L50 85 L65 60" fill="#cbd5e1" stroke="#94a3b8" /></svg>
  ),
  StructuralPlatform: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40"><rect x="10" y="60" width="80" height="5" fill="#94a3b8" /><path d="M20 65 L20 95 M80 65 L80 95" stroke="#64748b" strokeWidth="2" /></svg>
  ),
  RotaryValve: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40"><circle cx="50" cy="50" r="30" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" /><path d="M50 20 L50 80 M20 50 L80 50 M28 28 L72 72 M28 72 L72 28" stroke="#94a3b8" strokeWidth="1" /><rect x="75" y="40" width="15" height="20" rx="2" fill="#475569" /></svg>
  ),
  VibratingScreen: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40"><rect x="20" y="30" width="60" height="25" rx="2" fill="#e2e8f0" stroke="#94a3b8" /><path d="M20 42 L80 42" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2,2" /><path d="M30 55 L25 75 M70 55 L75 75" stroke="#64748b" strokeWidth="3" /></svg>
  ),
  DiverterValve: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40"><path d="M50 20 L50 45 L25 80 M50 45 L75 80" fill="none" stroke="#94a3b8" strokeWidth="15" strokeLinecap="round" /><circle cx="50" cy="45" r="10" fill="#3b82f6" fillOpacity="0.2" /></svg>
  ),
  Hopper: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40"><path d="M20 20 L80 20 L65 70 L35 70 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" /><rect x="35" y="70" width="30" height="10" fill="#cbd5e1" /></svg>
  ),
  VacuumConveyor: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40"><rect x="35" y="10" width="30" height="60" rx="15" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" /><path d="M35 30 L15 45" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" /><circle cx="50" cy="15" r="5" fill="#3b82f6" /></svg>
  ),
  LossInWeight: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40"><rect x="20" y="75" width="60" height="10" rx="1" fill="#475569" /><rect x="30" y="15" width="40" height="40" rx="2" fill="#e2e8f0" stroke="#94a3b8" /><rect x="25" y="55" width="50" height="15" fill="#cbd5e1" stroke="#94a3b8" /><path d="M30 75 L30 65 M70 75 L70 65" stroke="#3b82f6" strokeWidth="2" /></svg>
  ),
  TubularConveyor: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40"><path d="M15 30 L85 30 Q90 30 90 35 L90 65 Q90 70 85 70 L15 70 Q10 70 10 65 L10 35 Q10 30 15 30" fill="none" stroke="#94a3b8" strokeWidth="8" /><circle cx="15" cy="50" r="10" fill="#cbd5e1" stroke="#94a3b8" /><circle cx="85" cy="50" r="10" fill="#cbd5e1" stroke="#94a3b8" /></svg>
  ),
  ControlPanel: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40"><rect x="25" y="10" width="50" height="80" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" /><rect x="35" y="25" width="30" height="20" rx="1" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" /><circle cx="40" cy="55" r="3" fill="#ef4444" /><circle cx="50" cy="55" r="3" fill="#22c55e" /><circle cx="60" cy="55" r="3" fill="#f59e0b" /><path d="M30 75 L70 75 M30 80 L70 80" stroke="#94a3b8" strokeWidth="1" /></svg>
  ),
  PipelineAnalysis: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40"><path d="M10 20 C40 20, 60 80, 90 80" fill="none" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round" /><path d="M10 20 C40 20, 60 80, 90 80" fill="none" stroke="url(#flowGradient)" strokeWidth="8" strokeLinecap="round" /><defs><linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ef4444" /><stop offset="50%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#22c55e" /></linearGradient></defs><circle cx="25" cy="20" r="2" fill="white" fillOpacity="0.8"><animate attributeName="cx" from="10" to="90" dur="2s" repeatCount="indefinite" /></circle></svg>
  )
};

interface Product {
  id: string;
  cat: string;
  title: string;
  subtitle: string;
  Graphic: React.ComponentType;
  advantages: string[];
  image: string; 
}

const initialProductsRaw: Product[] = [
  { id: "infeed", cat: "1. 進料 (Infeed)", title: "太空包投料站", subtitle: "Bulk Bag Unloading Station", Graphic: MachineryGraphics.BulkBagStation, advantages: ["單人操作節省人力", "全密封防止粉塵外洩", "選配振動器確保流動", "支援多種物料規格"], image: "infeed.png" },
  { id: "hopper", cat: "1. 進料 (Infeed)", title: "手動投料斗", subtitle: "Manual Dumping Station", Graphic: MachineryGraphics.Hopper, advantages: ["人體工學設計", "內置簡易過濾網", "可與集塵系統連動", "不鏽鋼鏡面處理"], image: "hopper.png" },
  { id: "conveying_dnu", cat: "2. 輸送 (Conveying)", title: "DNU/SNU 輸送裝置", subtitle: "無背壓氣動輸送革新", Graphic: MachineryGraphics.Venturi, advantages: ["獨特微負壓設計", "可取代傳統迴轉閥", "大幅減少系統背壓", "耐磨損長效運轉"], image: "conveying_dnu.png" },
  { id: "rcu_air", cat: "2. 輸送 (Conveying)", title: "RCU 空氣輸送機", subtitle: "RCU Pneumatic Conveying System", Graphic: MachineryGraphics.RCUAIR, advantages: ["密閉高壓循環技術", "適合長距離穩定輸送", "物料破損率極低", "氣體消耗量低、高節能"], image: "rcu_air.png" },
  { id: "tubular", cat: "2. 輸送 (Conveying)", title: "管鏈輸送機", subtitle: "Tubular Cable & Chain Conveyor", Graphic: MachineryGraphics.TubularConveyor, advantages: ["3D 空間任意佈局", "超低能耗運行", "物料輸送溫和無破損", "完全密閉無粉塵外洩"], image: "tubular.png" },
  { id: "rotary_valve", cat: "2. 輸送 (Conveying)", title: "迴轉閥 (Rotary Valve)", subtitle: "精密氣鎖與定量給料", Graphic: MachineryGraphics.RotaryValve, advantages: ["高氣密性設計", "多種葉片型式可選", "具防咬料保護功能", "耐壓差性能優異"], image: "rotary_valve.png" },
  { id: "vacuum", cat: "特色添加系統", title: "雙段添加料劑", subtitle: "解決正壓管路加料難題", Graphic: MachineryGraphics.VacuumConveyor, advantages: ["解決正壓管路中加料困難", "解決管路背壓排放問題", "雙段氣鎖結構確保壓力穩定", "避免物料在加料口發生倒噴"], image: "vacuum.png" },
  { id: "mixer", cat: "2. 輸送 (Conveying)", title: "螺旋輸送機含攪拌機", subtitle: "輸送與均化一體化方案", Graphic: MachineryGraphics.ScrewConveyor, advantages: ["輸送與攪拌同步完成", "有效防止粉體架橋", "結構緊湊節省空間", "支援模組化長度擴展"], image: "mixer.png" },
  { id: "diverter", cat: "2. 輸送 (Conveying)", title: "雙路切換閥", subtitle: "多路徑流道切換裝置", Graphic: MachineryGraphics.DiverterValve, advantages: ["平滑內壁無死角", "氣動快速切換", "極低物料殘留", "耐磨損不鏽鋼閥瓣"], image: "diverter.png" },
  { id: "metering", cat: "3. 製程 (Processing)", title: "計量桶 (Metering Tank)", subtitle: "精準配比之核心工藝", Graphic: MachineryGraphics.MeteringTank, advantages: ["超高計量精度 (1/1000)", "支援 50L 至 1000L", "全不鏽鋼潔淨設計", "易於連結自動控制系統"], image: "metering.png" },
  { id: "loss_in_weight", cat: "3. 製程 (Processing)", title: "失重式供料機", subtitle: "Loss-in-Weight Feeder", Graphic: MachineryGraphics.LossInWeight, advantages: ["動態連續稱重補償", "適用於微量精準添加", "數位化智慧控制界面", "高穩定性負載元"], image: "loss_in_weight.png" },
  { id: "cyclone", cat: "3. 製程 (Processing)", title: "旋風分離器", subtitle: "高效氣粉分離組件", Graphic: MachineryGraphics.Cyclone, advantages: ["去除 5~10μm 以上粉塵", "無活動部件維護極簡", "耐高溫高壓適合惡劣環境", "作為輸送末端氣固分離"], image: "cyclone.png" },
  { id: "screen", cat: "3. 製程 (Processing)", title: "高效振動篩", subtitle: "物料分級與雜質過濾", Graphic: MachineryGraphics.VibratingScreen, advantages: ["多層篩網同時作業", "低噪音高性能電機", "密封設計防止粉塵擴散", "快速拆裝清洗方便"], image: "screen.png" },
  { id: "dust", cat: "4. 環境 (Environmental)", title: "集塵機 (Dust Collector)", subtitle: "維護產線潔淨與安全", Graphic: MachineryGraphics.DustCollector, advantages: ["多層高效過濾濾材", "氣動脈衝自動清灰", "高效能渦輪穩定吸力", "模組化易維護結構"], image: "dust.png" },
  { id: "control_panel", cat: "5. 自動化 (Automation)", title: "智慧中央控制盤", subtitle: "Industrial PLC & HMI System", Graphic: MachineryGraphics.ControlPanel, advantages: ["PLC 邏輯程序自動化控制", "HMI 直觀人機圖形介面", "支援遠端監控與大數據分析", "符合 CE/UL 工業配線標準"], image: "control_panel.png" },
  { id: "pipeline_analysis", cat: "6. 工程服務 (Engineering)", title: "管路壓力與流場分析", subtitle: "Advanced CFD Flow Simulation", Graphic: MachineryGraphics.PipelineAnalysis, advantages: ["精準模擬氣固兩相流運動", "預測管路易磨損與死角區域", "最佳化風量與輸送壓降", "大幅降低堵料風險與能耗"], image: "pipeline_analysis.png" },
  { id: "platform", cat: "7.整合 (Integration)", title: "客製化設備鋼構架台", subtitle: "穩固系統的基礎基石", Graphic: MachineryGraphics.StructuralPlatform, advantages: ["依廠房空間量身打造", "高強度鋼材確保載重安全", "模組化設計快速安裝", "整合多項設備之基礎架構"], image: "platform.png" }
];

const workflowSteps = [
  { id: 1, title: "需求分析與對接", desc: "深入了解物料特性與現場空間限制", icon: Search },
  { id: 2, title: "系統規劃設計", desc: "CAD 繪圖與 3D 模擬最佳化輸送路徑", icon: Layout },
  { id: 3, title: "精密製造組裝", desc: "工廠內部高標準生產與組件測試", icon: Settings },
  { id: 4, title: "現場施工安裝", desc: "專業工程師到場定位、接管與配線", icon: Truck },
  { id: 5, title: "測試調試維護", desc: "系統連動測試、人員培訓與定期保養", icon: Wrench },
];

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, number>>({});
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleImageError = (id: string) => {
    setImageLoadErrors(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const getSource = (p: Product) => {
    const count = imageLoadErrors[p.id] || 0;
    const base = p.image;
    if (count >= 3) return null;
    return `${IMAGE_BASE}${base}`;
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-100">
      {/* 導覽列 */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md py-3 border-b border-slate-200 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <Logo className="w-10 h-10 transition-transform group-hover:scale-110" />
            <div className="flex flex-col text-left">
              <span className="font-black text-xl text-blue-900 leading-tight tracking-tighter uppercase">錕興機械</span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase">PANSKO</span>
            </div>
          </div>
          <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-500 items-center">
             <button onClick={() => scrollTo('products')} className="hover:text-blue-600 transition-colors">產品目錄</button>
             <button onClick={() => scrollTo('workflow')} className="hover:text-blue-600 transition-colors">服務流程</button>
             <button onClick={() => setShowExportModal(true)} className="hover:text-blue-600 transition-colors">檔名指南</button>
             <button onClick={() => scrollTo('contact')} className="bg-blue-600 text-white px-8 py-3 rounded-full text-xs shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">聯絡專家</button>
          </div>
        </div>
      </nav>

      {/* 英雄區塊 (更新後) */}
      <header className="relative pt-32 pb-20 overflow-hidden bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-6 grid grid-cols-1 xl:grid-cols-12 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="xl:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100 mb-8">
              <Star size={14} className="fill-blue-600" /> 您的挑戰，我們的專業承諾
            </div>
            <h1 className="text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tighter text-slate-950 uppercase italic">
              智慧粉體<br/><span className="text-blue-600">自動化控制</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 font-medium leading-relaxed max-w-lg">
              面對繁複的輸送挑戰，PANSKO 提供的不只是設備，而是經由深入分析後量身打造的穩定產線解決方案。
            </p>
           <div className="flex flex-wrap gap-4">
  <button
    onClick={() => scrollTo('products')}
    className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl
               hover:bg-slate-800 shadow-xl transition-all flex items-center gap-3 group"
  >
    瀏覽產品目錄
    <ArrowRight size={20} className="group-hover:translate-x-1" />
  </button>

  <button
    onClick={() => scrollTo('contact')}
    className="px-10 py-5 bg-white text-slate-900 border border-slate-200 font-black rounded-2xl
               hover:bg-slate-50 transition-all flex items-center gap-3"
  >
    獲取技術諮詢
    <PhoneCall size={20} />
  </button>

  {/* 型錄下載 */}
  <a
    href="/kunhing-catalog.pdf"
    download
    className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl
               hover:bg-blue-700 transition-all flex items-center gap-3"
  >
    下載型錄 PDF
    <Download size={20} />
  </a>

  {/* 公司實績表下載 */}
  <a
    href="/company-performance.pdf"
    download
    className="px-10 py-5 bg-white text-slate-900 border border-slate-200 font-black rounded-2xl
               hover:bg-slate-50 transition-all flex items-center gap-3"
  >
    公司實績表
    <Download size={20} />
  </a>
</div>

          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2 }} 
            className="xl:col-span-7"
          >
            {/* 更換原本圖片為挑戰與承諾視覺元件 */}
            <ChallengeCommitmentGraphic />
          </motion.div>
        </div>
      </header>

      {/* 產品展示區塊 */}
      <section id="products" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">精選設備與方案</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 gap-12 max-w-6xl mx-auto">
            {initialProductsRaw.map((p) => {
              const src = getSource(p);
              const isError = (imageLoadErrors[p.id] || 0) >= 3;

              return (
                <motion.div 
                  key={p.id} id={p.id} 
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} 
                  className="bg-white p-10 lg:p-14 rounded-[3.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:border-blue-200 transition-all group overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="flex-1 text-left">
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                          {p.cat}
                        </div>
                      </div>
                      <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{p.title}</h3>
                      <p className="text-lg text-blue-600/60 font-bold mb-8 italic">{p.subtitle}</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {p.advantages.map((adv, i) => (
                          <li key={i} className="flex gap-3 text-slate-600 font-semibold items-start leading-snug">
                            <CheckCircle2 size={18} className="text-blue-500 mt-0.5 shrink-0" /> 
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="lg:w-1/2 w-full aspect-square rounded-[2.5rem] bg-slate-50 border border-slate-200 flex items-center justify-center p-8 relative overflow-hidden group">
                      {isError ? (
                        <div className="text-center opacity-20"><p.Graphic /></div>
                      ) : src ? (
                        <img 
                          src={src} 
                          alt={p.title} 
                          onError={() => handleImageError(p.id)}
                          className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-center opacity-10"><p.Graphic /></div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 服務流程區塊 */}
      <section id="workflow" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">標準自動化流程</h2>
            <p className="text-slate-400 font-medium">從規畫到安裝，我們為您把關每一個細節</p>
            <div className="w-20 h-1.5 bg-blue-500 mx-auto rounded-full mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-blue-900 -z-10"></div>
            
            {workflowSteps.map((step) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.id * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center mb-6 shadow-xl shadow-blue-600/30 border border-blue-400 group hover:scale-110 transition-transform">
                  <step.icon size={36} className="text-white" />
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 h-full">
                  <div className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Step 0{step.id}</div>
                  <h4 className="text-lg font-bold mb-3">{step.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 頁尾與聯絡資訊 */}
      <footer id="contact" className="py-24 bg-slate-950 text-white border-t border-slate-900 text-left">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20">
            {/* 公司簡介 */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-4 mb-8">
                <Logo className="w-12 h-12" />
                <div className="flex flex-col text-left">
                  <span className="font-black text-2xl text-white tracking-tighter uppercase">錕興機械</span>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase">PANSKO</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-sm-sm">
                擁有超過二十年的粉體輸送經驗，提供從設計、製造到安裝的完整自動化解決方案。
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm font-bold text-blue-500">
                  <Fingerprint size={18} /> 
                  <span>統一編號：29113377</span>
                </div>
              </div>
            </div>

            {/* 聯絡細節 */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-8">聯絡資訊 / Contact</h4>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-left">
                    <Phone size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">電話</div>
                    <div className="text-lg font-bold">03-9908036</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <Printer size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">傳真 (FAX)</div>
                    <div className="text-lg font-bold">03-9905853</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">電子郵件</div>
                    <div className="text-lg font-bold">zack31717@gmail.com</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 text-left">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-8">所在地 / Location</h4>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">公司地址</div>
                    <div className="text-lg font-bold leading-relaxed">
                      宜蘭縣五結鄉成興村<br/>利工一路二段116巷15號
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <Building2 size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">工廠</div>
                    <div className="text-lg font-bold leading-relaxed">利澤工業區生產基地</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-900 text-center">
            <div className="text-[9px] opacity-20 font-black tracking-[0.5em] uppercase">
              © 2024 PANSKO MACHINERY CO., LTD. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </footer>

      {/* 指南彈窗 */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden text-left border border-slate-200">
              <div className="p-10 border-b flex justify-between items-center bg-slate-50">
                <h3 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter">Images 對應清單</h3>
                <button onClick={() => setShowExportModal(false)} className="p-3 hover:bg-slate-200 rounded-2xl"><X /></button>
              </div>
              <div className="p-10 flex-1 overflow-auto bg-slate-50 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {initialProductsRaw.map(p => (
                    <div key={p.id} className="p-5 bg-white border border-slate-200 rounded-2xl flex justify-between items-center group hover:border-blue-400 transition-all">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.title}</span>
                        <code className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1">{p.image}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-10 right-10 w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all z-50">
        <ArrowUp size={28} strokeWidth={3} />
      </button>
    </div>
  );
};

export default App;
