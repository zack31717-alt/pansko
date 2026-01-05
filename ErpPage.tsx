import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";

type StockRow = {
  id: string;
  supplier_name: string | null;
  name: string;
  spec: string | null;
  unit: string | null;
  safety_stock: number;
  stock: number | string;
  is_low: boolean;
};


type MoveRow = {
  id: string;
  created_at: string;
  product_id: string;
  supplier_name: string | null;
  name: string;
  spec: string | null;
  qty: number;
  note: string | null;
};


export default function ErpPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [moves, setMoves] = useState<MoveRow[]>([]);
  const [loadingMoves, setLoadingMoves] = useState(false);
    // ✅ inline 編輯 safety_stock
  const [editingSafeId, setEditingSafeId] = useState<string>(""); 
  const [safeDraft, setSafeDraft] = useState<string>("");


  useEffect(() => {
    if (localStorage.getItem("erp_authed") === "1") setAuthed(true);
  }, []);

  const [rows, setRows] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔍 搜尋關鍵字（如果你還沒加）
  const [onlyLow, setOnlyLow] = useState(false);
  const [q, setQ] = useState("");
  const [showLowOnly, setShowLowOnly] = useState(false); // 只看低庫存
  const [history, setHistory] = useState<any[]>([]);
  const [historyLimit, setHistoryLimit] = useState(50); // 先顯示50筆
  const filteredRows = useMemo(() => {
  const kw = q.trim().toLowerCase();
  let out = rows;

  if (kw) {
    out = out.filter(r =>
      (r.supplier_name || "").toLowerCase().includes(kw) ||
      (r.name || "").toLowerCase().includes(kw)
    );
  }

  if (onlyLow) {
    out = out.filter(r => r.is_low);
  }

  return out;
}, [rows, q, onlyLow]);



  // 新增產品
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [spec, setSpec] = useState("");
  const [unit, setUnit] = useState("pcs");
  // 編輯選取產品（名稱/規格/單位）
const [editName, setEditName] = useState("");
const [editSpec, setEditSpec] = useState("");
const [editUnit, setEditUnit] = useState("pcs");

  // 異動
const [selectedId, setSelectedId] = useState<string>("");
const [moveQty, setMoveQty] = useState<string>("0");
const [note, setNote] = useState("");

// 選取的產品
const selected = useMemo(
  () => rows.find(r => r.id === selectedId),
  [rows, selectedId]
);

// ✏️ 同步右側編輯欄位
useEffect(() => {
  if (!selected) return;
  setEditName(selected.name || "");
  setEditSpec(selected.spec || "");
  setEditUnit(selected.unit || "pcs");
}, [selected]);

// 📜 同步右側歷史紀錄（重點）
useEffect(() => {
  if (!authed) return;
  if (!selectedId) return;

  fetchMoves(selectedId);
}, [authed, selectedId]);


  const DEFAULT_SAFE = 3;
