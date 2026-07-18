package yun

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"sort"
	"sync"
	"time"
)

type VectorClock struct {
	mu    sync.RWMutex
	clock map[string]int
	node  string
}

func NewVectorClock(node string) *VectorClock {
	return &VectorClock{
		clock: make(map[string]int),
		node:  node,
	}
}

func (vc *VectorClock) Tick() map[string]int {
	vc.mu.Lock()
	defer vc.mu.Unlock()
	vc.clock[vc.node]++
	result := make(map[string]int)
	for k, v := range vc.clock {
		result[k] = v
	}
	return result
}

func (vc *VectorClock) Get() map[string]int {
	vc.mu.RLock()
	defer vc.mu.RUnlock()
	result := make(map[string]int)
	for k, v := range vc.clock {
		result[k] = v
	}
	return result
}

func (vc *VectorClock) Merge(remote map[string]int) bool {
	vc.mu.Lock()
	defer vc.mu.Unlock()
	conflict := false
	for node, ts := range remote {
		local, exists := vc.clock[node]
		if ts > 0 && exists && local > ts {
			conflict = true
		}
		if ts > local {
			vc.clock[node] = ts
		}
	}
	return conflict
}

type MerkleNode struct {
	Hash  string
	Left  *MerkleNode
	Right *MerkleNode
}

type Snapshot struct {
	TwinID      string `json:"twin_id"`
	Timestamp   int64  `json:"timestamp"`
	FederationID int   `json:"federation_id"`
	NodeID      string `json:"node_id"`
	Sequence    int    `json:"sequence"`
	PrevHash    string `json:"previous_hash"`
	Data        []byte `json:"data"`
}

func hashSnapshot(s Snapshot) string {
	raw := fmt.Sprintf("%s-%d-%d-%s-%d-%s", s.TwinID, s.Timestamp, s.FederationID, s.NodeID, s.Sequence, s.PrevHash)
	h := sha256.Sum256([]byte(raw))
	return hex.EncodeToString(h[:])
}

func BuildMerkleTree(snapshots []Snapshot) *MerkleNode {
	if len(snapshots) == 0 {
		return nil
	}
	hashes := make([]string, len(snapshots))
	for i, s := range snapshots {
		hashes[i] = hashSnapshot(s)
	}
	nodes := make([]MerkleNode, len(hashes))
	for i, h := range hashes {
		nodes[i] = MerkleNode{Hash: h}
	}
	for len(nodes) > 1 {
		next := make([]MerkleNode, 0, (len(nodes)+1)/2)
		for i := 0; i < len(nodes); i += 2 {
			if i+1 < len(nodes) {
				combined := sha256.Sum256([]byte(nodes[i].Hash + nodes[i+1].Hash))
				next = append(next, MerkleNode{
					Hash:  hex.EncodeToString(combined[:]),
					Left:  &nodes[i],
					Right: &nodes[i+1],
				})
			} else {
				next = append(next, nodes[i])
			}
		}
		nodes = next
	}
	return &nodes[0]
}

func GetMerkleRoot(snapshots []Snapshot) string {
	tree := BuildMerkleTree(snapshots)
	if tree == nil {
		return "0"
	}
	return tree.Hash
}

type MerkleProof struct {
	LeafHash   string   `json:"leaf_hash"`
	RootHash   string   `json:"root_hash"`
	Siblings   []string `json:"siblings"`
	PathIndices []int   `json:"path_indices"`
}

