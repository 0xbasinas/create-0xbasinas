// Test the help banner and welcome banner functions
function showWelcomeBanner(projectName) {
  const banner = `
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ✨  Welcome to create-0xbasinas  ✨                       ║
║   ──────────────────────────────────────                     ║
║   🚀  Creating Next.js 16 project: ${projectName.padEnd(20)}║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `;
  console.log(banner);
}

function showStep(step, total, emoji, message) {
  const stepLabel = `[${String(step).padStart(2, '0')}/${total}]`;
  const border = '─'.repeat(60);
  console.log(`\n┌${border}┐`);
  console.log(`│ ${stepLabel}  ${emoji}  ${message.padEnd(54)} │`);
  console.log(`└${border}┘`);
}

function showSuccess(message) {
  console.log(`  ✔ ${message}`);
}

function showCompletionBanner(projectName) {
  const banner = `

🎉🎊✨  ════════════════════════════════════════════  ✨🎊🎉
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🏆  PROJECT CREATED SUCCESSFULLY!  🏆                      ║
║                                                              ║
║   📁  Project: ${projectName.padEnd(43)}║
║   ⚡  Stack:  Next.js 16 + shadcn/ui + TypeScript           ║
║   🎨  Theme:  Dark mode ready                                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `;
  console.log(banner);
}

showWelcomeBanner('my-awesome-app');
showStep(1, 18, '🚀', 'Setting up Next.js 16 project...');
showSuccess('Next.js 16 project scaffolded!');
showStep(2, 18, '🎨', 'Installing & configuring shadcn/ui...');
showSuccess('shadcn/ui initialized with CSS variables');
showStep(18, 18, '📁', 'Organizing route groups...');
showSuccess('Route groups organized');
showCompletionBanner('my-awesome-app');
console.log('  ➜ 📁  cd my-awesome-app');
console.log('  ➜ 🚀  npm run dev');
console.log('\n  ⭐  May the code be with you! Happy hacking!\n');
