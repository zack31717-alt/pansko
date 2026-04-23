import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Users, ShoppingCart, TrendingUp, Bell, Zap, Target,
  BarChart3, MessageSquare, Gift, Star, ArrowRight, ChevronDown,
  Sparkles, Database, RefreshCw, Eye, Filter, Heart, Clock,
  MapPin, Smartphone, Shield, CheckCircle, Play, Pause,
  ArrowUpRight, ChevronRight, Activity, Layers, Settings2,
  Cpu, Network, Workflow, Bot, LineChart, PieChart, Award,
  AlertCircle, Mail, Tag, Repeat, UserCheck, Lightbulb,
} from 'lucide-react';

// ─── 顏色系統 ───────────────────────────────────────────────
const C = {
  primary: '#7C3AED',
  accent:  '#06B6D4',
  success: '#10B981',
  warn:    '#F59E0B',
  danger:  '#EF4444',
};

// ─── 動畫數字 ───────────────────────────────────────────────
const AnimatedNumber = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const t = setInterval(() => {
          start += step;
          if (start >= target) { setVal(target); clearInterval(t); }
          else setVal(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
};

// ─── AI 流程節點 ─────────────────────────────────────────────
const FlowNode = ({
  icon: Icon, label, color, desc, step, active, onClick,
}: {
  icon: React.ElementType; label: string; color: string;
  desc: string; step: number; active: boolean; onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all cursor-pointer text-center w-full
      ${active ? 'border-violet-500 bg-violet-50 shadow-xl shadow-violet-200' : 'border-slate-200 bg-white hover:border-violet-300'}`}
  >
    <div className="absolute -top-3 left-4 px-2 py-0.5 rounded-full text-[9px] font-black text-white"
      style={{ background: color }}>
      STEP {step}
    </div>
    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
      style={{ background: active ? color : '#f1f5f9' }}>
      <Icon size={22} color={active ? '#fff' : color} />
    </div>
    <div className="text-sm font-black text-slate-800">{label}</div>
    <div className="text-[11px] text-slate-500 leading-relaxed">{desc}</div>
  </motion.button>
);

// ─── 場景卡 ───────────────────────────────────────────────────
const ScenarioCard = ({
  icon: Icon, title, tag, color, trigger, action, result, kpi,
}: {
  icon: React.ElementType; title: string; tag: string; color: string;
  trigger: string; action: string; result: string; kpi: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left"
      >
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: color + '18' }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-black text-slate-800">{title}</span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black text-white"
              style={{ background: color }}>{tag}</span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">{kpi}</div>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
              {[
                { label: '🎯 觸發條件', text: trigger, bg: '#faf5ff' },
                { label: '⚡ AI 動作', text: action, bg: '#ecfdf5' },
                { label: '📈 預期結果', text: result, bg: '#eff6ff' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl p-3 text-left" style={{ background: item.bg }}>
                  <div className="text-[10px] font-black text-slate-500 mb-1">{item.label}</div>
                  <div className="text-xs text-slate-700 font-medium leading-relaxed">{item.text}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── 會員旅程流程 ─────────────────────────────────────────────
const JourneyStep = ({
  phase, icon: Icon, color, title, aiAction, delay,
}: {
  phase: string; icon: React.ElementType; color: string;
  title: string; aiAction: string; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="flex flex-col items-center gap-3 relative"
  >
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white"
      style={{ background: color }}>
      <Icon size={28} color="#fff" />
    </div>
    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{phase}</div>
    <div className="text-sm font-black text-slate-800 text-center">{title}</div>
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center max-w-[130px]">
      <Bot size={12} className="text-violet-500 mx-auto mb-1" />
      <div className="text-[10px] text-slate-600 font-medium leading-snug">{aiAction}</div>
    </div>
  </motion.div>
);

// ─── 儀表板預覽 ───────────────────────────────────────────────
const DashboardPreview = () => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTime(p => p + 1), 2000);
    return () => clearInterval(t);
  }, []);

  const bars = [42, 67, 55, 88, 73, 91, 60, 78, 84, 96, 70, 65];
  const alerts = [
    { text: '會員 #A4521 即將流失', type: 'warn', time: '1分鐘前' },
    { text: '高價值客群優惠點擊率 +34%', type: 'success', time: '3分鐘前' },
    { text: '週末補貨提醒已觸發', type: 'info', time: '5分鐘前' },
  ];

  return (
    <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-2xl font-mono text-xs select-none">
      {/* 頂部狀態列 */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-[10px] font-bold">AI AGENT ACTIVE</span>
        </div>
        <div className="flex gap-1.5">
          {['#ef4444', '#f59e0b', '#22c55e'].map((c, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* KPI 數字 */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: '活躍會員', val: '128,457', change: '+2.3%', up: true },
          { label: '今日轉換', val: '3,842', change: '+8.1%', up: true },
          { label: '平均客單', val: 'NT$487', change: '-1.2%', up: false },
          { label: '推薦精準率', val: '91.4%', change: '+4.7%', up: true },
        ].map((item) => (
          <div key={item.label} className="bg-slate-900 rounded-xl p-3 border border-slate-800">
            <div className="text-slate-500 text-[9px] mb-1">{item.label}</div>
            <div className="text-white font-black text-sm">{item.val}</div>
            <div className={`text-[9px] font-bold ${item.up ? 'text-green-400' : 'text-red-400'}`}>
              {item.change}
            </div>
          </div>
        ))}
      </div>

      {/* 橫條圖 */}
      <div className="bg-slate-900 rounded-xl p-4 mb-4 border border-slate-800">
        <div className="text-slate-400 text-[9px] mb-3 font-bold">會員消費趨勢（過去12月）</div>
        <div className="flex items-end gap-1 h-16">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              className="flex-1 rounded-sm"
              style={{ background: `linear-gradient(to top, ${C.primary}, ${C.accent})` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {['一','二','三','四','五','六','七','八','九','十','十一','十二'].map(m => (
            <div key={m} className="text-slate-600 text-[8px]">{m}</div>
          ))}
        </div>
      </div>

      {/* AI 警報 */}
      <div className="space-y-2">
        {alerts.map((a, i) => (
          <motion.div
            key={i}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.15 + time * 0 }}
            className="flex items-center gap-3 bg-slate-900 rounded-lg px-3 py-2 border border-slate-800"
          >
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              a.type === 'warn' ? 'bg-amber-400 animate-pulse' :
              a.type === 'success' ? 'bg-green-400' : 'bg-cyan-400'
            }`} />
            <span className="text-slate-300 text-[10px] flex-1">{a.text}</span>
            <span className="text-slate-600 text-[9px]">{a.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─── 主頁面 ───────────────────────────────────────────────────
const CrmPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const agentSteps = [
    {
      icon: Database,
      label: '資料整合',
      color: C.accent,
      desc: '整合 POS、APP、電商、LINE OA 全通路行為資料',
    },
    {
      icon: Brain,
      label: 'AI 洞察分析',
      color: C.primary,
      desc: '自動建立 RFM 模型、購買週期、流失預測',
    },
    {
      icon: Target,
      label: '智慧分群',
      color: C.warn,
      desc: '動態細分高價值、忠誠、沉睡、高流失風險族群',
    },
    {
      icon: Zap,
      label: '自動化觸發',
      color: C.success,
      desc: '依行為事件自動發送個人化推播、優惠與任務',
    },
    {
      icon: BarChart3,
      label: '效益回饋',
      color: C.danger,
      desc: '即時追蹤活動 ROI，持續優化推薦演算法',
    },
  ];

  const stepDetails = [
    {
      title: '全通路數據整合中樞',
      desc: '將分散在 POS 收銀系統、電商平台、APP、LINE OA、WiFi 探針等所有接觸點的行為資料，統一匯流至會員數據平台（CDP）。AI Agent 自動清洗、去重、關聯跨裝置身份，建立 360° 會員輪廓。',
      items: ['POS 交易紀錄即時同步', 'APP 瀏覽與搜尋行為', 'LINE OA 互動訊息', '電商購買與退貨紀錄', 'WiFi 門市到訪偵測', '社群媒體互動資料'],
      scenario: '情境：同一位顧客在門市用現金購買有機蔬菜，又在 APP 下單保健食品，AI 自動辨識為同一人並合併輪廓，標記為「有機健康族」。',
    },
    {
      title: 'AI 深度洞察引擎',
      desc: '不只是傳統 RFM，AI Agent 自動執行多維度分析：購買週期預測、品類偏好向量、生活場景推斷、價格敏感度評分、健康偏好分析。每 6 小時自動更新模型。',
      items: ['RFM + 購買週期複合評分', '機器學習流失預測 (AUC > 0.88)', '品類交叉購買關聯規則', '個人化價格敏感度建模', '季節性行為模式分析', '家庭成員數與消費結構推斷'],
      scenario: '情境：AI 偵測到會員 A 最近 3 週沒消費（以往每週來），且上次購買時間在颱風前。Agent 立即標記為「可能流失」並觸發挽留任務。',
    },
    {
      title: '動態智慧分群系統',
      desc: 'AI 不以靜態標籤分群，而是依據即時行為與預測模型動態調整群組。每位會員的群組每日自動更新，確保行銷訊息永遠對準當下狀態。',
      items: ['高價值 VIP（前 20% 貢獻 60% 營收）', '有機健康生活族', '家庭主購者（每週固定補貨）', '週末限定來客', '對折扣高度敏感族', '流失風險 30 天預警群'],
      scenario: '情境：週四下午，AI 自動找出「週末常客但本週未開啟 APP」的 3,200 名會員，標記為「本週末低到訪風險」並準備推播任務。',
    },
    {
      title: '個人化自動觸發引擎',
      desc: 'AI Agent 根據預設的決策樹與機器學習模型，在最適合的時機、透過最合適的管道，自動發送高度個人化的訊息與優惠。無需人工逐一操作。',
      items: ['購買週期到期前 2 天自動提醒', '點數即將到期緊迫推播', '天氣連動商品推薦（涼感/暖冬）', '新品到貨定向通知（依偏好）', '生日月份專屬禮遇', '流失預警挽留優惠序列'],
      scenario: '情境：颱風警報發布後 30 分鐘，AI 自動向「台北地區家庭主購者」推播「颱風備糧清單＋門市庫存提示」，開信率達 67%。',
    },
    {
      title: '效益追蹤與自我優化',
      desc: 'AI Agent 持續追蹤每個行銷動作的實際轉換率與 ROI，並透過 A/B 測試框架自動優化文案、時機、管道組合。形成持續學習的飛輪效應。',
      items: ['每次活動自動產出 ROI 報告', 'A/B 測試自動判勝與應用', '推薦點擊率持續迭代優化', '各群組 LTV（終身價值）追蹤', '超市門市坪效與會員到訪關聯分析', '競品促銷期反制策略建議'],
      scenario: '情境：AI 發現週五晚上 7-9 點推播的挽留優惠，回購率比週一早上高出 2.3 倍，自動將此規則固化為標準策略。',
    },
  ];

  const scenarios = [
    {
      icon: Heart,
      title: '沉睡會員喚醒',
      tag: '挽留',
      color: C.danger,
      kpi: '預期喚醒率 18-25%',
      trigger: '會員 90 天未消費，且歷史消費頻率 > 每月一次',
      action: 'AI 產生個人化「我們好久不見」訊息，附上依其偏好品類的專屬折扣券',
      result: '挽留成功率提升 2.4×，較人工群發高出 65%',
    },
    {
      icon: ShoppingCart,
      title: '購物車放棄追蹤',
      tag: '轉換',
      color: C.warn,
      kpi: '追回率提升 +31%',
      trigger: 'APP/電商加入購物車但未結帳超過 2 小時',
      action: 'AI 依商品品類與會員等級自動推送「幫你留著了」＋限時折扣提醒',
      result: '購物車結帳率從 34% 提升至 45%',
    },
    {
      icon: Award,
      title: '高價值客群深耕',
      tag: 'VIP',
      color: C.primary,
      kpi: 'VIP 留存率 +12%',
      trigger: '月消費 NT$5,000 以上，連續 3 個月',
      action: '自動升等 VIP 並通知，附帶專屬到府服務、新品優先試用邀請',
      result: 'VIP 客群 LTV 年增 NT$28,000/人',
    },
    {
      icon: Tag,
      title: '品類交叉銷售',
      tag: '增購',
      color: C.accent,
      kpi: '客單提升 +NT$89',
      trigger: '購買有機蔬菜但 30 天內未購買有機零食或健康飲品',
      action: 'AI 分析購買序列，推薦「有機健康族最愛搭配」個人化組合',
      result: '交叉購買率從 12% 提升至 27%',
    },
    {
      icon: Clock,
      title: '補貨週期智慧提醒',
      tag: '保留',
      color: C.success,
      kpi: '回購週期縮短 3 天',
      trigger: 'AI 預測會員慣用商品（衛生紙、牛奶等）即將用罄',
      action: '在預測耗盡前 2 天推播「補貨提醒＋免運優惠」',
      result: '補貨型客群月均消費提升 23%',
    },
    {
      icon: Gift,
      title: '生日月份禮遇序列',
      tag: '體驗',
      color: '#EC4899',
      kpi: '生日月消費 +68%',
      trigger: '生日前 7 天自動觸發，依消費等級決定禮遇層級',
      action: 'AI 選出最可能兌換的品類折扣，並安排生日當天門市驚喜任務',
      result: '生日月轉換率 82%，是非生日月的 3.1 倍',
    },
    {
      icon: MapPin,
      title: '門市到訪促活',
      tag: '到訪',
      color: '#8B5CF6',
      kpi: '到訪率提升 +15%',
      trigger: 'GPS/WiFi 偵測會員出現在超市 500 公尺範圍內',
      action: 'AI 即時推播「今日限定閃購」與現場獨家商品，引導入店',
      result: '地理觸發轉換率 41%，是廣播推播的 4 倍',
    },
    {
      icon: Repeat,
      title: '訂閱制智慧推薦',
      tag: '訂閱',
      color: C.warn,
      kpi: '訂閱轉換率 +22%',
      trigger: '連續 4 週以上購買同一商品（牛奶、蛋、咖啡豆等）',
      action: 'AI 推薦轉為「定期配送訂閱方案」，並計算預期節省金額',
      result: '訂閱戶月均 LTV 比一般會員高 NT$1,200',
    },
  ];

  const journeySteps = [
    {
      phase: '初次接觸',
      icon: Smartphone,
      color: C.accent,
      title: '無感加入',
      aiAction: '掃碼即入會，AI 即時建立偏好輪廓',
    },
    {
      phase: '早期互動',
      icon: Lightbulb,
      color: C.primary,
      title: '新人引導',
      aiAction: '個人化歡迎任務，引導首購高利潤品',
    },
    {
      phase: '習慣養成',
      icon: Repeat,
      color: C.warn,
      title: '補貨節奏',
      aiAction: '學習購買週期，準時推送補貨提醒',
    },
    {
      phase: '深度綁定',
      icon: Heart,
      color: '#EC4899',
      title: '情感連結',
      aiAction: '生日禮遇、偏好新品優先通知',
    },
    {
      phase: '高價值',
      icon: Award,
      color: C.success,
      title: 'VIP 升等',
      aiAction: '專屬服務通道、到府購物邀請',
    },
    {
      phase: '口碑擴散',
      icon: Users,
      color: C.danger,
      title: '推薦裂變',
      aiAction: 'AI 挑選最佳時機邀請分享，社群獎勵機制',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-violet-100">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-20 pb-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }} />
          {/* 網格 */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border"
                style={{ background: '#7C3AED22', borderColor: '#7C3AED44', color: '#A78BFA' }}>
                <Sparkles size={12} /> AI Agentic CRM System for Specialty Supermarkets
              </div>
              <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tighter mb-6">
                讓每位顧客感覺<br />
                <span style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  超市只為他而存在
                </span>
              </h1>
              <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10 max-w-xl">
                針對型連鎖超市設計的 AI Agentic 會員系統——不只是 CRM，而是一個能主動思考、自動行動、持續學習的數位大腦，將每筆消費資料轉化為下一次回購的精準燃料。
              </p>

              {/* 數字 */}
              <div className="grid grid-cols-3 gap-6 max-w-lg">
                {[
                  { val: 34, suffix: '%', label: '回購率提升' },
                  { val: 91, suffix: '%', label: '推薦精準率' },
                  { val: 2.4, suffix: '×', label: '挽留效率' },
                ].map((item) => (
                  <div key={item.label} className="text-left">
                    <div className="text-4xl font-black"
                      style={{ background: 'linear-gradient(135deg, #A78BFA, #67E8F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {typeof item.val === 'number' && Number.isInteger(item.val)
                        ? <AnimatedNumber target={item.val} suffix={item.suffix} />
                        : `${item.val}${item.suffix}`}
                    </div>
                    <div className="text-slate-500 text-xs font-bold mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <DashboardPreview />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 痛點 vs 解方 ─────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black tracking-tighter mb-4">傳統 CRM 的困境</h2>
            <p className="text-slate-500 font-medium">針對型超市面臨的真實挑戰，與 AI Agentic 系統的解法</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                pain: '資料孤島：POS、APP、官網各自獨立，無法串聯會員行為',
                solve: '統一 CDP 整合全通路，AI 自動匹配跨裝置身份',
              },
              {
                pain: '人工分群費時：行銷人員靠感覺切群，準確率低、更新慢',
                solve: 'AI 即時動態分群，每日自動更新，精準率 > 90%',
              },
              {
                pain: '廣播式推播：全員同樣訊息，開信率不到 5%',
                solve: '個人化 1 對 1 觸發訊息，開信率提升至 30-45%',
              },
              {
                pain: '流失後才知道：顧客已消失才察覺，挽回成本極高',
                solve: 'AI 提前 30 天預測流失風險，主動介入成本降低 70%',
              },
              {
                pain: '活動 ROI 不明：做了很多促銷，但不知道哪些真正有效',
                solve: '每次觸發自動追蹤轉換，A/B 測試持續優化策略',
              },
              {
                pain: '季節性備貨失準：過量採購導致損耗，缺貨流失來客',
                solve: 'AI 分析會員購買週期，結合天氣、節慶預測需求量',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-5 border-b border-slate-100 flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700 font-medium">{item.pain}</p>
                </div>
                <div className="p-5 flex items-start gap-3 bg-green-50">
                  <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-green-800 font-semibold">{item.solve}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Agent 核心流程 ────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter mb-4">AI Agent 五步驟核心流程</h2>
            <p className="text-slate-500 font-medium">點選每個步驟，查看詳細說明與應用情境</p>
          </div>

          {/* 流程節點 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12 max-w-5xl mx-auto">
            {agentSteps.map((step, i) => (
              <div key={i} className="relative">
                <FlowNode
                  {...step}
                  step={i + 1}
                  active={activeStep === i}
                  onClick={() => setActiveStep(i)}
                />
                {i < agentSteps.length - 1 && (
                  <ChevronRight
                    size={20}
                    className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-300 z-10"
                  />
                )}
              </div>
            ))}
          </div>

          {/* 詳細說明卡 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto bg-slate-50 rounded-3xl border border-slate-200 p-8 md:p-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest mb-3"
                    style={{ color: agentSteps[activeStep].color }}>
                    STEP {activeStep + 1} · {agentSteps[activeStep].label}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">
                    {stepDetails[activeStep].title}
                  </h3>
                  <p className="text-slate-600 font-medium leading-relaxed mb-6 text-sm">
                    {stepDetails[activeStep].desc}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {stepDetails[activeStep].items.map((item, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: agentSteps[activeStep].color }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="rounded-2xl p-6 border-2"
                    style={{ background: agentSteps[activeStep].color + '0d', borderColor: agentSteps[activeStep].color + '33' }}>
                    <div className="flex items-center gap-2 mb-4">
                      <Bot size={18} style={{ color: agentSteps[activeStep].color }} />
                      <span className="text-xs font-black text-slate-600 uppercase tracking-widest">實際應用情境</span>
                    </div>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                      {stepDetails[activeStep].scenario}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── 會員旅程地圖 ─────────────────────────────────────── */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter mb-4">AI 驅動的會員生命週期旅程</h2>
            <p className="text-slate-400 font-medium">從陌生人到品牌大使，AI Agent 全程陪伴每個關鍵時刻</p>
          </div>

          {/* 旅程線 */}
          <div className="relative max-w-6xl mx-auto">
            <div className="absolute top-8 left-0 w-full h-0.5 hidden lg:block"
              style={{ background: 'linear-gradient(to right, #06B6D4, #7C3AED, #EC4899, #10B981)' }} />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
              {journeySteps.map((step, i) => (
                <JourneyStep key={i} {...step} delay={i * 0.1} />
              ))}
            </div>
          </div>

          {/* 旅程說明 */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Activity,
                title: '被動行為 → 主動意圖',
                desc: 'AI 不等顧客流失才反應，而是預測意圖、超前部署，在顧客心中尚未決定時，已備好最合適的提案。',
                color: C.accent,
              },
              {
                icon: Network,
                title: '單點接觸 → 全通路體驗',
                desc: '無論顧客在 APP 瀏覽、門市掃碼、LINE 訊問，AI Agent 確保每個接觸點的體驗一致且個人化。',
                color: C.primary,
              },
              {
                icon: RefreshCw,
                title: '靜態規則 → 持續學習',
                desc: '每次顧客互動都是學習機會，AI 自動從成功與失敗中迭代，隨時間愈來愈了解每位顧客。',
                color: C.success,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900 rounded-2xl p-6 border border-slate-800"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: item.color + '22' }}>
                  <item.icon size={20} style={{ color: item.color }} />
                </div>
                <h4 className="text-sm font-black mb-2">{item.title}</h4>
                <p className="text-slate-400 text-xs font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 應用情境大全 ────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black tracking-tighter mb-4">8 大自動化應用情境</h2>
            <p className="text-slate-500 font-medium">點選各情境查看觸發條件、AI 動作與預期效益</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {scenarios.map((s, i) => (
              <ScenarioCard key={i} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 系統架構 ──────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter mb-4">系統技術架構</h2>
            <p className="text-slate-500 font-medium">模組化設計，可依門市規模彈性部署</p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* 層次架構 */}
            {[
              {
                layer: '資料採集層',
                color: C.accent,
                icon: Database,
                items: ['POS 系統串接', 'APP SDK', 'LINE OA Webhook', '電商 API', 'WiFi 探針', 'IoT 感測器'],
              },
              {
                layer: 'AI 分析引擎層',
                color: C.primary,
                icon: Cpu,
                items: ['會員 CDP 平台', 'RFM 動態模型', '流失預測 ML', '購買週期分析', '自然語言標籤', '推薦演算法'],
              },
              {
                layer: '決策自動化層',
                color: C.warn,
                icon: Workflow,
                items: ['事件觸發引擎', '動態分群系統', '個人化決策樹', 'A/B 測試框架', '最佳時機算法', '訊息生成 AI'],
              },
              {
                layer: '觸達執行層',
                color: C.success,
                icon: Bell,
                items: ['LINE OA 推播', 'APP Push', '簡訊 SMS', '電子郵件', '門市系統顯示', '店員協作提示'],
              },
              {
                layer: '效益回饋層',
                color: C.danger,
                icon: LineChart,
                items: ['轉換率追蹤', 'ROI 儀表板', '群組 LTV 監控', '活動效益報告', '自動優化迴圈', '管理決策支援'],
              },
            ].map((layer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-6 mb-4 bg-white rounded-2xl border border-slate-200 p-5 hover:border-violet-300 transition-all shadow-sm hover:shadow-md"
              >
                <div className="w-48 shrink-0 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: layer.color + '18' }}>
                    <layer.icon size={18} style={{ color: layer.color }} />
                  </div>
                  <div className="text-sm font-black text-slate-800">{layer.layer}</div>
                </div>
                <div className="flex flex-wrap gap-2 flex-1">
                  {layer.items.map((item) => (
                    <span key={item}
                      className="px-3 py-1 rounded-full text-[11px] font-bold border"
                      style={{ background: layer.color + '0d', borderColor: layer.color + '44', color: layer.color }}>
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 數據成效 ──────────────────────────────────────────── */}
      <section className="py-24 bg-slate-950 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter mb-4">預期導入效益</h2>
            <p className="text-slate-400 font-medium">基於同類型超市導入 AI CRM 後的平均數據</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: TrendingUp, val: 34, suffix: '%', label: '會員回購率提升', color: C.success },
              { icon: UserCheck, val: 42, suffix: '%', label: '沉睡會員喚醒率', color: C.accent },
              { icon: ShoppingCart, val: 28, suffix: '%', label: '平均客單提升', color: C.primary },
              { icon: Eye, val: 91, suffix: '%', label: 'AI 推薦精準率', color: C.warn },
              { icon: Clock, val: 70, suffix: '%', label: '行銷人力節省', color: '#EC4899' },
              { icon: Star, val: 3.1, suffix: '×', label: '個人化 vs 廣播轉換', color: C.danger },
              { icon: Shield, val: 30, suffix: '天', label: '流失預警提前量', color: C.success },
              { icon: PieChart, val: 2.8, suffix: '×', label: '整體行銷 ROI', color: C.primary },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center hover:border-violet-600 transition-all"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: item.color + '22' }}>
                  <item.icon size={20} style={{ color: item.color }} />
                </div>
                <div className="text-3xl font-black mb-1"
                  style={{ color: item.color }}>
                  {Number.isInteger(item.val)
                    ? <AnimatedNumber target={item.val} suffix={item.suffix} />
                    : `${item.val}${item.suffix}`}
                </div>
                <div className="text-slate-400 text-xs font-medium leading-snug">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
              <Sparkles size={28} color="#fff" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
              準備好讓 AI 為您的<br />
              <span style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                超市會員系統升級了嗎？
              </span>
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-10 text-lg">
              從資料整合到 AI 自動觸發，我們協助針對型連鎖超市建立真正屬於自己的智慧會員大腦，讓每一筆消費都能轉化為下一次回購的動力。
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="mailto:zack31717@gmail.com"
                className="px-10 py-5 text-white font-black rounded-2xl text-base shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                <Mail size={20} /> 預約系統演示
              </a>
              <a href="/#/"
                className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl text-base shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3">
                返回主頁 <ArrowRight size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <div className="py-8 bg-slate-950 text-center">
        <div className="text-slate-600 text-[10px] font-black tracking-[0.3em] uppercase">
          AI Agentic CRM · Specialty Supermarket Intelligence Platform
        </div>
      </div>
    </div>
  );
};

export default CrmPage;
