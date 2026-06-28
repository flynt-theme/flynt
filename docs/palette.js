const P = {
    hues: {
        ember: 5,
        clay: 23,
        amber: 45,
        moss: 75,
        fern: 105,
        teal: 175,
        delft: 208,
        iris: 258,
        plum: 328,
        rose: 345,
    },
    saturations: {
        ember: 65, clay: 55, amber: 65,
        moss: 45, fern: 40, teal: 40,
        delft: 45, iris: 50, plum: 50, rose: 60,
    },
    shades: [
        "50", "100", "150", "200",
        "300", "400", "500", "600",
        "700", "800", "850", "900", "950",
    ],
    lightness: {
        50: 91, 100: 87, 150: 81, 200: 76,
        300: 64, 400: 53, 500: 47, 600: 42,
        700: 36, 800: 27, 850: 21, 900: 16, 950: 11,
    },
    primaryShade: { dark: "500", light: "500" },
    base: {
        dark: {
            bg: "#100E0C",
            "bg-2": "#1C1916",
            "bg-3": "#262220",
            "bg-4": "#322F2B",
            "bg-5": "#403C38",
            tx: "#F5EDD8",
            "tx-2": "#D8CEBC",
            "tx-3": "#A89A88",
            "tx-4": "#79685A",
            "tx-5": "#584F45",
        },
        light: {
            bg: "#FFFCEF",
            "bg-2": "#F2EDDE",
            "bg-3": "#E5DFD0",
            "bg-4": "#D5CFC0",
            "bg-5": "#C0B9AA",
            tx: "#1A1512",
            "tx-2": "#3D3228",
            "tx-3": "#6A5C4C",
            "tx-4": "#8E806F",
            "tx-5": "#B2A899",
        },
    },
};

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => {
        const k = (n + h / 30) % 12;
        return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)))
            .toString(16)
            .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

const accents = {};
for (const [name, hue] of Object.entries(P.hues)) {
    accents[name] = {};
    for (const sh of P.shades)
        accents[name][sh] = hslToHex(hue, P.saturations[name], P.lightness[sh]);
}

const urlTheme = new URLSearchParams(window.location.search).get("theme");
let theme = urlTheme === "dark" || urlTheme === "light" ? urlTheme : "dark";
document.documentElement.dataset.theme = theme;

const base = () => P.base[theme];
const primary = (name) => accents[name][P.primaryShade[theme]];
const tokenHex = (token) => base()[token] ?? primary(token);

// ── Toast ─────────────────────────────────────────────

function copy(hex, event) {
    navigator.clipboard?.writeText(hex);
    const toast = document.getElementById("toast");
    toast.textContent = "copied " + hex;
    toast.classList.remove("show");
    if (event) {
        toast.style.left = event.pageX + "px";
        toast.style.top = (event.pageY - 8) + "px";
        toast.style.transform = "translate(-50%, -100%)";
    }
    void toast.offsetWidth;
    toast.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove("show"), 1400);
}

// ── Preview ───────────────────────────────────────────

const PREVIEW_LINES = [
    [
        { t: "plum", w: 44 },
        { t: "plum", w: 8 },
        { t: "tx-3", w: 36 },
        { t: "tx-3", w: 8 },
        { t: "tx-3", w: 30 },
        { t: "plum", w: 8 },
        { t: "tx-2", w: 26 },
        { t: "delft", w: 66 },
    ],
    null,
    [{ t: "clay", w: 72 }],
    [
        { t: "moss", w: 34 },
        { t: "tx", w: 66 },
        { t: "tx-2", w: 40 },
        { t: "moss", w: 56 },
        { t: "tx", w: 8 },
    ],
    null,
    [
        { t: "amber", w: 54 },
        { t: "tx", w: 8 },
        { t: "tx-3", w: 52 },
        { t: "tx", w: 8 },
        { t: "fern", w: 40 },
        { t: "tx", w: 8 },
        { t: "fern", w: 58 },
        { cursor: true },
    ],
    [
        { t: "tx-3", w: 36 },
        { t: "tx-3", w: 24 },
        { t: "rose", w: 8 },
        { t: "delft", w: 38 },
        { t: "iris", w: 8 },
        { t: "tx-3", w: 16 },
        { t: "iris", w: 8 },
        { t: "delft", w: 14 },
    ],
    [
        { t: "tx-3", w: 36 },
        { t: "tx-3", w: 22 },
        { t: "rose", w: 8 },
        { t: "tx-2", w: 34 },
        { t: "amber", w: 38 },
        { t: "tx", w: 8 },
        { t: "tx-3", w: 22 },
        { t: "tx", w: 8 },
    ],
    [
        { t: "tx-2", w: 14 },
        { t: "tx", w: 8 },
        { t: "tx-3", w: 22 },
        { t: "tx-4", w: 36 },
        { t: "rose", w: 24 },
        { t: "teal", w: 24 },
        { t: "tx", w: 8 },
        { t: "tx", w: 8 },
    ],
    [
        { t: "plum", w: 34 },
        { t: "tx-2", w: 22 },
        { t: "moss", w: 36 },
        { t: "tx", w: 8 },
        { t: "delft", w: 58 },
        { t: "tx", w: 8 },
    ],
    [{ t: "tx", w: 8 }],
    [{ t: "tx-5", w: 130 }],
    [
        { t: "plum", w: 40 },
        { t: "tx-3", w: 22 },
        { t: "tx", w: 8 },
        { t: "amber", w: 30 },
        { t: "tx", w: 8 },
        { t: "tx", w: 8 },
        { t: "tx-2", w: 16 },
        { t: "fern", w: 34 },
    ],
    [{ t: "tx", w: 8 }],
];
const ACTIVE_LINE = 5;

