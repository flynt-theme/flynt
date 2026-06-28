// gen-palette generates palette.json from the canonical palette definition.
//
// Usage:
//
//	go run . --out ../../docs/palette.json
package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"math"
	"os"
)

// ── Source of truth ───────────────────────────────────────────────────────────

var hues = map[string]float64{
	"ember": 5, "clay": 23, "amber": 45, "moss": 75, "fern": 105,
	"teal": 175, "delft": 208, "iris": 258, "plum": 328, "rose": 345,
}

var saturations = map[string]float64{
	"ember": 65, "clay": 55, "amber": 65, "moss": 45, "fern": 40,
	"teal": 40, "delft": 45, "iris": 50, "plum": 50, "rose": 60,
}

var lightness = map[string]float64{
	"50": 91, "100": 87, "150": 81, "200": 76,
	"300": 64, "400": 53, "500": 47, "600": 42,
	"700": 36, "800": 27, "850": 21, "900": 16, "950": 11,
}

var shadeOrder = []string{
	"50", "100", "150", "200",
	"300", "400", "500", "600",
	"700", "800", "850", "900", "950",
}

// Accent names in display order.
var accentOrder = []string{
	"ember", "clay", "amber", "moss", "fern",
	"teal", "delft", "iris", "plum", "rose",
}

var darkBase = []baseToken{
	{Token: "bg", Hex: "100E0C"},
	{Token: "bg-2", Hex: "1C1916"},
	{Token: "bg-3", Hex: "262220"},
	{Token: "bg-4", Hex: "322F2B"},
	{Token: "bg-5", Hex: "403C38"},
	{Token: "tx-5", Hex: "584F45"},
	{Token: "tx-4", Hex: "79685A"},
	{Token: "tx-3", Hex: "A89A88"},
	{Token: "tx-2", Hex: "D8CEBC"},
	{Token: "tx", Hex: "F5EDD8"},
}

var lightBase = []baseToken{
	{Token: "bg", Hex: "FFFCEF"},
	{Token: "bg-2", Hex: "F2EDDE"},
	{Token: "bg-3", Hex: "E5DFD0"},
	{Token: "bg-4", Hex: "D5CFC0"},
	{Token: "bg-5", Hex: "C0B9AA"},
	{Token: "tx-5", Hex: "B2A899"},
	{Token: "tx-4", Hex: "8E806F"},
	{Token: "tx-3", Hex: "6A5C4C"},
	{Token: "tx-2", Hex: "3D3228"},
	{Token: "tx", Hex: "1A1512"},
}

// ── Output schema ─────────────────────────────────────────────────────────────

type baseToken struct {
	Token string `json:"token"`
	Hex   string `json:"hex"`
}

type accentToken struct {
	Token  string            `json:"token"`
	Hex    string            `json:"hex"`
	Shades map[string]string `json:"shades"`
}

type palette struct {
	Info    map[string]string `json:"_info"`
	Shades  map[string]map[string]string `json:"shades"`
	Dark    []json.RawMessage `json:"dark"`
	Light   []json.RawMessage `json:"light"`
}

// ── HSL → hex (matches palette.js hslToHex exactly) ─────────────────────────

func hslToHex(h, s, l float64) string {
	s /= 100
	l /= 100
	a := s * math.Min(l, 1-l)
	f := func(n float64) int {
		k := math.Mod(n+h/30, 12)
		v := l - a*math.Max(math.Min(math.Min(k-3, 9-k), 1), -1)
		return int(math.Round(v * 255))
	}
	return fmt.Sprintf("%02X%02X%02X", f(0), f(8), f(4))
}

// ── Main ──────────────────────────────────────────────────────────────────────

func main() {
	outPath := flag.String("out", "../../docs/palette.json", "output path for palette.json")
	flag.Parse()

	// Build shades for every accent.
	allShades := make(map[string]map[string]string, len(accentOrder))
	for _, name := range accentOrder {
		h := hues[name]
		s := saturations[name]
		row := make(map[string]string, len(shadeOrder))
		for _, sh := range shadeOrder {
			row[sh] = "#" + hslToHex(h, s, lightness[sh])
		}
		allShades[name] = row
	}

	// Build variant token lists: base tokens + accent tokens (with shades).
	buildVariant := func(base []baseToken) []json.RawMessage {
		tokens := make([]json.RawMessage, 0, len(base)+len(accentOrder))
		for _, t := range base {
			b, _ := json.Marshal(t)
			tokens = append(tokens, b)
		}
		for _, name := range accentOrder {
			t := accentToken{
				Token:  name,
				Hex:    allShades[name]["500"][1:], // strip leading #
				Shades: allShades[name],
			}
			b, _ := json.Marshal(t)
			tokens = append(tokens, b)
		}
		return tokens
	}

	p := palette{
		Info: map[string]string{
			"name":        "Flynt",
			"description": "Warm tones. Zero visual noise.",
			"version":     "0.1.1",
		},
		Shades: allShades,
		Dark:   buildVariant(darkBase),
		Light:  buildVariant(lightBase),
	}

	out, err := os.Create(*outPath)
	if err != nil {
		fmt.Fprintln(os.Stderr, "error:", err)
		os.Exit(1)
	}
	defer out.Close()

	enc := json.NewEncoder(out)
	enc.SetIndent("", "\t")
	if err := enc.Encode(p); err != nil {
		fmt.Fprintln(os.Stderr, "error:", err)
		os.Exit(1)
	}
	fmt.Println("wrote", *outPath)
}
