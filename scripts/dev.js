#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

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

// Helper function to create cross-platform compatible commands
function getCommand(cmd) {
  const isWindows = os.platform() === 'win32';
  return {
    command: isWindows ? 'cmd' : 'sh',
    args: isWindows ? ['/c', cmd] : ['-c', cmd]
  };
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

// Start a process with the given command in the specified directory
function startProcess(name, cmd, cwd) {
  const { command, args } = getCommand(cmd);
  const childProcess = spawn(command, args, { 
    cwd: path.resolve(process.cwd(), cwd),
    stdio: 'pipe', 
    shell: true 
  });
  
  // Add prefix to output for clarity
  const prefix = `${colors.blue}[${name}]${colors.reset}`.padEnd(20);
  
  childProcess.stdout.on('data', (data) => {
    data.toString().split('\n').forEach(line => {
      if (line.trim()) console.log(`${prefix} ${line}`);
    });
  });
  
  childProcess.stderr.on('data', (data) => {
    data.toString().split('\n').forEach(line => {
      if (line.trim()) console.error(`${prefix} ${colors.red}${line}${colors.reset}`);
    });
  });
  
  childProcess.on('close', (code) => {
    console.log(`${prefix} ${colors.yellow}Process exited with code ${code}${colors.reset}`);
  });
  
  return childProcess;
}

// Function to check if backend needs migrations
async function checkMigrations() {
  const pythonCmd = getPythonCommand('manage.py showmigrations --list');
  const { command, args } = getCommand(pythonCmd);
  
  return new Promise((resolve) => {
    const process = spawn(command, args, {
      cwd: path.resolve(process.cwd(), 'backend'),
      stdio: 'pipe',
      shell: true
    });
    
    let output = '';
    
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    process.on('close', () => {
      // Check if there are pending migrations (lines with [ ])
      const needsMigration = output.includes('[ ]');
      resolve(needsMigration);
    });
  });
}

// Main function to start all services
async function startDevelopment() {
  console.log(`${colors.green}🚀 Starting development servers...${colors.reset}`);
  
  // Check if backend needs migrations
  const needsMigrations = await checkMigrations();
  if (needsMigrations) {
    console.log(`${colors.yellow}⚠️  Backend needs migrations. Running them now...${colors.reset}`);
    const migrationCmd = getPythonCommand('manage.py migrate');
    const { command, args } = getCommand(migrationCmd);
    
    await new Promise((resolve) => {
      const process = spawn(command, args, {
        cwd: path.resolve(process.cwd(), 'backend'),
        stdio: 'inherit',
        shell: true
      });
      
      process.on('close', resolve);
    });
  }
  
  // Start Django backend
  const pythonRunserver = getPythonCommand('manage.py runserver');
  const backend = startProcess(
    'Backend',
    pythonRunserver,
    './backend'
  );
  
  // Start dashboard
  const dashboard = startProcess(
    'Dashboard',
    'npm run dev',
    './dashboard'
  );
  
  // Start landing page
  const landing = startProcess(
    'Landing',
    'npm run dev',
    './landing-page'
  );
  
  // Handle process termination
  const cleanup = () => {
    console.log(`\n${colors.yellow}🛑 Shutting down all services...${colors.reset}`);
    backend.kill();
    dashboard.kill();
    landing.kill();
    process.exit(0);
  };
  
  // Listen for termination signals
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  
  console.log('\n✅ All services are running:');
  console.log('  - Backend:     http://localhost:8000');
  console.log('  - Dashboard:   http://localhost:8080');
  console.log('  - Landing:     http://localhost:3000');
  console.log('\nPress Ctrl+C to stop all services.');
}

// Start the development environment
startDevelopment();