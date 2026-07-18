package sce

import (
	"context"
	"errors"
	"fmt"
	"net"
	"sync"
	"sync/atomic"
	"time"
)

type IPContext struct {
	IP              net.IP    `json:"ip"`
	CountryCode     string    `json:"country_code"`
	RegionCode      string    `json:"region_code"`
	City            string    `json:"city"`
	Latitude        float64   `json:"latitude"`
	Longitude       float64   `json:"longitude"`
	ASN             int       `json:"asn"`
	ISP             string    `json:"isp"`
	ThreatScore     float64   `json:"threat_score"`
	IsProxy         bool      `json:"is_proxy"`
	DataSovereignty string    `json:"data_sovereignty_zone"`
	ResolvedAt      time.Time `json:"resolved_at"`
}

type Jurisdiction struct {
	AllowedCountries     []string
	RequiresLocalHosting bool
	PriorityRank         int
}

type GeolocationProvider interface {
	Name() string
	Resolve(ctx context.Context, ip net.IP) (*IPContext, error)
	Priority() int
	IsHealthy() bool
	Jurisdiction() *Jurisdiction
}

type ProviderRegistry struct {
	providers atomic.Value
	mu        sync.Mutex
}

func NewProviderRegistry() *ProviderRegistry {
	reg := &ProviderRegistry{}
	reg.providers.Store(make([]GeolocationProvider, 0))
	return reg
}

func (pr *ProviderRegistry) RegisterProvider(p GeolocationProvider) {
	pr.mu.Lock()
	defer pr.mu.Unlock()

	current := pr.providers.Load().([]GeolocationProvider)
	newSlice := make([]GeolocationProvider, len(current)+1)
	copy(newSlice, current)
	newSlice[len(current)] = p

	for i := 0; i < len(newSlice)-1; i++ {
		for j := i + 1; j < len(newSlice); j++ {
			if newSlice[i].Priority() < newSlice[j].Priority() {
				newSlice[i], newSlice[j] = newSlice[j], newSlice[i]
			}
		}
	}
	pr.providers.Store(newSlice)
}

func (pr *ProviderRegistry) ResolveIP(ctx context.Context, ip net.IP, targetCountry string, requireSovereign bool) (*IPContext, error) {
	activeProviders, ok := pr.providers.Load().([]GeolocationProvider)
	if !ok || len(activeProviders) == 0 {
		return nil, errors.New("rdm.sce: no existen proveedores registrados")
	}

	for _, provider := range activeProviders {
		if !provider.IsHealthy() {
			continue
		}
		juris := provider.Jurisdiction()
		if requireSovereign && !juris.RequiresLocalHosting {
			continue
		}
		match := false
		for _, c := range juris.AllowedCountries {
			if c == targetCountry || c == "*" {
				match = true
				break
			}
		}
		if !match {
			continue
		}
		res, err := provider.Resolve(ctx, ip)
		if err == nil && res != nil {
			res.ResolvedAt = time.Now().UTC()
			return res, nil
		}
	}
	return nil, fmt.Errorf("rdm.sce: fallo catastrófico en resolución soberana para IP: %s", ip.String())
}

type SovereignProvider struct {
	name     string
	priority int
	healthy  bool
}

func NewSovereignProvider(name string, priority int) *SovereignProvider {
	return &SovereignProvider{name: name, priority: priority, healthy: true}
}

func (m *SovereignProvider) Name() string                         { return m.name }
func (m *SovereignProvider) Priority() int                        { return m.priority }
func (m *SovereignProvider) IsHealthy() bool                      { return m.healthy }
func (m *SovereignProvider) MarkUnhealthy()                       { m.healthy = false }
func (m *SovereignProvider) MarkHealthy()                         { m.healthy = true }
func (m *SovereignProvider) Jurisdiction() *Jurisdiction {
	return &Jurisdiction{
		AllowedCountries:     []string{"MX", "*"},
		RequiresLocalHosting: true,
		PriorityRank:         100,
	}
}
func (m *SovereignProvider) Resolve(ctx context.Context, ip net.IP) (*IPContext, error) {
	return &IPContext{
		IP:              ip,
		CountryCode:     "MX",
		RegionCode:      "HGO",
		City:            "Mineral del Monte",
		Latitude:        20.1383,
		Longitude:       -98.6736,
		ASN:             13039,
		ISP:             "Red_Mesh_TAMV_Local",
		ThreatScore:     0.01,
		IsProxy:         false,
		DataSovereignty: "MX_Local_Territory",
		ResolvedAt:      time.Now(),
	}, nil
}