const isLowStock = (r: StockRow) => {
  const stock = Number(r.stock || 0);
  const safe = Number.isFinite(Number(r.safety_stock)) ? Number(r.safety_stock) : DEFAULT_SAFE;
  return stock < safe;
};
const displayRows = useMemo(() => {
  const kw = q.trim().toLowerCase();
  let out = [...rows];

  // 🔍 搜尋
  if (kw) {
  out = out.filter(r =>
    (r.supplier_name || "").toLowerCase().includes(kw) ||
    (r.name || "").toLowerCase().includes(kw) ||
    (r.spec || "").toLowerCase().includes(kw)
  );
}

  // ✅ 只看低庫存（每品項 safety_stock）
  if (onlyLow) {
    out = out.filter(isLowStock);
  }

  // ⚠️ 低庫存排前面（排序不用動筆數）
  out.sort((a, b) => {
    const aLow = isLowStock(a);
    const bLow = isLowStock(b);
    if (aLow === bLow) return 0;
    return aLow ? -1 : 1;
  });

  return out;
}, [rows, q, onlyLow]);


  async function fetchStock() {
    setLoading(true);
    const { data, error } = await supabase
      .from("v_stock")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      alert("讀取庫存失敗：" + error.message);
    } else {
      setRows((data || []) as StockRow[]);
      if (!selectedId && data?.[0]?.id) setSelectedId(data[0].id);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  async function addProduct() {
  if (!name.trim()) return alert("請輸入產品名稱");

  const supplierName = sku.trim(); // 你目前 sku 欄位其實是廠商名稱

  // 1) 取得 / 建立 supplier
  let supplierId: string | null = null;

  if (supplierName) {
    // 先查
    const { data: s1, error: e1 } = await supabase
      .from("suppliers")
      .select("id")
      .eq("name", supplierName)
      .maybeSingle();

    if (e1) return alert("查詢廠商失敗：" + e1.message);

    if (s1?.id) {
      supplierId = s1.id;
    } else {
      // 不存在就新增
      const { data: s2, error: e2 } = await supabase
        .from("suppliers")
        .insert({ name: supplierName })
        .select("id")
        .single();

      if (e2) return alert("新增廠商失敗：" + e2.message);
      supplierId = s2.id;
    }
  }

  // 2) 新增 products（寫 supplier_id）
  const { error: pErr } = await supabase.from("products").insert({
    // 這裡 sku 你可以先保留舊相容（存廠商名），或改成 null
    sku: null,          // ✅ 先保留（之後你要把 sku 改成真正 SKU 再調整）
    supplier_id: supplierId,            // ✅ 新欄位
    name: name.trim(),
    spec: spec.trim() || null,
    unit: unit.trim() || "pcs",
    // safety_stock: 你如果有新增欄位也可在這裡一起寫
  });

  if (pErr) return alert("新增產品失敗：" + pErr.message);

  // reset
  setSku("");
  setName("");
  setSpec("");
  setUnit("pcs");

  await fetchStock();
}

  
  async function saveSafetyStock(productId: string, draft: string) {
  const safe = Number(draft);

  if (!Number.isFinite(safe) || safe < 0) {
    alert("安全庫存請輸入 0 以上數字");
    return;
  }

  const { error } = await supabase
    .from("products")
    .update({ safety_stock: safe })
    .eq("id", productId);

  if (error) {
    alert("更新安全庫存失敗：" + error.message);
    return;
  }

  // ✅ 關閉編輯狀態
  setEditingSafeId("");
  setSafeDraft("");

  // ✅ 方式A：直接刷新最簡單
  await fetchStock();

  // （可選 方式B：不刷新，直接更新 rows 也行，但你目前用 view，刷新最穩）
}


async function saveEdit() {
  if (!selectedId) return alert("請先選一個產品");
  if (!editName.trim()) return alert("名稱不能空");

  const { error } = await supabase
    .from("products")
    .update({
      name: editName.trim(),
      spec: editSpec.trim() || null,
      unit: editUnit.trim() || "pcs",
    })
    .eq("id", selectedId);

  if (error) return alert("更新失敗：" + error.message);

  await fetchStock();
  alert("已更新 ✅");
}
async function fetchMoves(productId?: string) {
  setLoadingMoves(true);

  let q = supabase
    .from("v_move_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (productId) {
    q = q.eq("product_id", productId);
  }

  const { data, error } = await q;

  if (error) {
    alert("讀取歷史紀錄失敗：" + error.message);
  } else {
    setMoves((data || []) as MoveRow[]);
  }

  setLoadingMoves(false);
}

  async function addMove() {
  if (!selectedId) return alert("請先選一個產品");

  const qty = Number(moveQty);
  if (!Number.isFinite(qty) || qty === 0)
    return alert("qty 請輸入非 0 數字");

  const { error } = await supabase
    .from("inventory_moves")
    .insert({
      product_id: selectedId,
      qty,
      note: note.trim() || null,
    });

  if (error) return alert("異動失敗：" + error.message);

  setMoveQty("0");
  setNote("");
  await fetchStock();
  await fetchMoves(selectedId); // ✅ 讓歷史立即更新
}

async function deleteProduct(productId: string) {
  if (!productId) return;

  const target = rows.find(r => r.id === productId);
  const ok = confirm(
    `確定要刪除產品「${target?.name || ""}」？\n（會連同入出庫紀錄一起刪除）`
  );
  if (!ok) return;

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) return alert("刪除失敗：" + error.message);
  setSelectedId("");
  await fetchStock();
}
if (!authed) {
  return (
    <div className={cls.page}>
      <div className={cls.wrap}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>ERP 登入</h1>
      <div style={{ color: "#555", marginBottom: 12 }}>請輸入密碼才可進入</div>

      <input
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="Password"
        style={{ width: "100%", maxWidth: 360, padding: "10px 12px", borderRadius: 10, border: "1px solid #ccc" }}
      />

      <div style={{ marginTop: 12, maxWidth: 360 }}>
        <button
          style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: 0, background: "#111", color: "white", fontWeight: 800, cursor: "pointer" }}
          onClick={() => {
            if (pw === "29113377") {
              localStorage.setItem("erp_authed", "1");
              setAuthed(true);
            } else {
              alert("密碼錯誤");
            }
          }}
        >
          登入
        </button>
      </div>
    </div>
     </div>

  );
}

  return (
    <div className={cls.page}>
  <div className={cls.wrap}></div>
      {/* Header */}
<div style={{ position: "relative", marginBottom: 20 }}>
  <h1
    style={{
      fontSize: 40,
      fontWeight: 900,
      textAlign: "center",
      margin: 0,
      letterSpacing: 1,
    }}
  >
    ERP - 庫存管理
  </h1>

  <button
    onClick={() => {
      localStorage.removeItem("erp_authed");
      setAuthed(false);
    }}
    style={{
      position: "absolute",
      right: 0,
      top: 0,
      padding: "10px 14px",
      borderRadius: 12,
      border: "1px solid #ccc",
      background: "white",
      fontWeight: 800,
      cursor: "pointer",
    }}
  >
    登出
  </button>
</div>


      <div style={{ color: "#555", marginBottom: 20 }}>
        入口：<code>/#/erp</code>
      </div>

      {loading ? (
        <div>載入中...</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 18 }}>
            {/* 左：庫存清單 */}
            <div style={{ border: "1px solid #ddd", borderRadius: 12, overflow: "hidden" }}>
              <div
  style={{
    padding: 12,
    fontWeight: 700,
    background: "#fafafa",
    borderBottom: "1px solid #ddd",
  }}
>
                目前庫存
              </div>
              <input
  value={q}
  onChange={e => setQ(e.target.value)}
  placeholder="搜尋 SKU 或 產品名稱"
  style={{
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ccc",
    marginBottom: 12,
  }}
/>


              <div style={{ width: "100%", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#fff" }}>
                      <th style={th}>廠商</th>
                      <th style={th}>名稱</th>
                      <th style={th}>規格說明</th>
                      <th style={th}>庫存</th>
                      <th style={th}>安全庫存</th>
                      <th style={th}>單位</th>
                      <th style={th}>刪除</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayRows.map(r => (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedId(r.id)}
                        style={{
                          cursor: "pointer",
                          background: 
                          r.id === selectedId
        ? "#eef6ff"                 // 被選取
        : isLowStock(r)
        ? "#fff1f2"                 // 低庫存（淡紅）
        : "white",                  // 正常
                          borderTop: "1px solid #eee",
                        }}
                      >
                        <td style={td}>{r.supplier_name || "-"}</td>
                        <td style={td}><b>{r.name}</b></td>
                        <td style={{ ...td, maxWidth: 260 }}>
  <div
    title={r.spec || ""}
    style={{
      maxWidth: 260,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }}
  >
    {r.spec || "-"}
  </div>
</td>
                        <td style={td}>{Number(r.stock || 0)}</td>
                        
                        <td
  style={td}
  onClick={(e) => {
    e.stopPropagation(); // 不要觸發 row 被選取
    setEditingSafeId(r.id);
    setSafeDraft(String(r.safety_stock ?? 0));
  }}
>
  {editingSafeId === r.id ? (
    <input
      autoFocus
      value={safeDraft}
      onChange={(e) => setSafeDraft(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === "Enter") saveSafetyStock(r.id, safeDraft);
        if (e.key === "Escape") {
          setEditingSafeId("");
          setSafeDraft("");
        }
      }}
      onBlur={() => saveSafetyStock(r.id, safeDraft)}
      style={{
        width: 80,
        padding: "6px 8px",
        borderRadius: 8,
        border: "1px solid #ccc",
      }}
    />
  ) : (
    <span style={{ fontWeight: 800 }}>
      {Number(r.safety_stock || 0)}
    </span>
  )}
</td>
                        <td style={td}>{r.unit || "pcs"}</td>
                        <td style={{ padding: "10px 12px" }}>
    <button
      onClick={async (e) => {
        e.stopPropagation(); // ❗ 防止點到 row 被選取
        if (!confirm(`確定刪除 ${r.name}？`)) return;

        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", r.id);

        if (error) alert(error.message);
        else fetchStock();
      }}
      style={{
        padding: "4px 8px",
        borderRadius: 6,
        border: "1px solid #e00",
        background: "white",
        color: "#e00",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      刪除
    </button>
  </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 右：新增 + 異動 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

<div style={{ display: "flex", gap: 10, alignItems: "center", margin: "12px 0" }}>
  <button
    onClick={() => setOnlyLow(v => !v)}
    style={{
      padding: "8px 12px",
      borderRadius: 10,
      border: "1px solid #ccc",
      background: onlyLow ? "#111" : "white",
      color: onlyLow ? "white" : "#111",
      fontWeight: 800,
      cursor: "pointer",
    }}
  >
    只看低庫存
  </button>

  <div style={{ color: "#555" }}>
   低庫存筆數：<b>{rows.filter(isLowStock).length}</b>
  </div>
</div>






              <Card title="新增產品">
                <Field label="廠商（可空）">
                  <input value={sku} onChange={e => setSku(e.target.value)} style={input} />
                </Field>
                <Field label="名稱（必填）">
                  <input value={name} onChange={e => setName(e.target.value)} style={input} />
                </Field>
                <Field label="規格說明（可空）">
                <input value={spec} onChange={e => setSpec(e.target.value)} style={input} />
                </Field>
                <Field label="單位">
                  <input value={unit} onChange={e => setUnit(e.target.value)} style={input} />
                </Field>
                <button onClick={addProduct} style={btn}>新增產品</button>
              </Card>
<Card title="編輯選取產品（名稱 / 規格 / 單位）">
  <div style={{ marginBottom: 8 }}>
    目前選擇： <b>{selected?.name || "-"}</b>
  </div>

  <Field label="名稱（必填）">
    <input value={editName} onChange={e => setEditName(e.target.value)} style={input} />
  </Field>

  <Field label="規格說明（可空）">
    <input value={editSpec} onChange={e => setEditSpec(e.target.value)} style={input} />
  </Field>

  <Field label="單位">
    <input value={editUnit} onChange={e => setEditUnit(e.target.value)} style={input} />
  </Field>

  <button onClick={saveEdit} style={btn}>儲存更新</button>
</Card>

              <Card title="庫存異動（入庫正數 / 出庫負數）">
                <div style={{ marginBottom: 8 }}>
                  目前選擇： <b>{selected?.name || "-"}</b>
                </div>
                <Field label="數量 qty">
                  <input value={moveQty} onChange={e => setMoveQty(e.target.value)} style={input} />
                </Field>
                <Field label="備註（可空）">
                  <input value={note} onChange={e => setNote(e.target.value)} style={input} />
                </Field>
                <button onClick={addMove} style={btn}>送出異動</button>
              </Card>
              <Card title="入庫 / 出庫歷史（近 50 筆）">
  {!selectedId ? (
    <div style={{ color: "#666" }}>請先在左邊點選一個產品</div>
  ) : loadingMoves ? (
    <div>載入中...</div>
  ) : moves.length === 0 ? (
    <div style={{ color: "#666" }}>尚無紀錄</div>
  ) : (
    <div style={{ maxHeight: 320, overflow: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
      {moves.map((m) => (
        <div
          key={m.id}
          style={{
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 10,
            display: "grid",
            gridTemplateColumns: "120px 90px 1fr",
            gap: 10,
            alignItems: "start",
            background: "#fff",
          }}
        >
          {/* 時間 */}
          <div style={{ fontSize: 12, color: "#666", lineHeight: 1.2 }}>
            {new Date(m.created_at).toLocaleString()}
          </div>

          {/* qty */}
          <div
            style={{
              fontWeight: 900,
              color: m.qty >= 0 ? "#16a34a" : "#dc2626", // 入庫綠 / 出庫紅
              whiteSpace: "nowrap",
            }}
          >
            {m.qty >= 0 ? `入庫 +${m.qty}` : `出庫 ${m.qty}`}
          </div>

          {/* 內容 */}
          <div style={{ lineHeight: 1.35 }}>
            <div style={{ fontWeight: 800 }}>
               {(m.supplier_name ? `${m.supplier_name} / ` : "") + m.name}
            </div>

            {m.spec && (
              <div
                title={m.spec}
                style={{
                  fontSize: 12,
                  color: "#666",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 360,
                }}
              >
                {m.spec}
              </div>
            )}

            {m.note && (
              <div style={{ marginTop: 4, fontSize: 12, color: "#111" }}>
                備註：{m.note}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )}
</Card>


              <button onClick={fetchStock} style={btnGhost}>重新整理</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
      <div style={{ fontWeight: 800, marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 12, color: "#555", marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

const th: React.CSSProperties = { textAlign: "left", padding: "10px 12px", fontSize: 12, color: "#555" };
const td: React.CSSProperties = { padding: "10px 12px" };
const input: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #ccc" };
const btn: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "0", background: "#111", color: "white", fontWeight: 800, cursor: "pointer" };
const btnGhost: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #ccc", background: "white", fontWeight: 800, cursor: "pointer" };

const cls = {
  page: "min-h-screen bg-slate-50",
  wrap: "mx-auto max-w-6xl px-6 py-10",
  h1: "text-3xl font-black text-slate-900",
  sub: "text-slate-500 mt-2",
  grid: "mt-8 grid gap-6 lg:grid-cols-[1fr_420px]",
  card: "rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden",
  cardHead: "px-5 py-4 font-extrabold bg-slate-50 border-b border-slate-200",
  cardBody: "p-5",
  input: "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200",
  btn: "w-full rounded-2xl bg-slate-900 px-5 py-3 font-black text-white shadow-xl hover:bg-slate-800 transition-all",
  btnBlue: "w-full rounded-2xl bg-blue-600 px-5 py-3 font-black text-white shadow-xl hover:bg-blue-700 transition-all",
  btnGhost: "w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-900 hover:bg-slate-50 transition-all",
  tableWrap: "w-full overflow-x-auto",
  th: "text-left px-4 py-3 text-xs font-bold text-slate-500",
  td: "px-4 py-3 text-slate-900",
  row: "border-t border-slate-100 hover:bg-slate-50 cursor-pointer",
  rowActive: "bg-blue-50",
};