func GenerateProof(snapshots []Snapshot, targetIndex int) *MerkleProof {
	if targetIndex < 0 || targetIndex >= len(snapshots) {
		return nil
	}
	hashes := make([]string, len(snapshots))
	for i, s := range snapshots {
		hashes[i] = hashSnapshot(s)
	}
	leafHash := hashes[targetIndex]
	rootHash := GetMerkleRoot(snapshots)

	siblings := []string{}
	pathIndices := []int{}
	levelHashes := make([]string, len(hashes))
	copy(levelHashes, hashes)
	idx := targetIndex

	for len(levelHashes) > 1 {
		nextLevel := []string{}
		for i := 0; i < len(levelHashes); i += 2 {
			if i+1 < len(levelHashes) {
				combined := sha256.Sum256([]byte(levelHashes[i] + levelHashes[i+1]))
				nextLevel = append(nextLevel, hex.EncodeToString(combined[:]))
				if i == idx || i+1 == idx {
					sibling := levelHashes[i+1]
					if i+1 == idx {
						sibling = levelHashes[i]
						pathIndices = append(pathIndices, 0)
					} else {
						pathIndices = append(pathIndices, 1)
					}
					siblings = append(siblings, sibling)
				}
				idx = idx / 2
			} else {
				nextLevel = append(nextLevel, levelHashes[i])
				if i == idx {
					idx = idx / 2
				}
			}
		}
		levelHashes = nextLevel
	}

	return &MerkleProof{
		LeafHash:    leafHash,
		RootHash:    rootHash,
		Siblings:    siblings,
		PathIndices: pathIndices,
	}
}

func VerifyProof(proof MerkleProof) bool {
	current := proof.LeafHash
	for i, sibling := range proof.Siblings {
		var combined []byte
		if proof.PathIndices[i] == 0 {
			combined = []byte(current + sibling)
		} else {
			combined = []byte(sibling + current)
		}
		h := sha256.Sum256(combined)
		current = hex.EncodeToString(h[:])
	}
	return current == proof.RootHash
}

type ReconciliationResult struct {
	LocalOnly  []string `json:"local_only"`
	RemoteOnly []string `json:"remote_only"`
	Conflicts  int      `json:"conflicts"`
	Resolved   bool     `json:"resolved"`
}

func ReconcileLocalSnapshots(local []Snapshot, remoteHashes map[string]string) ReconciliationResult {
	localOnly := []string{}
	remoteOnly := []string{}
	conflicts := 0

	localMap := make(map[string]Snapshot)
	for _, s := range local {
		localMap[s.TwinID] = s
	}

	for _, s := range local {
		h := hashSnapshot(s)
		rh, exists := remoteHashes[s.TwinID]
		if !exists {
			localOnly = append(localOnly, s.TwinID)
		} else if h != rh {
			conflicts++
		}
	}

	for twinID := range remoteHashes {
		if _, exists := localMap[twinID]; !exists {
			remoteOnly = append(remoteOnly, twinID)
		}
	}

	sort.Strings(localOnly)
	sort.Strings(remoteOnly)

	return ReconciliationResult{
		LocalOnly:  localOnly,
		RemoteOnly: remoteOnly,
		Conflicts:  conflicts,
		Resolved:   conflicts == 0,
	}
}

type GestorYun struct {
	snapshots []Snapshot
	mu        sync.Mutex
	clock     *VectorClock
}

func NewGestorYun(nodeID string) *GestorYun {
	return &GestorYun{
		snapshots: []Snapshot{},
		clock:     NewVectorClock(nodeID),
	}
}

func (g *GestorYun) IngestSnapshot(twinID string, federationID int, nodeID string, data []byte) Snapshot {
	g.mu.Lock()
	defer g.mu.Unlock()

	prevHash := "0"
	if len(g.snapshots) > 0 {
		prevHash = hashSnapshot(g.snapshots[len(g.snapshots)-1])
	}

	snap := Snapshot{
		TwinID:       twinID,
		Timestamp:    time.Now().UnixMilli(),
		FederationID: federationID,
		NodeID:       nodeID,
		Sequence:     len(g.snapshots) + 1,
		PrevHash:     prevHash,
		Data:         data,
	}

	g.snapshots = append(g.snapshots, snap)
	g.clock.Tick()
	return snap
}

func (g *GestorYun) GetMerkleRoot() string {
	g.mu.Lock()
	defer g.mu.Unlock()
	return GetMerkleRoot(g.snapshots)
}

func (g *GestorYun) GetSnapshots() []Snapshot {
	g.mu.Lock()
	defer g.mu.Unlock()
	result := make([]Snapshot, len(g.snapshots))
	copy(result, g.snapshots)
	return result
}

func (g *GestorYun) GetVectorClock() map[string]int {
	return g.clock.Get()
}
