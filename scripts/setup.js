#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Helper function to execute shell commands
function runCommand(command, cwd, ignoreError = false) {
  try {
    console.log(`${colors.blue}Running: ${command}${colors.reset}`);
    execSync(command, { 
      cwd: cwd || process.cwd(), 
      stdio: 'inherit' 
    });
    return true;
  } catch (error) {
    if (!ignoreError) {
      console.error(`${colors.red}Failed to execute ${command}${colors.reset}`, error);
    }
    return false;
  }
}

// Create .env files if they don't exist
function createEnvFiles() {
  const envFiles = {
    './backend/.env': `
DEBUG=True
SECRET_KEY=your_django_secret_key
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
`,
    './dashboard/.env': `
VITE_API_BASE_URL=http://localhost:8000/api/
`,
    './landing-page/.env': `
API_URL=http://localhost:8000/api
`
  };

  Object.entries(envFiles).forEach(([file, content]) => {
    const filePath = path.resolve(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
      console.log(`${colors.cyan}Creating ${file}...${colors.reset}`);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, content.trim());
    }
  });
}

// Check for prerequisites
function checkPrerequisites() {
  console.log(`${colors.blue}Checking prerequisites...${colors.reset}`);
  
  let allGood = true;
  
  // Check Node.js version
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    console.log(`${colors.green}✓ Node.js ${nodeVersion}${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}✗ Node.js not found. Please install Node.js 16 or higher.${colors.reset}`);
    allGood = false;
  }
  
  // Check Python version
  try {
    const pythonCommand = os.platform() === 'win32' ? 'python --version' : 'python3 --version';
    const pythonVersion = execSync(pythonCommand, { encoding: 'utf8' }).trim();
    console.log(`${colors.green}✓ ${pythonVersion}${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}✗ Python not found. Please install Python 3.8 or higher.${colors.reset}`);
    allGood = false;
  }
  
  // Check Git
  try {
    const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
    console.log(`${colors.green}✓ ${gitVersion}${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}✗ Git not found. Please install Git.${colors.reset}`);
    allGood = false;
  }
  
  return allGood;
}

// Setup backend environment
async function setupBackend() {
  console.log(`\n${colors.magenta}🐍 Setting up Django backend...${colors.reset}`);
  
  const backendDir = path.resolve(process.cwd(), 'backend');
  if (!fs.existsSync(backendDir)) {
    fs.mkdirSync(backendDir, { recursive: true });
  }
  
  // Create virtual environment
  const venvPath = path.join(backendDir, '.venv');
  if (!fs.existsSync(venvPath)) {
    console.log(`${colors.cyan}Creating virtual environment...${colors.reset}`);
    const createVenvCmd = 'python3.12 -m venv .venv';
    runCommand(createVenvCmd, backendDir);
  }
  
  // Install Python dependencies
  console.log(`${colors.cyan}Installing backend dependencies...${colors.reset}`);
  const pipCmd = os.platform() === 'win32' 
    ? '.venv\\Scripts\\pip install -r requirements.txt' 
    : '.venv/bin/pip install -r requirements.txt';
  runCommand(pipCmd, backendDir, true);  // Ignore error if requirements.txt doesn't exist yet

  // collect static
  console.log(`${colors.cyan}Collecting static files...${colors.reset}`);
  const collectStaticCmd = os.platform() === 'win32' 
    ? '.venv\\Scripts\\python manage.py collectstatic --noinput' 
    : '.venv/bin/python manage.py collectstatic --noinput';
  runCommand(collectStaticCmd, backendDir, true);  // Ignore error if manage.py doesn't exist yet
  // Run migrations
  console.log(`${colors.cyan}Running database migrations...${colors.reset}`);
  const migrateCmd = os.platform() === 'win32' 
    ? '.venv\\Scripts\\python manage.py migrate' 
    : '.venv/bin/python manage.py migrate';
  
  runCommand(migrateCmd, backendDir, true);  // Ignore error if manage.py doesn't exist yet

}

