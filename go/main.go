package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net"
	"time"

	"rdm-live-web/go/cognitive"
	"rdm-live-web/go/sce"
	"rdm-live-web/go/yun"
)

func main() {
	fmt.Println("═══ RDM SPATIAL CONTEXT ENGINE v1alpha ═══")
	fmt.Println("=== Ecosistema Georreferenciado Nativo RDM ===")
	fmt.Println()

	// ─── Isabella AI Cognitive Tree ───
	isabella := cognitive.NewEthicalTree([]byte("RDM_Sovereignty_Secret_Key_2026"))

	cogCtx := &cognitive.CognitiveEvaluationContext{
		TwinType:         cognitive.TwinSmartTourism,
		ConfidenceScore:  0.62,
		NetworkRiskLevel: "low",
		RequestedAccuracy: "high_precision",
		Timestamp:        time.Now(),
	}
	decision, _ := isabella.EvaluateTransaction(cogCtx)
	out, _ := json.MarshalIndent(decision, "", "  ")
	fmt.Printf("Isabella Decision:\n%s\n\n", string(out))

	// ─── RDM-SCE Core Engine ───
	engine := sce.NewSceEngine("RDM-CORE-NODE-001")
	registry := engine.GetRegistry()
	registry.RegisterProvider(sce.NewSovereignProvider("MaxMind_Local_Offline_F1", 100))

	ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
	defer cancel()

	testIP := net.ParseIP("192.168.42.100")
	ipCtx, err := registry.ResolveIP(ctx, testIP, "MX", true)
	if err != nil {
		fmt.Printf("Error IP: %v\n", err)
	} else {
		out, _ := json.MarshalIndent(ipCtx, "", "  ")
		fmt.Printf("IP Context:\n%s\n\n", string(out))
	}

	// ─── Gestión Yun ───
	gestor := yun.NewGestorYun("RDM-YUN-NODE-001")
	gestor.IngestSnapshot("twin-001", 3, "RDM-NODE-F3", []byte(`{"lat":20.139,"lon":-98.672}`))
	gestor.IngestSnapshot("twin-002", 5, "RDM-NODE-F5", []byte(`{"lat":20.140,"lon":-98.670}`))
	gestor.IngestSnapshot("twin-001", 3, "RDM-NODE-F3", []byte(`{"lat":20.1391,"lon":-98.6721}`))

	snapshots := gestor.GetSnapshots()
	mroot := gestor.GetMerkleRoot()
	fmt.Printf("Gestión Yun Snapshots: %d\n", len(snapshots))
	fmt.Printf("Merkle Root: %s\n", mroot)
	fmt.Printf("Vector Clock: %v\n\n", gestor.GetVectorClock())

	proof := yun.GenerateProof(snapshots, 0)
	if proof != nil {
		valid := yun.VerifyProof(*proof)
		fmt.Printf("Merkle Proof valid: %v\n", valid)
	}

	// ─── Sync Mode Test ───
	fmt.Println()
	fmt.Printf("Sync Mode: %s\n", engine.GetSyncMode())
	isolated := engine.EnterDegradedIsolation()
	fmt.Printf("Entered isolation: %v\n", isolated)
	fmt.Printf("Sync Mode after isolation: %s\n", engine.GetSyncMode())
	recovered := engine.AttemptRecovery()
	fmt.Printf("Recovery attempt: %v\n", recovered)
	fmt.Printf("Sync Mode after recovery: %s\n", engine.GetSyncMode())
	engine.CompleteRecovery()
	fmt.Printf("Sync Mode after full recovery: %s\n", engine.GetSyncMode())

	fmt.Println()
	fmt.Println("═══ RDM-SCE Verificación Completa ═══")
}
