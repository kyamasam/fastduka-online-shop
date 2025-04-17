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
};

// Helper function to execute shell commands
function runCommand(command, cwd) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { 
      cwd: cwd || process.cwd(), 
      stdio: 'inherit' 
    });
    return true;
  } catch (error) {
    console.error(`${colors.red}Failed to execute ${command}${colors.reset}`, error);
    return false;
  }
}

// Get python command based on platform and virtual environment
function getPythonCommand(subcommand) {
  const isWindows = os.platform() === 'win32';
  const backendDir = path.resolve(process.cwd(), 'backend');
  const venvPath = path.join(backendDir, '.venv');
  
  if (fs.existsSync(venvPath)) {
    return isWindows 
      ? `.venv\\Scripts\\python ${subcommand}`
      : `.venv/bin/python ${subcommand}`;
  }
  
  return isWindows ? `python ${subcommand}` : `python3 ${subcommand}`;
}

// Main build function
async function build() {
  console.log(`${colors.blue}🔨 Building all applications...${colors.reset}`);
  
  // Create dist directory if it doesn't exist
  const distDir = path.resolve(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    fs.mkdirSync(path.join(distDir, 'dashboard'), { recursive: true });
    fs.mkdirSync(path.join(distDir, 'landing'), { recursive: true });
  }
  
  // Build backend (collect static files)
  console.log(`${colors.blue}🐍 Building Django backend...${colors.reset}`);
  const collectStaticCmd = getPythonCommand('manage.py collectstatic --noinput');
  runCommand(collectStaticCmd, './backend');
  
  // Build dashboard (Vue.js)
  console.log(`${colors.blue}📊 Building Vue.js dashboard...${colors.reset}`);
  runCommand('npm run build', './dashboard');
  
  // Copy dashboard build to dist
  const dashboardBuildDir = path.join(process.cwd(), 'dashboard', 'dist');
  if (fs.existsSync(dashboardBuildDir)) {
    fs.cpSync(dashboardBuildDir, path.join(distDir, 'dashboard'), { recursive: true });
  }
  
  // Build landing page (Nuxt.js)
  console.log(`${colors.blue}🌐 Building Nuxt.js landing page...${colors.reset}`);
  runCommand('npm run build', './landing-page');
  
  // Copy landing page build to dist
  const landingBuildDir = path.join(process.cwd(), 'landing-page', '.output', 'public');
  if (fs.existsSync(landingBuildDir)) {
    fs.cpSync(landingBuildDir, path.join(distDir, 'landing'), { recursive: true });
  }
  
  console.log(`${colors.green}🎉 Build complete! All applications have been built to ./dist directory.${colors.reset}`);
}

// Run build
build().catch(error => {
  console.error(`${colors.red}Build failed:${colors.reset}`, error);
});