
import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Wind, RotateCw, Box, Layers, 
  ArrowRight, ShieldCheck,
  Activity, Phone, Mail, CheckCircle2,
  ArrowUp, LineChart,
  Target, HardHat, DollarSign, Puzzle,
  Printer, Hash, MapPin, ChevronRight, Leaf,
  Upload, Image as ImageIcon, X, Gauge,
  Construction, Layout, Filter, Zap, ArrowRightLeft, MoveRight, Scale, Link, Terminal, Cpu, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
      <rect x="25" y="10" width="50" height="40" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      <path d="M25 50 L10 90 M75 50 L90 90" stroke="#64748b" strokeWidth="2" />
      <circle cx="50" cy="80" r="5" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" />
    </svg>
  ),
  Cyclone: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
      <path d="M30 20 Q50 15 70 20 L70 50 Q50 55 30 50 Z" fill="#e2e8f0" stroke="#94a3b8" />
      <path d="M30 50 L50 90 L70 50" fill="#cbd5e1" stroke="#94a3b8" />
    </svg>
  ),
  ScrewConveyor: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
      <rect x="10" y="45" width="70" height="12" rx="2" fill="#e2e8f0" stroke="#94a3b8" />
      <circle cx="85" cy="51" r="8" fill="#475569" />
    </svg>
  ),
  MeteringTank: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
      <rect x="30" y="15" width="40" height="45" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
      <path d="M30 60 L50 90 L70 60" fill="#cbd5e1" stroke="#94a3b8" />
    </svg>
  ),
  Venturi: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
      <path d="M10 40 L30 40 L45 48 L55 48 L70 40 L90 40 L90 60 L10 60 Z" fill="#e2e8f0" stroke="#94a3b8" />
    </svg>
  ),
  RCUAIR: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
      <path d="M20 30 L80 30 C85 30 90 35 90 40 L90 60 C90 65 85 70 80 70 L20 70 C15 70 10 65 10 60 L10 40 C10 35 15 30 20 30" fill="none" stroke="#3b82f6" strokeWidth="3" />
      <path d="M30 30 L30 70 M50 30 L50 70 M70 30 L70 70" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,2" />
      <circle cx="20" cy="50" r="6" fill="#3b82f6" fillOpacity="0.3" />
      <circle cx="80" cy="50" r="6" fill="#3b82f6" fillOpacity="0.3" />
    </svg>
  ),
  DustCollector: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
      <rect x="35" y="15" width="30" height="45" fill="#e2e8f0" stroke="#94a3b8" />
      <path d="M35 60 L50 85 L65 60" fill="#cbd5e1" stroke="#94a3b8" />
    </svg>
  ),
  StructuralPlatform: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
      <rect x="10" y="60" width="80" height="5" fill="#94a3b8" />
      <path d="M20 65 L20 95 M80 65 L80 95" stroke="#64748b" strokeWidth="2" />
    </svg>
  ),
  RotaryValve: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
      <circle cx="50" cy="50" r="30" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
      <path d="M50 20 L50 80 M20 50 L80 50 M28 28 L72 72 M28 72 L72 28" stroke="#94a3b8" strokeWidth="1" />
      <rect x="75" y="40" width="15" height="20" rx="2" fill="#475569" />
    </svg>
  ),
  VibratingScreen: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
      <rect x="20" y="30" width="60" height="25" rx="2" fill="#e2e8f0" stroke="#94a3b8" />
      <path d="M20 42 L80 42" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2,2" />
      <path d="M30 55 L25 75 M70 55 L75 75" stroke="#64748b" strokeWidth="3" />
    </svg>
  ),
  DiverterValve: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
      <path d="M50 20 L50 45 L25 80 M50 45 L75 80" fill="none" stroke="#94a3b8" strokeWidth="15" strokeLinecap="round" />
      <circle cx="50" cy="45" r="10" fill="#3b82f6" fillOpacity="0.2" />
    </svg>
  ),
  Hopper: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
      <path d="M20 20 L80 20 L65 70 L35 70 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
      <rect x="35" y="70" width="30" height="10" fill="#cbd5e1" />
    </svg>
  ),
  VacuumConveyor: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
      <rect x="35" y="10" width="30" height="60" rx="15" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
      <path d="M35 30 L15 45" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
      <circle cx="50" cy="15" r="5" fill="#3b82f6" />
    </svg>
  ),
  LossInWeight: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
      <rect x="20" y="75" width="60" height="10" rx="1" fill="#475569" />
      <rect x="30" y="15" width="40" height="40" rx="2" fill="#e2e8f0" stroke="#94a3b8" />
      <rect x="25" y="55" width="50" height="15" fill="#cbd5e1" stroke="#94a3b8" />
      <path d="M30 75 L30 65 M70 75 L70 65" stroke="#3b82f6" strokeWidth="2" />
    </svg>
  ),
  TubularConveyor: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
      <path d="M15 30 L85 30 Q90 30 90 35 L90 65 Q90 70 85 70 L15 70 Q10 70 10 65 L10 35 Q10 30 15 30" fill="none" stroke="#94a3b8" strokeWidth="8" />
      <circle cx="15" cy="50" r="10" fill="#cbd5e1" stroke="#94a3b8" />
      <circle cx="85" cy="50" r="10" fill="#cbd5e1" stroke="#94a3b8" />
    </svg>
  ),
  ControlPanel: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
      <rect x="25" y="10" width="50" height="80" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
      <rect x="35" y="25" width="30" height="20" rx="1" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" />
      <circle cx="40" cy="55" r="3" fill="#ef4444" />
      <circle cx="50" cy="55" r="3" fill="#22c55e" />
      <circle cx="60" cy="55" r="3" fill="#f59e0b" />
      <path d="M30 75 L70 75 M30 80 L70 80" stroke="#94a3b8" strokeWidth="1" />
    </svg>
  ),
  PipelineAnalysis: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
      <path d="M10 20 C40 20, 60 80, 90 80" fill="none" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round" />
      <path d="M10 20 C40 20, 60 80, 90 80" fill="none" stroke="url(#flowGradient)" strokeWidth="8" strokeLinecap="round" />
      <defs>
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      <circle cx="25" cy="20" r="2" fill="white" fillOpacity="0.8">
        <animate attributeName="cx" from="10" to="90" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
};

