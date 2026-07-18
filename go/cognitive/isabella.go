package cognitive

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"time"
)

type DecisionType string

const (
	PolicyAllow          DecisionType = "ALLOW_PURE_RESOLUTION"
	PolicyDegradeSpatial DecisionType = "DEGRADE_SPATIAL_GRANULARITY"
	PolicyDenyAnonymize  DecisionType = "DENY_AND_ANONYMIZE"
)

type TwinType string

const (
	TwinMerchantNode       TwinType = "merchant_node"
	TwinSmartTourism       TwinType = "smart_tourism_twin"
	TwinCriticalInfra      TwinType = "critical_infrastructure"
	TwinLocalLogistics     TwinType = "local_logistics_asset"
)

type CognitiveEvaluationContext struct {
	TwinType         TwinType  `json:"twin_type"`
	ConfidenceScore  float64   `json:"confidence_score"`
	NetworkRiskLevel string    `json:"network_risk_level"`
	RequestedAccuracy string   `json:"requested_accuracy"`
	Timestamp        time.Time `json:"timestamp"`
}

type IsabellaDecision struct {
	PolicyID           string       `json:"policy_id"`
	Verdict            DecisionType `json:"verdict"`
	AppliedMaskBits    int          `json:"applied_mask_bits"`
	RequiredObfuscation bool        `json:"required_obfuscation"`
	Rationale          string       `json:"rationale"`
}

type EthicalOperationalTree struct {
	Version string
	secret  []byte
}

func NewEthicalTree(secret []byte) *EthicalOperationalTree {
	return &EthicalOperationalTree{
		Version: "v1.0.0-cognitive-core",
		secret:  secret,
	}
}

func (et *EthicalOperationalTree) EvaluateTransaction(ctx *CognitiveEvaluationContext) (*IsabellaDecision, error) {
	if ctx == nil {
		return nil, errors.New("isabella.cognitive: contexto de evaluación nulo")
	}

	decision := &IsabellaDecision{
		RequiredObfuscation: false,
		AppliedMaskBits:     0,
	}

	if ctx.NetworkRiskLevel == "critical" || ctx.NetworkRiskLevel == "high" {
		decision.Verdict = PolicyDenyAnonymize
		decision.Rationale = "Riesgo crítico de red detectado. Bloqueo inmediato de coordenadas de alta resolución."
		decision.PolicyID = et.generatePolicyHash(decision.Rationale, ctx.Timestamp)
		return decision, nil
	}

	if ctx.TwinType == TwinSmartTourism {
		if ctx.ConfidenceScore < 0.75 && ctx.RequestedAccuracy == "high_precision" {
			decision.Verdict = PolicyDegradeSpatial
			decision.RequiredObfuscation = true
			decision.AppliedMaskBits = 24
			decision.Rationale = "Baja puntuación de confianza de origen para dispositivo turístico. Degradación forzada."
			decision.PolicyID = et.generatePolicyHash(decision.Rationale, ctx.Timestamp)
			return decision, nil
		}
	}

	decision.Verdict = PolicyAllow
	decision.Rationale = "Cumplimiento estricto de políticas operativas verificado por el ecosistema."
	decision.PolicyID = et.generatePolicyHash(decision.Rationale, ctx.Timestamp)
	return decision, nil
}

func (et *EthicalOperationalTree) SignPayload(payload []byte) string {
	mac := hmac.New(sha256.New, et.secret)
	mac.Write(payload)
	return hex.EncodeToString(mac.Sum(nil))
}

func (et *EthicalOperationalTree) generatePolicyHash(rationale string, ts time.Time) string {
	h := sha256.New()
	h.Write([]byte(fmt.Sprintf("%s-%d-%s", rationale, ts.UnixNano(), et.Version)))
	return "ISABELLA-POLICY-" + hex.EncodeToString(h.Sum(nil))[:16]
}
