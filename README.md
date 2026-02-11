<div align="center">

# WooTUI

**Translate your WooCommerce products with AI—right from your terminal.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

![WooTUI Demo](wootui-demo.png)

[Documentation](https://kkris0.github.io/wootui/) • [Report Bug](https://github.com/kkris0/wootui/issues)

</div>

---

## What is WooTUI?

WooTUI is a terminal application that translates WooCommerce product catalogs into any language using Google's Gemini AI. It's built for speed, efficiency, and WPML integration.

**Key Features:**
- 🚀 Fast batch translation with AI (Gemini 2.5)
- 🌍 Support for 100+ languages
- 📦 WPML-ready CSV output
- 💰 Token optimization with TOON format
- ⌨️ Keyboard-first terminal UI
- 🔒 Local processing—your data stays safe

---

## Installation

### macOS / Linux

```bash
curl -sf https://kkris0.github.io/wootui/install | bash
```

### Windows

```powershell
irm https://kkris0.github.io/wootui/install.ps1 | iex
```

**Requirements:**
- Google Gemini API key ([Get one free](https://aistudio.google.com/app/apikey))
- WooCommerce CSV export with WPML columns

---

## Quick Start

1. **Install WooTUI** using the command above
2. **Run WooTUI** in your terminal:
   ```bash
   wootui
   ```
3. **Configure API key** when prompted (press `s` for Settings)
4. **Follow the wizard**:
   - Select your WooCommerce CSV
   - Choose columns to translate
   - Pick target languages
   - Review cost estimate
   - Translate and export

**First-time user?** Check out the [5-minute tutorial](https://kkris0.github.io/wootui/docs/getting-started/first-translation).

---

## Documentation

Full documentation is available at **[kkris0.github.io/wootui](https://kkris0.github.io/wootui/)**

- [Getting Started](https://kkris0.github.io/wootui/docs/getting-started/installation)
- [WPML Integration](https://kkris0.github.io/wootui/docs/category/wpml-integration)
- [Keyboard Shortcuts](https://kkris0.github.io/wootui/docs/reference/keyboard-shortcuts)
- [Troubleshooting](https://kkris0.github.io/wootui/docs/category/troubleshooting)

---

## Contributing

Contributions are welcome! Here's how you can help:

1. **Report bugs** via [GitHub Issues](https://github.com/kkris0/wootui/issues)
2. **Suggest features** by opening a discussion
3. **Submit PRs** for bug fixes or enhancements

**Development setup:**

```bash
# Clone the repository
git clone https://github.com/kkris0/wootui.git
cd wootui

# Install dependencies
bun install

# Run in development mode
bun run dev

# Build for production
bun run build
```

See [CLAUDE.md](CLAUDE.md) for detailed development guidelines.

---

## Tech Stack

- **[Bun](https://bun.sh)** - Runtime and package manager
- **[OpenTUI](https://github.com/alexwbt/opentui)** - Terminal UI framework
- **[Google Gemini](https://ai.google.dev)** - AI translation
- **[TOON Format](https://www.npmjs.com/package/@toon-format/toon)** - Token optimization
- **React** - UI components

---

## License

MIT © [Kristjan Krizman](https://x.com/kristjankrizman)

---

<div align="center">
Made with ☕ for the WooCommerce founders
</div>