const SIDEBAR_ITEMS = [
    { t: "tx-3", w: 60, indent: 0 },
    { t: "tx-4", w: 52, indent: 1 },
    { t: "tx-2", w: 56, indent: 1 },
    { t: "tx-4", w: 44, indent: 1 },
    { t: "tx-3", w: 56, indent: 0 },
    { t: "tx-4", w: 48, indent: 1 },
    { t: "tx-4", w: 38, indent: 1 },
    { t: "tx-3", w: 36, indent: 0 },
    { t: "tx-4", w: 40, indent: 1 },
];

const GUTTER_WS = [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14];

function renderPreview() {
    const b = base();
    const win = document.getElementById("preview-window");
    const pri = P.primaryShade[theme];

    const sidebar = SIDEBAR_ITEMS.map(
        ({ t, w, indent }) =>
            `<div class="sidebar-item" style="padding-left:${12 + indent * 14}px">
      <div class="blk" style="background:${b[t]};width:${w}px"></div>
    </div>`,
    ).join("");

    const gutter = PREVIEW_LINES.map(
        (_, i) =>
            `<div class="gutter-line">
      <div class="blk" style="background:${b["tx-4"]};width:${GUTTER_WS[i] || 14}px;height:6px"></div>
    </div>`,
    ).join("");

    const lines = PREVIEW_LINES.map((segs, i) => {
        const cls = i === ACTIVE_LINE ? "code-line active" : "code-line";
        if (!segs) return `<div class="${cls}"></div>`;
        const blocks = segs
            .map((s) =>
                s.cursor
                    ? `<div class="cursor"></div>`
                    : `<div class="blk" style="background:${tokenHex(s.t)};width:${s.w}px"></div>`,
            )
            .join("");
        return `<div class="${cls}">${blocks}</div>`;
    }).join("");

    win.innerHTML = `
    <div class="preview-titlebar">
      <div class="traffic-lights">
        <div class="traffic" style="background:${accents.ember[pri]}"></div>
        <div class="traffic" style="background:${accents.amber[pri]}"></div>
        <div class="traffic" style="background:${accents.moss[pri]}"></div>
      </div>
      <div class="tab-strip">
        <div class="preview-tab">
          <div class="blk" style="background:${b["tx-3"]};width:54px;height:6px"></div>
          <div class="blk" style="background:${b["tx-4"]};width:10px;height:6px"></div>
        </div>
        <div class="preview-tab-inactive">
          <div class="blk" style="background:${b["tx-4"]};width:48px;height:6px"></div>
        </div>
      </div>
    </div>
    <div class="preview-body">
      <div class="preview-sidebar">${sidebar}</div>
      <div class="preview-editor">
        <div class="preview-gutter">${gutter}</div>
        <div class="preview-code">${lines}</div>
      </div>
    </div>
    <div class="preview-statusbar">
      <div class="blk" style="background:${primary("amber")};width:38px;height:6px"></div>
      <div class="blk" style="background:${b["tx-4"]};width:54px;height:6px"></div>
      <div class="blk" style="background:${b["tx-4"]};width:42px;height:6px"></div>
    </div>
  `;
}

// ── Swatches ──────────────────────────────────────────

function makeSwatch(name, hex) {
    const el = document.createElement("div");
    el.className = "swatch";
    el.title = `${name}: ${hex} - click to copy`;
    el.onclick = (e) => copy(hex, e);
    el.innerHTML = `<div class="chip" style="background:${hex}"></div><div class="chip-name">${name}</div><div class="chip-hex">${hex}</div>`;
    return el;
}

