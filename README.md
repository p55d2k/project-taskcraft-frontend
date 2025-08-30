<div id="top"></div>
<br/>
<div align="center">
  <a href="https://github.com/p55d2k/project-taskcraft-frontend">
    <img src="/public/logo.png" alt="Logo" width="100" height="100">
  </a>
  <h1>TaskCraft</h1>
  <p>A comprehensive project management platform with real-time collaboration, AI-powered tools, and seamless task management.</p>

[![Author](https://img.shields.io/badge/author-p55d2k-lightgrey.svg?style=flat&color=%23673ab7)](https://github.com/p55d2k)
[![GitHub LICENSE](https://img.shields.io/badge/license-MIT-lightgrey.svg?style=flat&color=%232196f3)](https://github.com/p55d2k/project-taskcraft-frontend/LICENSE)
[![Release](https://img.shields.io/github/v/release/p55d2k/project-taskcraft-frontend?style=flat&color=%23009688)](https://github.com/p55d2k/project-taskcraft-frontend/releases)

</div>

## Table of Contents 📜

- [About](#about-)
- [Features](#features-)
- [Tech Stack](#tech-stack-)
- [Requirements](#requirements-)
- [Installation](#installation-)
- [Usage](#usage-)
- [Contributing](#contributing-)
- [License](#license-)

## About 📖

TaskCraft is a modern, full-featured project management platform designed to streamline team collaboration and productivity. Built with Next.js and powered by cutting-edge technologies, it offers real-time document editing, AI-assisted task creation, video meetings, and comprehensive project tracking.

## Features ✨

### 🏗️ Project Management

- Create and manage multiple projects
- Project member management with role-based access
- Project settings and configuration
- Join projects via invitation links

### 📋 Task Management

- Create, assign, and track tasks
- AI-powered task generation
- Task status tracking and updates
- User-friendly task dashboard

### 📝 Collaborative Documents

- Real-time collaborative document editing
- Rich text editor with Lexical
- Live comments and annotations
- Version control and history

### 🤖 AI-Powered Tools

- AI chat assistant for project help
- Text paraphrasing tool
- Citation generator
- Smart task suggestions

### 📹 Meeting Integration

- Video meeting capabilities
- Meeting room setup
- Recording management

### 🔐 Authentication & Security

- Secure authentication with Clerk
- User profile management
- Role-based permissions

### 📱 Responsive Design

- Mobile-first responsive design
- Cross-platform compatibility
- Intuitive user interface

## Tech Stack 🛠️

### Frontend

- **Next.js 14** - React framework for production
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### Real-time Collaboration

- **Liveblocks** - Real-time collaboration infrastructure
- **Lexical** - Rich text editor framework

### Authentication & Database

- **Clerk** - Authentication and user management
- **Firebase** - Backend services and data storage

### AI & Communication

- **OpenAI** - AI-powered features
- **Stream** - Video calling and real-time communication

### State Management & UI

- **Recoil** - State management
- **Radix UI** - Accessible UI components
- **Lucide React** - Icon library

## Requirements 📦

The following are the requirements to run this project:

- **Bun** >= 1.1.0 (recommended) or **Node.js** >= 18.0.0
- **npm** or **yarn** package manager

## Installation 🚀

To install this project, follow these steps:

1. **Clone the repository:**

```bash
git clone https://github.com/p55d2k/project-taskcraft-frontend.git
cd project-taskcraft-frontend
```

2. **Install dependencies:**

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install

# Or using yarn
yarn install
```

3. **Environment Setup:**

Create a `.env.local` file in the root directory and add your environment variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id

# Liveblocks
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=your_liveblocks_public_key
LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Stream
NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
STREAM_SECRET_KEY=your_stream_secret_key
```

4. **Run the development server:**

```bash
# Using Bun
bun dev

# Or using npm
npm run dev

# Or using yarn
yarn dev
```

5. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Usage 📖

1. **Sign Up/Login:** Create an account or sign in using Clerk authentication
2. **Create a Project:** Start by creating your first project
3. **Invite Team Members:** Add collaborators to your project
4. **Create Tasks:** Use the task management system to organize work
5. **Collaborate:** Use the document editor for real-time collaboration
6. **Meet:** Schedule and join video meetings
7. **AI Assistance:** Leverage AI tools for content creation and task suggestions

## Contributing 🤝

Contributions, issues, and feature requests are welcome!

### How to Contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines:

- Follow the existing code style
- Write clear, concise commit messages
- Test your changes thoroughly
- Update documentation as needed

## License 📝

### Copyright

Copyright © 2024 by [p55d2k](https://github.com/p55d2k)

**TaskCraft** is available and distributed under the [MIT License](https://github.com/p55d2k/project-taskcraft-frontend/LICENSE).

### Code of Conduct

You are allowed to distribute, modify the codes, or use this project for personal or commercial use. However, please do credit the original author.

---

<p align="center">
  <a href="#top">Back to top</a>
</p>
