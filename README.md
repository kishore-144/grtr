<h1 align="center">🚀 grtr — Instant File & Folder Sharing CLI</h1>

<p align="center">
  <b>Fast, local-first file transfer tool for developers.</b><br/>
  Send and receive files or folders instantly over LAN or WAN — all from your terminal.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat-square" />
  <img src="https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-yellow.svg?style=flat-square" />
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20macOS-orange.svg?style=flat-square" />
</p>

---

## 🧭 Overview

`grtr` (**Greater**) is a command-line tool built with **Node.js** for fast and reliable file transfers across devices.  
It lets you share files and folders instantly using human-readable **nicknames** instead of messy IP addresses.

Designed for **developers, IT teams, and local networks**, it’s like “AirDrop for terminals.”

---

## ✨ Features

✅ **Peer-to-Peer (LAN) Transfers** — no cloud dependency  
✅ **Nickname-based system** — `grtr send mypc ./docs`  
✅ **Auto-zip for folders** — sends entire directories easily  
✅ **Simple, scriptable CLI** — perfect for dev workflows  
✅ **Configurable WAN mode** *(coming soon)* for global sharing  
✅ **Cross-platform** — works on Windows, macOS, and Linux  

---

## ⚙️ Installation

### 🧩 Using npm (recommended)

```bash
npm install -g grtr
```

Or, for local testing:

```bash
git clone https://github.com/kishore-144/grtr.git
cd grtr
npm link
```

Then test:
```bash
grtr --help
```

---

## 🖥️ Usage Guide

### 🟢 Start the Receiver (Server)
```bash
grtr serve <nickname>
```

Example:
```bash
grtr serve mypc
```

Optionally specify a custom folder to save received files:
```bash
grtr serve mypc "D:\Received"
```

---

### 🟡 Send Files or Folders
```bash
grtr send <nickname> <path>
```

Examples:
```bash
grtr send mypc ./report.pdf
grtr send mypc "C:\Users\KISHORE B\Desktop\Project Folder"
```

🧠 Tip: `grtr` automatically zips folders before sending for optimal speed.

---

### 🟣 Receive Mode (Manual)
```bash
grtr receive <nickname>
```
Displays listening status and helps users verify setup.

---

### 🔄 Switch Between LAN and WAN
```bash
grtr mode <type>
```
Examples:
```bash
grtr mode lan
grtr mode wan
```

---

### 🌐 Set Custom Relay API (for WAN transfers)
```bash
grtr newapi <url>
```

Example:
```bash
grtr newapi https://relay.grtr.io
```

---

## 🧰 Configuration

All configurations are stored locally in:
```
~/.grtr.json
```

Nickname mappings:
```
~/.grtr-nicknames.json
```

Each nickname maps to its current LAN IP, updated automatically when you run `serve`.

---

## ⚡ Example Workflow

**Device A (Receiver):**
```bash
grtr serve laptop
```
Output:
```
Registered nickname laptop at 192.168.1.10
Serving as 'laptop' on port 5050
```

**Device B (Sender):**
```bash
grtr send laptop ./files/test.txt
```
Output:
```
Sending test.txt to laptop (192.168.1.10)...
Transfer complete!
```

Receiver sees:
```
Received: test.txt
```

---

## 📦 Project Structure

```
grtr/
├── cli.js                # Main CLI entry point
├── index.js              # Exports core functions
├── package.json          # npm metadata and bin config
└── core/
    ├── config.js
    ├── nickname.js
    ├── server.js
    ├── sender.js
    └── receiver.js
```

---

## 🧠 Technology Stack

- **Node.js** (v18+)
- **Express** for HTTP handling
- **Axios** for transfers
- **Archiver** for zipping folders
- **Multer** for uploads
- **Commander.js** for CLI parsing
- **Chalk** for colorful output

---

## 🛠️ Development Setup

Clone the repo and link it globally:
```bash
git clone https://github.com/kishore-144/grtr.git
cd grtr
npm install
npm link
```

Run locally:
```bash
node cli.js serve mypc
```

Unlink when done:
```bash
npm unlink -g grtr
```

---

## 🔒 Firewall & Connectivity Notes

If transfers fail with `ECONNREFUSED`, check:
- Receiver is running (`grtr serve`)
- Both devices are on same LAN
- Windows Firewall allows **Node.js** inbound connections

---

## 🚧 Upcoming Features

- 🌍 **WAN Relay Mode** — send files globally using WebSocket signaling  
- 📦 **Auto-Unzip on Receive**  
- 🔁 **Progress bars and speed metrics**  
- 🔐 **Optional encrypted transfer mode**

---

## 👨‍💻 Author

**Kishore B**  
🎓 B.Tech Computer Science & Engineering  
💡 Passionate about decentralized systems and developer tools  
🔗 [GitHub: kishore-144](https://github.com/kishore-144)

---

## 📜 License

Licensed under the **MIT License** — free to use, modify, and distribute.

---

<p align="center">
  <b>⚡ Built by a developer, for developers. Simple. Fast. Powerful. ⚡</b>
</p>