function renderBase() {
    const b = base();
    const bgEl = document.getElementById("base-bg");
    const txEl = document.getElementById("base-tx");
    bgEl.innerHTML = txEl.innerHTML = "";
    ["bg", "bg-2", "bg-3", "bg-4", "bg-5"].forEach((k) =>
        bgEl.appendChild(makeSwatch(k, b[k])),
    );
    ["tx", "tx-2", "tx-3", "tx-4", "tx-5"].forEach((k) =>
        txEl.appendChild(makeSwatch(k, b[k])),
    );
}

function renderAccents() {
    const row = document.getElementById("accent-row");
    row.innerHTML = "";
    for (const name of Object.keys(P.hues))
        row.appendChild(makeSwatch(name, primary(name)));
}

// ── Shade grid ────────────────────────────────────────

function renderExtended() {
    const grid = document.getElementById("shade-grid");
    grid.innerHTML = "";
    const pri = P.primaryShade[theme];
    grid.style.gridTemplateColumns = `52px repeat(${P.shades.length}, 1fr)`;

    grid.appendChild(document.createElement("div"));
    for (const sh of P.shades) {
        const el = document.createElement("div");
        el.className = "shade-hdr" + (sh === pri ? " primary-col" : "");
        el.textContent = sh;
        grid.appendChild(el);
    }

    for (const [name, shades] of Object.entries(accents)) {
        const lbl = document.createElement("div");
        lbl.className = "shade-name";
        lbl.textContent = name;
        grid.appendChild(lbl);

        for (const sh of P.shades) {
            const hex = shades[sh];
            const cell = document.createElement("div");
            cell.className = "shade-cell" + (sh === pri ? " primary" : "");
            cell.title = `${name}-${sh}: ${hex}`;
            cell.onclick = (e) => copy(hex, e);
            const inner = document.createElement("div");
            inner.className = "shade-inner";
            inner.style.background = hex;
            cell.appendChild(inner);
            grid.appendChild(cell);
        }
    }
}

// ── Style guide ───────────────────────────────────────

const THEAD = `<thead><tr><th>Role</th><th>Token</th><th>Intent</th></tr></thead>`;

function guideRow(r) {
    const hex = tokenHex(r.token);
    return `<tr>
    <td>${r.role}</td>
    <td><span class="token-cell copyable" title="${hex} - click to copy" onclick="copy('${hex}',event)"><span class="dot" style="background:${hex}"></span><code>${r.token}</code></span></td>
    <td>${r.intent}</td>
  </tr>`;
}

const GUIDE = {
    interface: [
        { role: "Accent",  token: "amber", intent: "Primary interactive - focused borders, active tabs, cursor" },
        { role: "Error",   token: "ember", intent: "Errors, failed validation, destructive states" },
        { role: "Warning", token: "clay",  intent: "Warnings, deprecations, recoverable issues" },
        { role: "Success", token: "moss",  intent: "Confirmations, passing tests, added diffs" },
    ],
    syntax: [
        { role: "Keyword",       token: "tx-4",  intent: "Reserved words - muted so they recede behind identifiers" },
        { role: "Operator",      token: "rose",  intent: "Mathematical and logical operators" },
        { role: "String",        token: "delft", intent: "String literals and quoted content" },
        { role: "String escape", token: "iris",  intent: "Escape sequences inside strings" },
        { role: "Number",        token: "teal",  intent: "Numeric literals" },
        { role: "Regex",         token: "iris",  intent: "Regular expressions" },
        { role: "Function",      token: "amber", intent: "Function names at definition and call sites" },
        { role: "Parameter",     token: "tx-2",  intent: "Function parameters - neutral weight" },
        { role: "Variable",      token: "tx-2",  intent: "Variables and general identifiers" },
        { role: "Constant",      token: "tx-2",  intent: "Constants - same weight as variables" },
        { role: "Property",      token: "tx-3",  intent: "Object keys and struct fields" },
        { role: "Type",          token: "fern",  intent: "Built-in type names" },
        { role: "Class",         token: "moss",  intent: "User-defined class and type declarations" },
        { role: "Tag",           token: "moss",  intent: "HTML and JSX element tags" },
        { role: "Decorator",     token: "clay",  intent: "Decorators and annotations" },
        { role: "Namespace",     token: "plum",  intent: "Module and namespace qualifiers" },
        { role: "Comment",       token: "tx-5",  intent: "Comments - very faint, intentionally recedes" },
        { role: "Punctuation",   token: "tx",    intent: "Braces, brackets, delimiters - full contrast" },
    ],
    markup: [
        { role: "Heading",        token: "tx",    intent: "H1 → H6 descend through the text scale" },
        { role: "Bold",           token: "tx-3",  intent: "Bold emphasis - 1 step above body text" },
        { role: "Italic",         token: "tx-5",  intent: "Italic emphasis - 1 step below body text" },
        { role: "Internal link",  token: "amber", intent: "Links to notes within the vault" },
        { role: "External link",  token: "teal",  intent: "Links to external URLs" },
        { role: "Unresolved",     token: "clay",  intent: "Links to notes that don't exist yet" },
        { role: "Code",           token: "moss",  intent: "Inline code and fenced blocks" },
        { role: "Blockquote",     token: "tx-5",  intent: "Quoted passages - very receded" },
        { role: "List marker",    token: "amber", intent: "Bullet points and numbered lists" },
        { role: "Tag",            token: "amber", intent: "Inline tags" },
        { role: "Footnote",       token: "tx-5",  intent: "Footnote references and annotations" },
        { role: "Math",           token: "tx-2",  intent: "Mathematical expressions" },
    ],
};

