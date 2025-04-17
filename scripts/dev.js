#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");
const os = require("os");
const fs = require("fs");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// Helper function to verify required directories exist
function verifyDirectories(dirs) {
  const missingDirs = [];

  for (const dir of dirs) {
    const dirPath = path.resolve(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      missingDirs.push({ name: dir, path: dirPath });
    }
  }

  if (missingDirs.length > 0) {
    console.error(
      `${colors.red}Error: Required directories not found:${colors.reset}`
    );
    missingDirs.forEach((dir) => {
      console.error(`${colors.red}- ${dir.name}: ${dir.path}${colors.reset}`);
    });
    console.error(
      `${colors.yellow}Make sure you're running this script from the project root directory${colors.reset}`
    );
    return false;
  }

  return true;
}

// Helper function to create cross-platform compatible commands
function getCommand(cmd) {
  const isWindows = os.platform() === "win32";
  return {
    command: isWindows ? "cmd" : "sh",
    args: isWindows ? ["/c", cmd] : ["-c", cmd],
  };
}

// Get python command based on platform and virtual environment
function getPythonCommand(subcommand) {
  const isWindows = os.platform() === "win32";
  const backendDir = path.resolve(process.cwd(), "backend");
  const venvPath = path.join(backendDir, ".venv");

  if (fs.existsSync(venvPath)) {
    return isWindows
      ? `.venv\\Scripts\\python ${subcommand}`
      : `.venv/bin/python ${subcommand}`;
  }

  return isWindows ? `python ${subcommand}` : `python3 ${subcommand}`;
}

// Start a process with the given command in the specified directory
function startProcess(name, cmd, cwd) {
  // Verify the directory exists
  const dirPath = path.resolve(process.cwd(), cwd);
  if (!fs.existsSync(dirPath)) {
    console.error(
      `${colors.red}Error: Directory '${cwd}' not found at ${dirPath}${colors.reset}`
    );
    console.error(
      `${colors.yellow}Cannot start ${name} process${colors.reset}`
    );
    return null;
  }

  const { command, args } = getCommand(cmd);

  try {
    const childProcess = spawn(command, args, {
      cwd: dirPath,
      stdio: "pipe",
      shell: true,
    });

    // Add prefix to output for clarity
    const prefix = `${colors.blue}[${name}]${colors.reset}`.padEnd(20);

    childProcess.stdout.on("data", (data) => {
      data
        .toString()
        .split("\n")
        .forEach((line) => {
          if (line.trim()) console.log(`${prefix} ${line}`);
        });
    });

    childProcess.stderr.on("data", (data) => {
      data
        .toString()
        .split("\n")
        .forEach((line) => {
          if (line.trim())
            console.error(`${prefix} ${colors.red}${line}${colors.reset}`);
        });
    });

    childProcess.on("close", (code) => {
      console.log(
        `${prefix} ${colors.yellow}Process exited with code ${code}${colors.reset}`
      );
    });

    childProcess.on("error", (err) => {
      console.error(
        `${prefix} ${colors.red}Failed to start process: ${err.message}${colors.reset}`
      );
    });

    return childProcess;
  } catch (error) {
    console.error(
      `${colors.red}Error starting ${name} process: ${error.message}${colors.reset}`
    );
    return null;
  }
}

// Function to check if backend needs migrations
async function checkMigrations() {
  const backendDir = path.resolve(process.cwd(), "backend");

  if (!fs.existsSync(backendDir)) {
    console.error(
      `${colors.red}Error: Backend directory not found at ${backendDir}${colors.reset}`
    );
    console.error(`${colors.yellow}Cannot check migrations${colors.reset}`);
    return false;
  }

  const pythonCmd = getPythonCommand("manage.py showmigrations --list");
  const { command, args } = getCommand(pythonCmd);

  return new Promise((resolve) => {
    try {
      const process = spawn(command, args, {
        cwd: backendDir,
        stdio: "pipe",
        shell: true,
      });

      let output = "";

      process.stdout.on("data", (data) => {
        output += data.toString();
      });

      process.stderr.on("data", (data) => {
        console.error(
          `${colors.red}Migration check error: ${data.toString()}${colors.reset}`
        );
      });

      process.on("error", (err) => {
        console.error(
          `${colors.red}Failed to check migrations: ${err.message}${colors.reset}`
        );
        resolve(false);
      });

      process.on("close", (code) => {
        if (code !== 0) {
          console.error(
            `${colors.red}Migration check exited with code ${code}${colors.reset}`
          );
          resolve(false);
          return;
        }

        // Check if there are pending migrations (lines with [ ])
        const needsMigration = output.includes("[ ]");
        resolve(needsMigration);
      });
    } catch (error) {
      console.error(
        `${colors.red}Error checking migrations: ${error.message}${colors.reset}`
      );
      resolve(false);
    }
  });
}

// Main function to start all services
async function startDevelopment() {
  console.log(
    `${colors.green}🚀 Starting development servers...${colors.reset}`
  );

  // Verify directory structure
  const requiredDirs = ["backend", "dashboard", "landing-page"];
  if (!verifyDirectories(requiredDirs)) {
    process.exit(1);
  }

  // Check if backend needs migrations
  const needsMigrations = await checkMigrations();
  if (needsMigrations === false) {
    console.log(
      `${colors.yellow}⚠️ Could not check migrations, continuing...${colors.reset}`
    );
  } else if (needsMigrations === true) {
    console.log(
      `${colors.yellow}⚠️ Backend needs migrations. Running them now...${colors.reset}`
    );
    const migrationCmd = getPythonCommand("manage.py migrate");
    const { command, args } = getCommand(migrationCmd);

    await new Promise((resolve) => {
      const process = spawn(command, args, {
        cwd: path.resolve(process.cwd(), "backend"),
        stdio: "inherit",
        shell: true,
      });

      process.on("close", (code) => {
        if (code !== 0) {
          console.error(
            `${colors.red}Migration failed with code ${code}${colors.reset}`
          );
        }
        resolve();
      });

      process.on("error", (err) => {
        console.error(
          `${colors.red}Failed to run migrations: ${err.message}${colors.reset}`
        );
        resolve();
      });
    });
  }

  // Start Django backend
  const pythonRunserver = getPythonCommand("manage.py runserver");
  const backend = startProcess("Backend", pythonRunserver, "./backend");

  // Start dashboard
  const dashboard = startProcess("Dashboard", "npm run dev", "./dashboard");

  // Start landing page
  const landing = startProcess("Landing", "npm run dev", "./landing-page");

  // Check if any process failed to start
  if (!backend || !dashboard || !landing) {
    console.error(
      `${colors.red}Not all services could be started. Exiting...${colors.reset}`
    );
    cleanup();
    return;
  }

  // Handle process termination
  const cleanup = () => {
    console.log(
      `\n${colors.yellow}🛑 Shutting down all services...${colors.reset}`
    );
    if (backend) backend.kill();
    if (dashboard) dashboard.kill();
    if (landing) landing.kill();
    process.exit(0);
  };

  // Listen for termination signals
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  console.log("\n✅ All services are running:");
  console.log("  - Backend:     http://localhost:8000");
  console.log("  - Dashboard:   http://localhost:8080");
  console.log("  - Landing:     http://localhost:3000");
  console.log("\nPress Ctrl+C to stop all services.");
}

// Start the development environment
startDevelopment();
