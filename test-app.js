/**
 * Simple test script to verify the Next.js application structure
 * Run with: node test-app.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Next.js Application Structure...\n');

let passed = 0;
let failed = 0;

function test(description, condition) {
  if (condition) {
    console.log(`✅ ${description}`);
    passed++;
  } else {
    console.log(`❌ ${description}`);
    failed++;
  }
}

function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, filePath));
}

function dirExists(dirPath) {
  return fs.existsSync(path.join(__dirname, dirPath)) && 
         fs.statSync(path.join(__dirname, dirPath)).isDirectory();
}

// Configuration Files
console.log('📋 Configuration Files:');
test('package.json exists', fileExists('package.json'));
test('next.config.js exists', fileExists('next.config.js'));
test('tailwind.config.js exists', fileExists('tailwind.config.js'));
test('tsconfig.json exists', fileExists('tsconfig.json'));
test('.env.local exists', fileExists('.env.local'));
test('.gitignore exists', fileExists('.gitignore'));

// Source Structure
console.log('\n📁 Source Structure:');
test('src/ directory exists', dirExists('src'));
test('src/app/ directory exists', dirExists('src/app'));
test('src/components/ directory exists', dirExists('src/components'));
test('src/contexts/ directory exists', dirExists('src/contexts'));
test('src/lib/ directory exists', dirExists('src/lib'));
test('src/models/ directory exists', dirExists('src/models'));

// App Files
console.log('\n📄 App Files:');
test('src/app/layout.tsx exists', fileExists('src/app/layout.tsx'));
test('src/app/page.tsx exists', fileExists('src/app/page.tsx'));
test('src/app/globals.css exists', fileExists('src/app/globals.css'));

// Pages
console.log('\n📱 Pages:');
test('src/app/login/page.tsx exists', fileExists('src/app/login/page.tsx'));
test('src/app/signup/page.tsx exists', fileExists('src/app/signup/page.tsx'));
test('src/app/dashboard/page.tsx exists', fileExists('src/app/dashboard/page.tsx'));
test('src/app/projects/page.tsx exists', fileExists('src/app/projects/page.tsx'));
test('src/app/tasks/page.tsx exists', fileExists('src/app/tasks/page.tsx'));

// API Routes
console.log('\n🔌 API Routes:');
test('src/app/api/auth/login/route.ts exists', fileExists('src/app/api/auth/login/route.ts'));
test('src/app/api/auth/signup/route.ts exists', fileExists('src/app/api/auth/signup/route.ts'));
test('src/app/api/projects/route.ts exists', fileExists('src/app/api/projects/route.ts'));
test('src/app/api/projects/[id]/route.ts exists', fileExists('src/app/api/projects/[id]/route.ts'));
test('src/app/api/tasks/route.ts exists', fileExists('src/app/api/tasks/route.ts'));
test('src/app/api/tasks/[id]/route.ts exists', fileExists('src/app/api/tasks/[id]/route.ts'));
test('src/app/api/tasks/dashboard/route.ts exists', fileExists('src/app/api/tasks/dashboard/route.ts'));
test('src/app/api/users/route.ts exists', fileExists('src/app/api/users/route.ts'));

// Components
console.log('\n🧩 Components:');
test('src/components/DashboardLayout.tsx exists', fileExists('src/components/DashboardLayout.tsx'));
test('src/components/ProtectedRoute.tsx exists', fileExists('src/components/ProtectedRoute.tsx'));

// Contexts
console.log('\n🔄 Contexts:');
test('src/contexts/AuthContext.tsx exists', fileExists('src/contexts/AuthContext.tsx'));

// Library Files
console.log('\n📚 Library Files:');
test('src/lib/api.ts exists', fileExists('src/lib/api.ts'));
test('src/lib/auth.ts exists', fileExists('src/lib/auth.ts'));
test('src/lib/db.ts exists', fileExists('src/lib/db.ts'));
test('src/lib/utils.ts exists', fileExists('src/lib/utils.ts'));

// Models
console.log('\n🗄️  Database Models:');
test('src/models/User.ts exists', fileExists('src/models/User.ts'));
test('src/models/Project.ts exists', fileExists('src/models/Project.ts'));
test('src/models/Task.ts exists', fileExists('src/models/Task.ts'));

// Documentation
console.log('\n📖 Documentation:');
test('README.md exists', fileExists('README.md'));

// Check package.json content
console.log('\n📦 Package.json Validation:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  test('Has "dev" script', packageJson.scripts && packageJson.scripts.dev);
  test('Has "build" script', packageJson.scripts && packageJson.scripts.build);
  test('Has "start" script', packageJson.scripts && packageJson.scripts.start);
  test('Has Next.js dependency', packageJson.dependencies && packageJson.dependencies.next);
  test('Has React dependency', packageJson.dependencies && packageJson.dependencies.react);
  test('Has Mongoose dependency', packageJson.dependencies && packageJson.dependencies.mongoose);
} catch (e) {
  console.log('❌ Could not read package.json');
  failed++;
}

// Check .env.local content
console.log('\n🔐 Environment Variables:');
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  test('Has MONGODB_URI', envContent.includes('MONGODB_URI'));
  test('Has JWT_SECRET', envContent.includes('JWT_SECRET'));
  test('Has NEXTAUTH_SECRET', envContent.includes('NEXTAUTH_SECRET'));
  test('Has NEXTAUTH_URL', envContent.includes('NEXTAUTH_URL'));
} catch (e) {
  console.log('❌ Could not read .env.local');
  failed++;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\n📊 Test Results:`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! Your Next.js application is properly set up.');
  console.log('\n📝 Next steps:');
  console.log('   1. Ensure MongoDB is running');
  console.log('   2. Run: npm run dev');
  console.log('   3. Open: http://localhost:3000');
  console.log('   4. See CLEANUP_INSTRUCTIONS.md to remove old folders');
} else {
  console.log('\n⚠️  Some tests failed. Please check the missing files.');
}

console.log('\n' + '='.repeat(50) + '\n');