function renderGuide() {
    ["interface", "syntax", "markup"].forEach((k) => {
        document.getElementById(`t-${k}`).innerHTML =
            THEAD + `<tbody>${GUIDE[k].map(guideRow).join("")}</tbody>`;
    });
    renderTerminal();
}

// ── Terminal ──────────────────────────────────────────

const ANSI = [
    { n: 0,  name: "black",          token: "bg-2" },
    { n: 1,  name: "red",            token: "ember" },
    { n: 2,  name: "green",          token: "moss" },
    { n: 3,  name: "yellow",         token: "amber" },
    { n: 4,  name: "blue",           token: "delft" },
    { n: 5,  name: "magenta",        token: "plum" },
    { n: 6,  name: "cyan",           token: "teal" },
    { n: 7,  name: "white",          token: "tx-2" },
    { n: 8,  name: "bright black",   token: "bg-5" },
    { n: 9,  name: "bright red",     token: "ember", shade: "300" },
    { n: 10, name: "bright green",   token: "moss",  shade: "300" },
    { n: 11, name: "bright yellow",  token: "amber", shade: "300" },
    { n: 12, name: "bright blue",    token: "delft", shade: "300" },
    { n: 13, name: "bright magenta", token: "plum",  shade: "300" },
    { n: 14, name: "bright cyan",    token: "teal",  shade: "300" },
    { n: 15, name: "bright white",   token: "tx" },
];

function ansiHex(entry) {
    const b = base();
    if (b[entry.token]) return b[entry.token];
    if (entry.shade) return accents[entry.token][entry.shade];
    return primary(entry.token);
}

function renderTerminal() {
    const rows = ANSI.map((entry) => {
        const hex = ansiHex(entry);
        const label = entry.shade ? `${entry.token}-${entry.shade}` : entry.token;
        return `<tr>
      <td class="ansi-n">${entry.n}</td>
      <td>${entry.name}</td>
      <td><span class="token-cell copyable" title="${hex} - click to copy" onclick="copy('${hex}',event)"><span class="dot" style="background:${hex}"></span><code>${label}</code></span></td>
      <td class="ansi-hex" title="click to copy" onclick="copy('${hex}',event)">${hex}</td>
    </tr>`;
    }).join("");

    document.getElementById("t-terminal").innerHTML =
        `<thead><tr><th>#</th><th>Name</th><th>Token</th><th>Hex</th></tr></thead><tbody>${rows}</tbody>`;
}

// ── Theme switcher ────────────────────────────────────

function renderSwitcher() {
    ["dark", "light"].forEach((t) => {
        const pill = document.getElementById(`pill-${t}`);
        const option = document.getElementById(`mode-${t}`);
        pill.style.background = P.base[t].bg;
        option.classList.toggle("active", t === theme);
    });
}

// ── Render & init ─────────────────────────────────────

function render() {
    renderSwitcher();
    renderPreview();
    renderBase();
    renderAccents();
    renderExtended();
    renderGuide();
}

function setTheme(t) {
    theme = t;
    document.documentElement.dataset.theme = theme;
    render();
}

document.addEventListener("keydown", (e) => {
    if ((e.key === "d" || e.key === "D") && !e.metaKey && !e.ctrlKey)
        setTheme(theme === "dark" ? "light" : "dark");
});

render();
