const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const startupFolder = path.join(
  process.env.APPDATA || '',
  'Microsoft',
  'Windows',
  'Start Menu',
  'Programs',
  'Startup'
);

const vbsFile = path.join(startupFolder, 'SayandeepPortfolioSync.vbs');
const syncScript = path.resolve(__dirname, 'laptop-sync.js');
const nodeExe = process.execPath; // Exact path to node.exe (e.g. C:\Program Files\nodejs\node.exe)

const action = process.argv[2];

if (action === '--uninstall' || action === 'remove') {
  if (fs.existsSync(vbsFile)) {
    fs.unlinkSync(vbsFile);
    console.log('✅ Removed silent background sync from Windows Startup.');
  } else {
    console.log('ℹ️ Startup file was not found.');
  }
} else {
  // Use Chr(34) in VBScript for 100% reliable quote escaping without syntax errors
  const vbsContent = [
    'Set WshShell = CreateObject("WScript.Shell")',
    `WshShell.CurrentDirectory = "${projectRoot}"`,
    `WshShell.Run Chr(34) & "${nodeExe}" & Chr(34) & " " & Chr(34) & "${syncScript}" & Chr(34), 0, False`,
    '',
  ].join('\r\n');

  fs.writeFileSync(vbsFile, vbsContent, 'utf8');
  console.log('✅ Background Laptop Sync registered successfully in Windows Startup!');
  console.log(`📁 File created: ${vbsFile}`);
  console.log('Whenever your laptop turns on, it will automatically report Online in the background.');
  console.log('When your laptop turns off, your portfolio will automatically switch to Offline and show your last seen time.');

  // Launch right now silently via WScript
  try {
    exec(`wscript.exe "${vbsFile}"`);
    console.log('🚀 Device sync service launched in the background!');
  } catch {}
}
