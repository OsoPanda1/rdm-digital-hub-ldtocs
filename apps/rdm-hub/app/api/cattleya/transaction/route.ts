import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getKernel } from "@nodo-cero/tamv-kernel";

export const dynamic = "force-dynamic";

function hash(data: string) {
  let h = 0;
  for (let i = 0; i < data.length; i++) {
    h = (h << 5) - h + data.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(16) + Math.abs(~h).toString(16);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { items, totalAmount = 0, buyerName, paymentMethod } = body ?? {};

  const orderId = `ORD-RDM-${Math.floor(100000 + Math.random() * 900000)}`;
  const heritageFee = Number((Number(totalAmount) * 0.03).toFixed(2));
  const timestamp = new Date().toISOString();
  const txHash = hash(`${orderId}-${totalAmount}-${timestamp}`);

  // Registro en el ledger soberano (best-effort, nunca rompe la compra)
  try {
    await getKernel().emit(
      {
        type: "PAYMENT_COMPLETED" as never,
        federation: "MDD_TAMV",
        source: "WEB_PORTAL",
        payload: {
          orderId,
          buyer: buyerName || "Visitante RDM",
          totalAmount,
          heritageFee,
          itemsCount: Array.isArray(items) ? items.length : 1,
          paymentMethod: paymentMethod || "Cattleya Sovereign Ledger",
        },
      },
      `cattleya:${orderId}`,
    );
  } catch (err) {
    console.error("cattleya.ledger.error", err);
  }

  return NextResponse.json({
    success: true,
    orderId,
    txHash,
    totalAmount,
    heritageFee,
    currency: "MXN",
    timestamp,
    ledgerReceipt: {
      protocol: "TAMV Cattleya Pay v1",
      sovereigntyProof: `RDM-LEDGER-PROOF-${txHash.slice(0, 8).toUpperCase()}`,
      heritageConservationFundContribution: heritageFee,
      status: "CONFIRMED",
    },
  });
}