// --- 流程步驟資料 ---
const processSteps = [
  {
    id: "step-infeed",
    title: "高效進料",
    target: "infeed",
    icon: <Upload size={24} />,
    desc: "太空包與手動多元投料系統",
    color: "bg-blue-500"
  },
  {
    id: "step-convey",
    title: "氣動輸送",
    target: "conveying_dnu",
    icon: <RotateCw size={24} />,
    desc: "密閉式低背壓長距離輸送",
    color: "bg-sky-500"
  },
  {
    id: "step-mix",
    title: "均化攪拌",
    target: "mixer",
    icon: <Layers size={24} />,
    desc: "螺旋同步輸送與物料均化",
    color: "bg-indigo-500"
  },
  {
    id: "step-meter",
    title: "精密計量",
    target: "metering",
    icon: <Gauge size={24} />,
    desc: "高精度配比與流量監測",
    color: "bg-blue-600"
  },
  {
    id: "step-clean",
    title: "端點環保",
    target: "dust",
    icon: <Wind size={24} />,
    desc: "旋風分離與自動脈衝集塵",
    color: "bg-cyan-600"
  },
  {
    id: "step-control",
    title: "系統中控",
    target: "control_panel",
    icon: <Terminal size={24} />,
    desc: "PLC 邏輯控制與人機協作",
    color: "bg-blue-900"
  }
];

