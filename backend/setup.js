const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Print styled message
const printMessage = (message, color = colors.white, style = '') => {
  console.log(`${style}${color}${message}${colors.reset}`);
};

// Check if .env file exists
const checkEnvFile = () => {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    printMessage('❌ .env file not found!', colors.red, colors.bright);
    printMessage('Creating .env file with default values...', colors.yellow);
    
    // Create .env file with default values
    const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/PathXPert

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key-here
FIREBASE_CLIENT_EMAIL=your-client-email-here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Optional: Google Maps API Key (if needed)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
`;
    
    fs.writeFileSync(envPath, envContent);
    printMessage('✅ .env file created successfully!', colors.green);
  } else {
    printMessage('✅ .env file found!', colors.green);
  }
};

// Install dependencies
const installDependencies = () => {
  printMessage('Installing dependencies...', colors.cyan);
  try {
    execSync('npm install', { stdio: 'inherit' });
    printMessage('✅ Dependencies installed successfully!', colors.green);
  } catch (error) {
    printMessage('❌ Error installing dependencies!', colors.red);
    printMessage(error.message, colors.red);
    process.exit(1);
  }
};

// Check Node.js version
const checkNodeVersion = () => {
  const requiredVersion = '18.0.0';
  const currentVersion = process.version;
  
  printMessage(`Checking Node.js version...`, colors.cyan);
  printMessage(`Current version: ${currentVersion}`, colors.white);
  printMessage(`Required version: >= ${requiredVersion}`, colors.white);
  
  const current = currentVersion.split('.').map(Number);
  const required = requiredVersion.split('.').map(Number);
  
  if (current[0] < required[0] || (current[0] === required[0] && current[1] < required[1])) {
    printMessage('❌ Node.js version is too old!', colors.red);
    printMessage(`Please upgrade to Node.js ${requiredVersion} or higher.`, colors.yellow);
    process.exit(1);
  }
  
  printMessage('✅ Node.js version check passed!', colors.green);
};

// Main setup function
const setup = () => {
  printMessage('🚀 Starting PathXpert Backend Setup...', colors.magenta, colors.bright);
  printMessage('=====================================', colors.magenta);
  
  checkNodeVersion();
  checkEnvFile();
  installDependencies();
  
  printMessage('=====================================', colors.magenta);
  printMessage('✅ Setup completed successfully!', colors.green, colors.bright);
  printMessage('To start the server:', colors.cyan);
  printMessage('  Development: npm run dev', colors.white);
  printMessage('  Production:  npm start', colors.white);
};

// Run setup
setup(); 