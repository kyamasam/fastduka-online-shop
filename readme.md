# My App Monorepo

A monorepo containing Django Backend, Vue.js Dashboard, and Nuxt.js Landing Page.

## Prerequisites

- Node.js 16+
- Python 3.8+
- Git

## Quick Start

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/my-app-monorepo.git
   cd my-app-monorepo
   ```

2. Run the setup script:

   ```bash
   node scripts/setup.js
   ```

3. Start all services:

   ```bash
   npm run dev:all
   ```

4. Access your applications:
   - Backend API: http://localhost:8000
   - Admin Dashboard: http://localhost:8080
   - Landing Page: http://localhost:3000

## Project Structure

```
my-app-monorepo/
├── backend/           # Django backend
├── dashboard/         # Vue.js dashboard
├── landing-page/      # Nuxt landing page
├── scripts/           # Development scripts
└── dist/              # Production builds
```

## Development

### VSCode Setup

For the best development experience, open the project using the workspace file:

```bash
code fastduka.code-workspace
```

### Running Individual Services

```bash
# Backend only
npm run backend:dev

# Dashboard only
npm run dashboard:dev

# Landing page only
npm run landing:dev
```

### Building for Production

```bash
npm run build
```

### Run all

```bash
npm run dev:all
```

## Git Workflow

This repo uses pre-commit hooks for code quality:

- Linting and type checking before commits
- Consistent formatting

## License

[MIT](LICENSE)

# github deploy secrets

# GitHub Secrets Required:\*\*

Add these in your repository settings (Settings → Secrets and variables → Actions → New repository secret):

DEPLOY_HOST # Your server IP or domain (e.g., 192.168.1.100 or myserver.com)
DEPLOY_USER # SSH username (e.g., ubuntu, root, admin)
DEPLOY_SSH_KEY # Your private SSH key (entire content)
DEPLOY_PORT # SSH port (optional, defaults to 22)
DEPLOY_PATH # Path to your app (optional, defaults to /opt/fastduka-online-shop)

vars
PRODUCTION_APP_ENV # the full .env file