// Setup Vue.js dashboard
async function setupDashboard() {
  console.log(`\n${colors.magenta}📊 Setting up Vue.js dashboard...${colors.reset}`);
  
  const dashboardDir = path.resolve(process.cwd(), 'dashboard');
  if (!fs.existsSync(path.join(dashboardDir, 'package.json'))) {
    fs.mkdirSync(dashboardDir, { recursive: true });
    console.log(`${colors.yellow}Vue project not found, creating a new one...${colors.reset}`);
    runCommand(`npm create vue@latest . -- --typescript --router --pinia --eslint-with-prettier`, dashboardDir);
  }
  
  runCommand('npm install', dashboardDir);
}

// Setup Nuxt.js landing page
async function setupLanding() {
  console.log(`\n${colors.magenta}🌐 Setting up Nuxt.js landing page...${colors.reset}`);
  
  const landingDir = path.resolve(process.cwd(), 'landing-page');
  if (!fs.existsSync(path.join(landingDir, 'package.json'))) {
    fs.mkdirSync(landingDir, { recursive: true });
    console.log(`${colors.yellow}Nuxt project not found, creating a new one...${colors.reset}`);
    runCommand(`npx nuxi init .`, landingDir);
  }
  
  runCommand('npm install', landingDir);
}

// Setup Git hooks
function setupGitHooks() {
  console.log(`\n${colors.magenta}🔄 Setting up Git hooks...${colors.reset}`);
  
  // Create .husky directory
  const huskyDir = path.resolve(process.cwd(), '.husky');
  fs.mkdirSync(huskyDir, { recursive: true });
  
  // Create pre-commit hook
  const preCommitPath = path.join(huskyDir, 'pre-commit');
  if (!fs.existsSync(preCommitPath)) {
    console.log(`${colors.cyan}Creating pre-commit hook...${colors.reset}`);
    fs.writeFileSync(preCommitPath, `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged to format and lint changed files
npx lint-staged
`);
    fs.chmodSync(preCommitPath, 0o755);  // Make executable
  }
  
  // Initialize husky
  console.log(`${colors.cyan}Initializing husky...${colors.reset}`);
  runCommand('npx husky install', process.cwd());
}

// Main setup function
async function setup() {
  console.log(`${colors.green}🚀 Setting up your monorepo...${colors.reset}`);
  
  // Check prerequisites
  if (!checkPrerequisites()) {
    console.error(`${colors.red}Please install the missing prerequisites and try again.${colors.reset}`);
    process.exit(1);
  }
  
  // Create necessary files
  console.log(`\n${colors.blue}📁 Creating environment files...${colors.reset}`);
  createEnvFiles();
  
  // Setup backend
  await setupBackend();
  
  // Setup dashboard
  await setupDashboard();
  
  // Setup landing page
  await setupLanding();
  
  // Setup Git hooks
  setupGitHooks();
  
  // Setup root dependencies
  console.log(`\n${colors.magenta}📦 Installing root dependencies...${colors.reset}`);
  runCommand('npm install', process.cwd());
  
  console.log(`\n${colors.green}🎉 Setup complete! You can now run the following commands:${colors.reset}`);
  console.log(`  - ${colors.cyan}npm run dev:all${colors.reset}: Start all services`);
  console.log(`  - ${colors.cyan}npm run backend:dev${colors.reset}: Start only the backend`);
  console.log(`  - ${colors.cyan}npm run dashboard:dev${colors.reset}: Start only the dashboard`);
  console.log(`  - ${colors.cyan}npm run landing:dev${colors.reset}: Start only the landing page`);
  console.log(`\n${colors.yellow}Tip:${colors.reset} Open this project in VSCode with the workspace file:`);
  console.log(`  ${colors.cyan}code my-app.code-workspace${colors.reset}`);
}

// Run setup
setup().catch(error => {
  console.error(`${colors.red}Setup failed:${colors.reset}`, error);
});