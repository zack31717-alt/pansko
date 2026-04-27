import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";

type StockRow = {
  id: string;
  sku: string | null;
  supplier_name?: string | null;
  name: string;
  spec: string | null;
  unit: string | null;
  safety_stock: number | null;
  stock: number | string | null;
  is_low?: boolean;
};

type MoveRow = {
  id: string;
  created_at: string;
  product_id: string;
  sku: string | null;
  supplier_name?: string | null;
  name: string;
  spec: string | null;
  qty: number;
  note: string | null;
};

const ERP_PASSWORD = "29113377";
const DEFAULT_SAFE = 3;

export default function ErpPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");

  const [rows, setRows] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [moves, setMoves] = useState<MoveRow[]>([]);
  const [loadingMoves, setLoadingMoves] = useState(false);

  const [selectedId, setSelectedId] = useState("");
  const [q, setQ] = useState("");
  const [onlyLow, setOnlyLow] = useState(false);

  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [spec, setSpec] = useState("");
  const [unit, setUnit] = useState("pcs");

  const [editName, setEditName] = useState("");
  const [editSpec, setEditSpec] = useState("");
  const [editUnit, setEditUnit] = useState("pcs");

  const [moveQty, setMoveQty] = useState("0");
  const [note, setNote] = useState("");

  const [editingSafeId, setEditingSafeId] = useState("");
  const [safeDraft, setSafeDraft] = useState("");
  const [viewportWidth, setViewportWidth] = useState(() => {
    if (typeof window === "undefined") {
      return 1280;
    }
    return window.innerWidth;
  });

  useEffect(() => {
    if (localStorage.getItem("erp_authed") === "1") {
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    function onResize() {
      setViewportWidth(window.innerWidth);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isTablet = viewportWidth < 1120;
  const isMobile = viewportWidth < 768;

  const selected = useMemo(
    () => rows.find((row) => row.id === selectedId),
    [rows, selectedId]
  );

  useEffect(() => {
    if (!selected) {
      return;
    }

    setEditName(selected.name || "");
    setEditSpec(selected.spec || "");
    setEditUnit(selected.unit || "pcs");
  }, [selected]);

  useEffect(() => {
    if (!authed || !selectedId) {
      return;
    }

    fetchMoves(selectedId);
  }, [authed, selectedId]);

  const displayRows = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    let list = [...rows];

    if (keyword) {
      list = list.filter((row) => {
        const supplier = getSupplierLabel(row).toLowerCase();
        return (
          supplier.includes(keyword) ||
          (row.name || "").toLowerCase().includes(keyword) ||
          (row.spec || "").toLowerCase().includes(keyword)
        );
      });
    }

    if (onlyLow) {
      list = list.filter(isLowStock);
    }

    list.sort((a, b) => {
      const aLow = isLowStock(a);
      const bLow = isLowStock(b);
      if (aLow === bLow) {
        return a.name.localeCompare(b.name);
      }
      return aLow ? -1 : 1;
    });

    return list;
  }, [rows, q, onlyLow]);

  async function fetchStock() {
    setLoading(true);

    const { data, error } = await supabase
      .from("v_stock")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      alert("讀取庫存失敗：" + error.message);
      setLoading(false);
      return;
    }

    const nextRows = (data || []) as StockRow[];
    setRows(nextRows);

    if (!nextRows.some((row) => row.id === selectedId)) {
      setSelectedId(nextRows[0]?.id || "");
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchStock();
  }, []);

  async function addProduct() {
    if (!name.trim()) {
      alert("請輸入產品名稱");
      return;
    }

    const supplierName = normalizeSupplierName(sku);
    let supplierId: string | null = null;

    if (supplierName) {
      const supplierKey = getSupplierKey(supplierName);
      const { data: existingSuppliers, error: supplierQueryError } = await supabase
        .from("suppliers")
        .select("id, name");

      if (supplierQueryError) {
        alert("查詢廠商失敗：" + supplierQueryError.message);
        return;
      }

      const existingSupplier = existingSuppliers?.find(
        (supplier) => getSupplierKey(supplier.name || "") === supplierKey
      );

      if (existingSupplier?.id) {
        supplierId = existingSupplier.id;
      } else {
        const { data: createdSupplier, error: supplierInsertError } = await supabase
          .from("suppliers")
          .insert({ name: supplierName })
          .select("id")
          .single();

        if (supplierInsertError) {
          alert("新增廠商失敗：" + supplierInsertError.message);
          return;
        }

        supplierId = createdSupplier.id;
      }
    }

    const { error } = await supabase.from("products").insert({
      sku: null,
      supplier_id: supplierId,
      name: name.trim(),
      spec: spec.trim() || null,
      unit: unit.trim() || "pcs",
    });

    if (error) {
      alert("新增產品失敗：" + error.message);
      return;
    }

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

    setEditingSafeId("");
    setSafeDraft("");
    await fetchStock();
  }

  async function saveEdit() {
    if (!selectedId) {
      alert("請先選一個產品");
      return;
    }

    if (!editName.trim()) {
      alert("名稱不能空白");
      return;
    }

    const { error } = await supabase
      .from("products")
      .update({
        name: editName.trim(),
        spec: editSpec.trim() || null,
        unit: editUnit.trim() || "pcs",
      })
      .eq("id", selectedId);

    if (error) {
      alert("更新失敗：" + error.message);
      return;
    }

    await fetchStock();
    alert("已更新");
  }

  async function fetchMoves(productId?: string) {
    setLoadingMoves(true);

    let query = supabase
      .from("v_move_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (productId) {
      query = query.eq("product_id", productId);
    }

    const { data, error } = await query;

    if (error) {
      alert("讀取歷史紀錄失敗：" + error.message);
      setLoadingMoves(false);
      return;
    }

    setMoves((data || []) as MoveRow[]);
    setLoadingMoves(false);
  }

  async function addMove() {
    if (!selectedId) {
      alert("請先選一個產品");
      return;
    }

    const qty = Number(moveQty);
    if (!Number.isFinite(qty) || qty === 0) {
      alert("qty 請輸入非 0 數字");
      return;
    }

    const { error } = await supabase.from("inventory_moves").insert({
      product_id: selectedId,
      qty,
      note: note.trim() || null,
    });

    if (error) {
      alert("異動失敗：" + error.message);
      return;
    }

    setMoveQty("0");
    setNote("");
    await fetchStock();
    await fetchMoves(selectedId);
  }

  async function deleteProduct(productId: string) {
    const target = rows.find((row) => row.id === productId);
    const ok = confirm(
      `確定要刪除產品「${target?.name || ""}」？\n（會連同入出庫紀錄一起刪除）`
    );

    if (!ok) {
      return;
    }

    const { error } = await supabase.from("products").delete().eq("id", productId);

    if (error) {
      alert("刪除失敗：" + error.message);
      return;
    }

    if (selectedId === productId) {
      setSelectedId("");
    }

    await fetchStock();
  }

  if (!authed) {
    return (
      <div className={cls.page}>
        <div className={cls.wrap} style={isMobile ? { padding: "20px 12px" } : undefined}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>ERP 登入</h1>
          <div style={{ color: "#555", marginBottom: 12 }}>請輸入密碼才可進入</div>

          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            style={{ ...input, maxWidth: 360 }}
          />

          <div style={{ marginTop: 12, maxWidth: 360 }}>
            <button
              style={btn}
              onClick={() => {
                if (pw === ERP_PASSWORD) {
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
      <div className={cls.wrap} style={isMobile ? { padding: "20px 12px" } : undefined}>
        <div style={{ position: "relative", marginBottom: 20 }}>
          <h1
            style={{
              fontSize: isMobile ? 26 : 40,
              fontWeight: 900,
              textAlign: isMobile ? "left" : "center",
              margin: 0,
              letterSpacing: 1,
              paddingRight: isMobile ? 0 : 96,
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
              position: isMobile ? "static" : "absolute",
              right: isMobile ? undefined : 0,
              top: isMobile ? undefined : 0,
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #ccc",
              background: "white",
              fontWeight: 800,
              cursor: "pointer",
              marginTop: isMobile ? 10 : 0,
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTablet ? "1fr" : "1fr 420px",
              gap: isMobile ? 12 : 18,
            }}
          >
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

              <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="搜尋廠商、產品名稱或規格"
                  style={{ ...input, marginBottom: 12 }}
                />

                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    onClick={() => setOnlyLow((value) => !value)}
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
              </div>

              <div style={{ width: "100%", overflowX: "auto" }}>
                <table style={{ width: "100%", minWidth: isMobile ? 720 : "100%", borderCollapse: "collapse" }}>
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
                    {displayRows.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedId(row.id)}
                        style={{
                          cursor: "pointer",
                          background:
                            row.id === selectedId
                              ? "#eef6ff"
                              : isLowStock(row)
                                ? "#fff1f2"
                                : "white",
                          borderTop: "1px solid #eee",
                        }}
                      >
                        <td style={td}>{getSupplierLabel(row) || "-"}</td>
                        <td style={td}>
                          <b>{row.name}</b>
                        </td>
                        <td style={{ ...td, maxWidth: 260 }}>
                          <div title={row.spec || ""} style={ellipsisStyle}>
                            {row.spec || "-"}
                          </div>
                        </td>
                        <td style={td}>{Number(row.stock || 0)}</td>
                        <td
                          style={td}
                          onClick={(event) => {
                            event.stopPropagation();
                            setEditingSafeId(row.id);
                            setSafeDraft(String(row.safety_stock ?? 0));
                          }}
                        >
                          {editingSafeId === row.id ? (
                            <input
                              autoFocus
                              value={safeDraft}
                              onChange={(event) => setSafeDraft(event.target.value)}
                              onClick={(event) => event.stopPropagation()}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  saveSafetyStock(row.id, safeDraft);
                                }

                                if (event.key === "Escape") {
                                  setEditingSafeId("");
                                  setSafeDraft("");
                                }
                              }}
                              onBlur={() => saveSafetyStock(row.id, safeDraft)}
                              style={{
                                width: 80,
                                padding: "6px 8px",
                                borderRadius: 8,
                                border: "1px solid #ccc",
                              }}
                            />
                          ) : (
                            <span style={{ fontWeight: 800 }}>{Number(row.safety_stock || 0)}</span>
                          )}
                        </td>
                        <td style={td}>{row.unit || "pcs"}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              deleteProduct(row.id);
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

            <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 12 : 18 }}>
              <Card title="新增產品">
                <Field label="廠商（可空）">
                  <input value={sku} onChange={(e) => setSku(e.target.value)} style={input} />
                </Field>
                <Field label="名稱（必填）">
                  <input value={name} onChange={(e) => setName(e.target.value)} style={input} />
                </Field>
                <Field label="規格說明（可空）">
                  <input value={spec} onChange={(e) => setSpec(e.target.value)} style={input} />
                </Field>
                <Field label="單位">
                  <input value={unit} onChange={(e) => setUnit(e.target.value)} style={input} />
                </Field>
                <button onClick={addProduct} style={btn}>
                  新增產品
                </button>
              </Card>

              <Card title="編輯選取產品">
                <div style={{ marginBottom: 8 }}>
                  目前選擇： <b>{selected?.name || "-"}</b>
                </div>

                <Field label="名稱（必填）">
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} style={input} />
                </Field>
                <Field label="規格說明（可空）">
                  <input value={editSpec} onChange={(e) => setEditSpec(e.target.value)} style={input} />
                </Field>
                <Field label="單位">
                  <input value={editUnit} onChange={(e) => setEditUnit(e.target.value)} style={input} />
                </Field>
                <button onClick={saveEdit} style={btn}>
                  儲存更新
                </button>
              </Card>

              <Card title="庫存異動（入庫正數 / 出庫負數）">
                <div style={{ marginBottom: 8 }}>
                  目前選擇： <b>{selected?.name || "-"}</b>
                </div>
                <Field label="數量 qty">
                  <input value={moveQty} onChange={(e) => setMoveQty(e.target.value)} style={input} />
                </Field>
                <Field label="備註（可空）">
                  <input value={note} onChange={(e) => setNote(e.target.value)} style={input} />
                </Field>
                <button onClick={addMove} style={btn}>
                  送出異動
                </button>
              </Card>

              <Card title="入庫 / 出庫歷史（近 50 筆）">
                {!selectedId ? (
                  <div style={{ color: "#666" }}>請先在左邊點選一個產品</div>
                ) : loadingMoves ? (
                  <div>載入中...</div>
                ) : moves.length === 0 ? (
                  <div style={{ color: "#666" }}>尚無紀錄</div>
                ) : (
                  <div
                    style={{
                      maxHeight: 320,
                      overflow: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {moves.map((move) => (
                      <div
                        key={move.id}
                        style={{
                          border: "1px solid #eee",
                          borderRadius: 12,
                          padding: 10,
                          display: "grid",
                          gridTemplateColumns: isMobile
                            ? "1fr"
                            : isTablet
                              ? "100px 80px 1fr"
                              : "120px 90px 1fr",
                          gap: 10,
                          alignItems: "start",
                          background: "#fff",
                        }}
                      >
                        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.2 }}>
                          {new Date(move.created_at).toLocaleString()}
                        </div>

                        <div
                          style={{
                            fontWeight: 900,
                            color: move.qty >= 0 ? "#16a34a" : "#dc2626",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {move.qty >= 0 ? `入庫 +${move.qty}` : `出庫 ${move.qty}`}
                        </div>

                        <div style={{ lineHeight: 1.35 }}>
                          <div style={{ fontWeight: 800 }}>
                            {(getSupplierLabel(move) ? `${getSupplierLabel(move)} / ` : "") + move.name}
                          </div>

                          {move.spec ? (
                            <div title={move.spec} style={{ ...ellipsisStyle, maxWidth: 360, fontSize: 12, color: "#666" }}>
                              {move.spec}
                            </div>
                          ) : null}

                          {move.note ? (
                            <div style={{ marginTop: 4, fontSize: 12, color: "#111" }}>備註：{move.note}</div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <button onClick={fetchStock} style={btnGhost}>
                重新整理
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getSupplierLabel(row: { supplier_name?: string | null; sku?: string | null }) {
  return row.supplier_name || row.sku || "";
}

function normalizeSupplierName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function getSupplierKey(value: string) {
  return normalizeSupplierName(value).toLowerCase();
}

function isLowStock(row: StockRow) {
  const stock = Number(row.stock || 0);
  const safe = Number.isFinite(Number(row.safety_stock))
    ? Number(row.safety_stock)
    : DEFAULT_SAFE;
  return stock < safe;
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

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  fontSize: 12,
  color: "#555",
};

const td: React.CSSProperties = {
  padding: "10px 12px",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ccc",
};

const btn: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: 0,
  background: "#111",
  color: "white",
  fontWeight: 800,
  cursor: "pointer",
};

const btnGhost: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ccc",
  background: "white",
  fontWeight: 800,
  cursor: "pointer",
};

const ellipsisStyle: React.CSSProperties = {
  maxWidth: 260,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const cls = {
  page: "min-h-screen bg-slate-50",
  wrap: "mx-auto max-w-6xl px-6 py-10",
};
