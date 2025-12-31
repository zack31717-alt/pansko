import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";

type StockRow = {
  id: string;
  sku: string | null;
  name: string;
  spec: string | null;
  unit: string | null;
  stock: number;
};

export default function ErpPage() {
      const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");

  useEffect(() => {
    if (localStorage.getItem("erp_authed") === "1") setAuthed(true);
  }, []);

  const [rows, setRows] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔍 搜尋關鍵字（如果你還沒加）

  const [q, setQ] = useState("");
  const [showLowOnly, setShowLowOnly] = useState(false); // 只看低庫存
  const [history, setHistory] = useState<any[]>([]);
  const [historyLimit, setHistoryLimit] = useState(50); // 先顯示50筆
  const filteredRows = useMemo(() => {
  const kw = q.trim().toLowerCase();
  let out: StockRow[] = rows;

  if (kw) {
    out = out.filter(r =>
      (r.sku || "").toLowerCase().includes(kw) ||
      r.name.toLowerCase().includes(kw)
    );
  }
  return out;
}, [rows, q]);


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

  const selected = useMemo(
    () => rows.find(r => r.id === selectedId),
    [rows, selectedId]
  );
  useEffect(() => {
  if (!selected) return;
  setEditName(selected.name || "");
  setEditSpec(selected.spec || "");
  setEditUnit(selected.unit || "pcs");
}, [selected]);

  const SAFE_STOCK = 3;
  const isLowStock = (r: StockRow) => {
  return Number(r.stock || 0) < SAFE_STOCK;
};
const displayRows = useMemo(() => {
  const kw = q.trim().toLowerCase();
  let out = [...rows];

  // 🔍 搜尋（廠商 / 名稱）
  if (kw) {
    out = out.filter(r =>
      (r.sku || "").toLowerCase().includes(kw) ||
      r.name.toLowerCase().includes(kw)
    );
  }

  // ⚠️ 低庫存排前面
  out.sort((a, b) => {
    const aLow = isLowStock(a);
    const bLow = isLowStock(b);
    if (aLow === bLow) return 0;
    return aLow ? -1 : 1;
  });

  return out;
}, [rows, q]);


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
    const { error } = await supabase.from("products").insert({
      sku: sku.trim() || null,
      name: name.trim(),
       spec: spec.trim() || null,
      unit: unit.trim() || "pcs",
    });
    if (error) return alert("新增產品失敗：" + error.message);

    setSku("");
    setName("");
    setSpec("");
    setUnit("pcs");
    await fetchStock();
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

  async function addMove() {

    async function deleteProduct(productId: string) {
  if (!productId) return;

  const target = rows.find(r => r.id === productId);
  const ok = confirm(`確定要刪除產品「${target?.name || ""}」？\n（會連同入出庫紀錄一起刪除）`);
  if (!ok) return;

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) return alert("刪除失敗：" + error.message);

  // 重新讀取
  setSelectedId("");
  await fetchStock();
}

      
    if (!selectedId) return alert("請先選一個產品");
    const qty = Number(moveQty);
    if (!Number.isFinite(qty) || qty === 0) return alert("qty 請輸入非 0 數字（入庫正數 / 出庫負數）");

    const { error } = await supabase.from("inventory_moves").insert({
      product_id: selectedId,
      qty,
      note: note.trim() || null,
    });
    if (error) return alert("異動失敗：" + error.message);

    setMoveQty("0");
    setNote("");
    await fetchStock();
  }
if (!authed) {
  return (
    <div className={cls.page}>
  <div className={cls.wrap}></div>
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
        : r.stock < 3
        ? "#fff1f2"                 // 低庫存（淡紅）
        : "white",                  // 正常
                          borderTop: "1px solid #eee",
                        }}
                      >
                        <td style={td}>{r.sku || "-"}</td>
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
