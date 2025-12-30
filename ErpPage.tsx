import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";

type StockRow = {
  id: string;
  sku: string | null;
  name: string;
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

  // 新增產品
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("pcs");

  // 異動
  const [selectedId, setSelectedId] = useState<string>("");
  const [moveQty, setMoveQty] = useState<string>("0");
  const [note, setNote] = useState("");

  const selected = useMemo(
    () => rows.find(r => r.id === selectedId),
    [rows, selectedId]
  );

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
      unit: unit.trim() || "pcs",
    });
    if (error) return alert("新增產品失敗：" + error.message);

    setSku("");
    setName("");
    setUnit("pcs");
    await fetchStock();
  }

  async function addMove() {
      
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
    <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto" }}>
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
    <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
  <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>ERP - 庫存管理</h1>

  <button
    onClick={() => {
      localStorage.removeItem("erp_authed");
      setAuthed(false);
    }}
    style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #ccc", background: "white", fontWeight: 800, cursor: "pointer" }}
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
              <div style={{ padding: 12, fontWeight: 700, background: "#fafafa", borderBottom: "1px solid #ddd" }}>
                目前庫存
              </div>

              <div style={{ width: "100%", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#fff" }}>
                      <th style={th}>SKU</th>
                      <th style={th}>名稱</th>
                      <th style={th}>庫存</th>
                      <th style={th}>單位</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedId(r.id)}
                        style={{
                          cursor: "pointer",
                          background: r.id === selectedId ? "#eef6ff" : "white",
                          borderTop: "1px solid #eee",
                        }}
                      >
                        <td style={td}>{r.sku || "-"}</td>
                        <td style={td}><b>{r.name}</b></td>
                        <td style={td}>{Number(r.stock || 0)}</td>
                        <td style={td}>{r.unit || "pcs"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 右：新增 + 異動 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Card title="新增產品">
                <Field label="SKU（可空）">
                  <input value={sku} onChange={e => setSku(e.target.value)} style={input} />
                </Field>
                <Field label="名稱（必填）">
                  <input value={name} onChange={e => setName(e.target.value)} style={input} />
                </Field>
                <Field label="單位">
                  <input value={unit} onChange={e => setUnit(e.target.value)} style={input} />
                </Field>
                <button onClick={addProduct} style={btn}>新增產品</button>
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