// --- 產品資料集 (17 項) ---
const initialProducts = [
  {
    id: "infeed",
    cat: "1. 進料 (Infeed)",
    title: "太空包投料站",
    subtitle: "Bulk Bag Unloading Station",
    Graphic: MachineryGraphics.BulkBagStation,
    advantages: ["單人操作節省人力", "全密封防止粉塵外洩", "選配振動器確保流動", "支援多種物料規格"]
  },
  {
    id: "hopper",
    cat: "1. 進料 (Infeed)",
    title: "手動投料斗",
    subtitle: "Manual Dumping Station",
    Graphic: MachineryGraphics.Hopper,
    advantages: ["人體工學設計", "內置簡易過濾網", "可與集塵系統連動", "不鏽鋼鏡面處理"]
  },
  {
    id: "conveying_dnu",
    cat: "2. 輸送 (Conveying)",
    title: "DNU/SNU 輸送裝置",
    subtitle: "無背壓氣動輸送革新",
    Graphic: MachineryGraphics.Venturi,
    advantages: ["獨特微負壓設計", "可取代傳統迴轉閥", "大幅減少系統背壓", "耐磨損長效運轉"]
  },
  {
    id: "rcu_air",
    cat: "2. 輸送 (Conveying)",
    title: "RCU 空氣輸送機",
    subtitle: "RCU Pneumatic Conveying System",
    Graphic: MachineryGraphics.RCUAIR,
    advantages: ["密閉高壓循環技術", "適合長距離穩定輸送", "物料破損率極低", "氣體消耗量低、高節能"]
  },
  {
    id: "tubular",
    cat: "2. 輸送 (Conveying)",
    title: "管鏈輸送機",
    subtitle: "Tubular Cable & Chain Conveyor",
    Graphic: MachineryGraphics.TubularConveyor,
    advantages: ["3D 空間任意佈局", "超低能耗運行", "物料輸送溫和無破損", "完全密閉無粉塵外洩"]
  },
  {
    id: "rotary_valve",
    cat: "2. 輸送 (Conveying)",
    title: "迴轉閥 (Rotary Valve)",
    subtitle: "精密氣鎖與定量給料",
    Graphic: MachineryGraphics.RotaryValve,
    advantages: ["高氣密性設計", "多種葉片型式可選", "具防咬料保護功能", "耐壓差性能優異"]
  },
  {
    id: "vacuum",
    cat: "2. 輸送 (Conveying)",
    title: "真空吸料機",
    subtitle: "Vacuum Conveyor System",
    Graphic: MachineryGraphics.VacuumConveyor,
    advantages: ["全密閉管道輸送", "體積小節省空間", "模組化濾芯自動清潔", "適合多點投料需求"]
  },
  {
    id: "mixer",
    cat: "2. 輸送 (Conveying)",
    title: "螺旋輸送機含攪拌機",
    subtitle: "輸送與均化一體化方案",
    Graphic: MachineryGraphics.ScrewConveyor,
    advantages: ["輸送與攪拌同步完成", "有效防止粉體架橋", "結構緊湊節省空間", "支援模組化長度擴展"]
  },
  {
    id: "diverter",
    cat: "2. 輸送 (Conveying)",
    title: "雙路切換閥",
    subtitle: "多路徑流道切換裝置",
    Graphic: MachineryGraphics.DiverterValve,
    advantages: ["平滑內壁無死角", "氣動快速切換", "極低物料殘留", "耐磨損不鏽鋼閥瓣"]
  },
  {
    id: "metering",
    cat: "3. 製程 (Processing)",
    title: "計量桶 (Metering Tank)",
    subtitle: "精準配比之核心工藝",
    Graphic: MachineryGraphics.MeteringTank,
    advantages: ["超高計量精度 (1/1000)", "支援 50L 至 1000L", "全不鏽鋼潔淨設計", "易於連結自動控制系統"]
  },
  {
    id: "loss_in_weight",
    cat: "3. 製程 (Processing)",
    title: "失重式供料機",
    subtitle: "Loss-in-Weight Feeder",
    Graphic: MachineryGraphics.LossInWeight,
    advantages: ["動態連續稱重補償", "適用於微量精準添加", "全封閉防干擾結構", "數位化智慧控制界面"]
  },
  {
    id: "cyclone",
    cat: "3. 製程 (Processing)",
    title: "旋風分離器",
    subtitle: "高效氣粉分離組件",
    Graphic: MachineryGraphics.Cyclone,
    advantages: ["去除 5~10μm 以上粉塵", "無活動部件維護極簡", "耐高溫高壓適合惡劣環境", "作為輸送末端氣固分離"]
  },
  {
    id: "screen",
    cat: "3. 製程 (Processing)",
    title: "高效振動篩",
    subtitle: "物料分級與雜質過濾",
    Graphic: MachineryGraphics.VibratingScreen,
    advantages: ["多層篩網同時作業", "低噪音高性能電機", "密封設計防止粉塵擴散", "快速拆裝清洗方便"]
  },
  {
    id: "dust",
    cat: "4. 環境 (Environmental)",
    title: "集塵機 (Dust Collector)",
    subtitle: "維護產線潔淨與安全",
    Graphic: MachineryGraphics.DustCollector,
    advantages: ["多層高效過濾濾材", "氣動脈衝自動清灰", "高效能渦輪穩定吸力", "模組化易維護結構"]
  },
  {
    id: "control_panel",
    cat: "5. 自動化 (Automation)",
    title: "智慧中央控制盤",
    subtitle: "Industrial PLC & HMI System",
    Graphic: MachineryGraphics.ControlPanel,
    advantages: ["PLC 邏輯程序自動化控制", "HMI 直觀人機圖形介面", "支援遠端監控與大數據分析", "符合 CE/UL 工業配線標準"]
  },
  {
    id: "pipeline_analysis",
    cat: "6. 工程服務 (Engineering)",
    title: "管路壓力與流場分析",
    subtitle: "Advanced CFD Flow Simulation",
    Graphic: MachineryGraphics.PipelineAnalysis,
    advantages: ["精準模擬氣固兩相流運動", "預測管路易磨損與死角區域", "最佳化風量與輸送壓降", "大幅降低堵料風險與能耗"]
  },
  {
    id: "platform",
    cat: "7. 整合 (Integration)",
    title: "客製化設備鋼構架台",
    subtitle: "穩固系統的基礎基石",
    Graphic: MachineryGraphics.StructuralPlatform,
    advantages: ["依廠房空間量身打造", "高強度鋼材確保載重安全", "模組化設計快速安裝", "整合多項設備之基礎架構"]
  }
];

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [productImages, setProductImages] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadId) {
      const imageUrl = URL.createObjectURL(file);
      setProductImages(prev => ({ ...prev, [activeUploadId]: imageUrl }));
    }
  };

  const triggerUpload = (id: string) => {
    setActiveUploadId(id);
    fileInputRef.current?.click();
  };

  const removeImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProductImages(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-sky-50 font-sans text-slate-800 antialiased">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/png, image/jpeg" 
        onChange={handleFileChange}
      />

      {/* 背景裝飾 */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-200 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-200 blur-[120px] rounded-full"></div>
      </div>

      {/* 導覽列 */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md py-3 border-b border-blue-100 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <Logo className="w-10 h-10" />
            <div className="flex flex-col">
              <span className="font-black text-xl text-blue-900 leading-tight tracking-tighter">錕興機械</span>
              <span className="text-[8px] font-bold tracking-[0.2em] text-blue-400 uppercase">Kun Xing Industrial</span>
            </div>
          </div>
          <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-500">
             <button onClick={() => scrollTo('process')} className="hover:text-blue-600 transition-colors">工藝流程</button>
             <button onClick={() => scrollTo('products')} className="hover:text-blue-600 transition-colors">產品系列</button>
             <button onClick={() => scrollTo('contact')} className="bg-blue-600 text-white px-8 py-3 rounded-full text-xs shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">聯絡專家</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative min-h-[85vh] flex items-center pt-24 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-100/50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-10 border border-blue-200/50">
              Smart Automation for Bulk Handling
            </div>
            <h1 className="text-6xl lg:text-9xl font-black mb-12 leading-[0.9] tracking-tighter text-blue-950">
              工業粉體<br/><span className="text-blue-600 italic">智慧解決方案</span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto font-medium leading-relaxed">
              深耕氣動輸送與精密計量技術，為您打造低粉塵、高效率、全自動化的智慧工廠。
            </p>
            <div className="flex justify-center gap-6">
              <button onClick={() => scrollTo('process')} className="px-12 py-6 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 shadow-2xl transition-all flex items-center gap-4 group">
                了解工藝流程 <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* 工業流程區塊 */}
      <section id="process" className="py-32 relative z-10 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="mb-24 text-center">
            <h2 className="text-5xl font-black text-blue-950 mb-8 tracking-tighter">智慧工藝流程</h2>
            <div className="h-2 w-32 bg-blue-600 mx-auto rounded-full mb-6"></div>
            <p className="text-blue-400 font-black uppercase tracking-[0.4em] text-xs">Integrated Smart Process Path</p>
          </div>

          <div className="relative flex flex-col md:flex-row justify-between items-start gap-8 max-w-7xl mx-auto">
            {/* 連接線 (Desktop) */}
            <div className="absolute top-1/3 left-0 w-full h-1 bg-blue-100 hidden md:block z-0">
               <motion.div 
                 initial={{ width: 0 }}
                 whileInView={{ width: '100%' }}
                 transition={{ duration: 2, ease: "easeInOut" }}
                 className="h-full bg-blue-500 relative"
               >
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
               </motion.div>
            </div>

            {processSteps.map((step, index) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                onClick={() => scrollTo(step.target)}
                className="relative z-10 w-full md:flex-1 group cursor-pointer"
              >
                <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white shadow-xl hover:shadow-2xl transition-all group-hover:-translate-y-4 h-full">
                  <div className={`w-16 h-16 ${step.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 transition-transform`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-black text-blue-950 mb-3">{step.title}</h3>
                  <p className="text-slate-500 text-xs font-bold leading-relaxed">{step.desc}</p>
                </div>
                
                {/* 手機版箭頭 */}
                {index < processSteps.length - 1 && (
                  <div className="flex justify-center my-6 md:hidden">
                    <MoveRight size={32} className="text-blue-300 rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 產品展示區 */}
      <section id="products" className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="mb-24 text-center">
            <h2 className="text-5xl lg:text-6xl font-black text-blue-950 mb-8 tracking-tighter">全方位設備目錄</h2>
            <div className="h-2 w-32 bg-blue-600 mx-auto rounded-full mb-6"></div>
            <p className="text-blue-400 font-black uppercase tracking-[0.4em] text-xs">Full Spectrum Equipment Catalog</p>
          </div>

          <div className="grid grid-cols-1 gap-16 max-w-6xl mx-auto">
            {initialProducts.map((p) => (
              <motion.div 
                key={p.id} 
                id={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="bg-white p-10 lg:p-16 rounded-[4rem] border border-blue-50/50 shadow-sm hover:shadow-2xl transition-all relative group"
              >
                <div className="relative z-10 flex flex-col lg:flex-row gap-14 items-center">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-blue-100">
                      {p.cat}
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-black text-blue-950 mb-6 tracking-tight leading-tight">{p.title}</h3>
                    <p className="text-xl text-blue-600/60 font-bold mb-10 italic">{p.subtitle}</p>
                    
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-10">
                      {p.advantages.map((adv, i) => (
                        <li key={i} className="flex gap-4 text-slate-600 font-semibold text-lg items-start">
                          <CheckCircle2 size={24} className="text-blue-500 shrink-0 mt-1" /> 
                          <span className="leading-snug">{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 影像展示區 */}
                  <div 
                    onClick={() => triggerUpload(p.id)}
                    className="lg:w-[42%] w-full aspect-square rounded-[3.5rem] bg-slate-50 border-2 border-dashed border-blue-100 flex items-center justify-center p-10 transition-all relative overflow-hidden cursor-pointer hover:bg-blue-50/50 group/img shadow-inner"
                  >
                    <AnimatePresence mode="wait">
                      {productImages[p.id] ? (
                        <motion.div 
                          key="image"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="w-full h-full relative flex items-center justify-center"
                        >
                          <img 
                            src={productImages[p.id]} 
                            alt={p.title} 
                            className="max-w-full max-h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.12)]"
                          />
                          <button 
                            onClick={(e) => removeImage(p.id, e)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-3 rounded-2xl shadow-xl opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X size={20} />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="placeholder"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center w-full"
                        >
                          <div className="mb-10 mx-auto w-32 h-32 transform group-hover/img:scale-110 transition-transform duration-500">
                            <p.Graphic />
                          </div>
                          <div className="flex flex-col items-center gap-3 text-blue-400">
                            <Upload size={36} />
                            <span className="text-xs font-black uppercase tracking-widest">點擊上傳設備照片</span>
                            <span className="text-[10px] opacity-40 font-bold uppercase tracking-[0.2em]">PNG / JPG Only</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 頁尾聯絡資訊 */}
      <footer id="contact" className="py-40 bg-blue-950 text-white relative">
        <div className="container mx-auto px-6 text-center">
          <Logo className="w-24 h-24 mx-auto mb-12 opacity-30" />
          <h2 className="text-5xl lg:text-7xl font-black mb-16 tracking-tighter italic uppercase">Let's Build Together</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto mb-24">
             <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 hover:border-blue-500/30 transition-all group">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform"><Phone size={28} /></div>
                <div className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">聯絡專線</div>
                <div className="text-2xl font-black">03-9908036</div>
             </div>
             <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 hover:border-blue-500/30 transition-all group">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 group-hover:scale-110 transition-transform"><MapPin size={28} /></div>
                <div className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">工廠地址</div>
                <div className="text-lg font-bold leading-tight opacity-90">宜蘭縣五結鄉利工一路二段116巷15號</div>
             </div>
             <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 hover:border-blue-500/30 transition-all group">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform"><Mail size={28} /></div>
                <div className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">商務信箱</div>
                <div className="text-xl font-mono text-blue-200">zack31717@gmail.com</div>
             </div>
          </div>
          
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white/40">
              <Hash size={16} className="text-blue-500" /> 統一編號: 29113377
            </div>
            <div className="text-[10px] opacity-20 font-black uppercase tracking-[0.5em]">
              © 2024 KUN XING MACHINERY CO., LTD. DESIGNED FOR EXCELLENCE.
            </div>
          </div>
        </div>
      </footer>

      {/* 浮動按鈕 */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-12 right-12 w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-blue-700 transition-all active:scale-95 z-50 border border-blue-500 shadow-blue-600/30"
      >
        <ArrowUp size={32} />
      </button>
    </div>
  );
};

export default App;