type SyncMode string

const (
	SyncOnline      SyncMode = "online_synchronized"
	SyncOffline     SyncMode = "offline_autonomous"
	SyncDegraded    SyncMode = "degraded_isolation"
)

type SyncMachine struct {
	current SyncMode
	mu      sync.RWMutex
}

func NewSyncMachine(initial SyncMode) *SyncMachine {
	return &SyncMachine{current: initial}
}

func (sm *SyncMachine) Get() SyncMode {
	sm.mu.RLock()
	defer sm.mu.RUnlock()
	return sm.current
}

func (sm *SyncMachine) Transition(to SyncMode) bool {
	sm.mu.Lock()
	defer sm.mu.Unlock()
	allowed := map[SyncMode]map[SyncMode]bool{
		SyncOnline:  {SyncOffline: true, SyncDegraded: true},
		SyncOffline: {SyncOnline: true, SyncDegraded: true},
		SyncDegraded: {SyncOffline: true},
	}
	if !allowed[sm.current][to] {
		return false
	}
	sm.current = to
	return true
}

type FederationState struct {
	FederationID int              `json:"federation_id"`
	NodeID       string           `json:"node_id"`
	SyncMode     SyncMode         `json:"sync_mode"`
	VectorClock  map[string]int   `json:"vector_clock"`
}

type SndTState struct {
	TwinID         string           `json:"twin_id"`
	TwinType       string           `json:"twin_type"`
	Timestamp      int64            `json:"timestamp"`
	Latitude       float64          `json:"latitude"`
	Longitude      float64          `json:"longitude"`
	Altitude       float64          `json:"altitude"`
	FederationID   int              `json:"federation_id"`
	SyncMode       SyncMode         `json:"sync_mode"`
	ThreatLevel    string           `json:"threat_level"`
	MotionType     string           `json:"motion_type"`
	Confidence     float64          `json:"confidence_score"`
}

type SceEngine struct {
	registry     *ProviderRegistry
	syncMachine  *SyncMachine
	nodeID       string
}

func NewSceEngine(nodeID string) *SceEngine {
	return &SceEngine{
		registry:    NewProviderRegistry(),
		syncMachine: NewSyncMachine(SyncOnline),
		nodeID:      nodeID,
	}
}

func (e *SceEngine) GetRegistry() *ProviderRegistry         { return e.registry }
func (e *SceEngine) GetSyncMode() SyncMode                  { return e.syncMachine.Get() }
func (e *SceEngine) GetNodeID() string                      { return e.nodeID }

func (e *SceEngine) EnterDegradedIsolation() bool {
	return e.syncMachine.Transition(SyncDegraded)
}

func (e *SceEngine) AttemptRecovery() bool {
	if e.syncMachine.Get() == SyncDegraded {
		return e.syncMachine.Transition(SyncOffline)
	}
	return false
}

func (e *SceEngine) CompleteRecovery() bool {
	if e.syncMachine.Get() == SyncOffline {
		return e.syncMachine.Transition(SyncOnline)
	}
	return false
}

func (e *SceEngine) BuildSndTState(twinID, twinType string, lat, lon, alt float64, fedID int, threatLevel, motionType string, confidence float64) SndTState {
	return SndTState{
		TwinID:       twinID,
		TwinType:     twinType,
		Timestamp:    time.Now().UnixMilli(),
		Latitude:     lat,
		Longitude:    lon,
		Altitude:     alt,
		FederationID: fedID,
		SyncMode:     e.syncMachine.Get(),
		ThreatLevel:  threatLevel,
		MotionType:   motionType,
		Confidence:   confidence,
	}
}
