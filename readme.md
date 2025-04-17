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
   npm run dev
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

## Git Workflow

This repo uses pre-commit hooks for code quality:

- Linting and type checking before commits
- Consistent formatting

## License

[MIT](LICENSE)