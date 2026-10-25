const { spawn } = require('child_process');
const fs = require('fs');

async function run() {
  const browser = spawn('chromium', [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=9222',
    '--window-size=1280,850',
    'http://localhost:4321'
  ]);

  await new Promise(r => setTimeout(r, 4500));

  const jsonRes = await fetch('http://127.0.0.1:9222/json');
  const targets = await jsonRes.json();
  const page = targets.find(t => t.type === 'page');
  if (!page) throw new Error('No page found');

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1;

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = id++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  await new Promise(resolve => ws.onopen = resolve);

  async function evaluate(expression) {
    return await send('Runtime.evaluate', { expression, returnByValue: true });
  }

  async function capture(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filename, Buffer.from(res.data, 'base64'));
    console.log('Saved screenshot:', filename);
  }

  // 1. Open Terminal MS-DOS
  console.log('Opening Terminal...');
  await evaluate(`
    const cards = Array.from(document.querySelectorAll('.desktop-icon-card'));
    const termCard = cards.find(c => c.textContent.includes('Terminal') || c.textContent.includes('MS-DOS'));
    if (termCard) {
      const evt = new MouseEvent('dblclick', { bubbles: true });
      termCard.dispatchEvent(evt);
    }
  `);
  await new Promise(r => setTimeout(r, 1200));

  // Helper to type command in terminal
  async function typeCommand(text) {
    await evaluate(`
      (() => {
        const input = document.querySelector('.terminal-input');
        if (input) {
          // Set value
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
          nativeInputValueSetter.call(input, ${JSON.stringify(text)});
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        }
      })()
    `);
    await new Promise(r => setTimeout(r, 800));
  }

  // 2. Run 'matrix' command
  console.log('Executing matrix command...');
  await typeCommand('matrix');
  await new Promise(r => setTimeout(r, 1000));
  await capture('/home/martin/.gemini/antigravity/brain/ab01f69a-d3bc-481c-a06d-7e828773d79a/scratch/terminal_matrix.png');

  // 3. Run 'glados' command
  console.log('Executing glados command...');
  await typeCommand('glados');
  await new Promise(r => setTimeout(r, 1000));

  // 4. Run 'glados-say' command
  console.log('Executing glados-say command...');
  await typeCommand('glados-say "Saludos a todos, soy GLaDOS y este es el portfolio de Martin."');
  await new Promise(r => setTimeout(r, 1200));
  await capture('/home/martin/.gemini/antigravity/brain/ab01f69a-d3bc-481c-a06d-7e828773d79a/scratch/terminal_glados.png');

  // 5. Run 'neofetch' command
  console.log('Executing neofetch command...');
  await typeCommand('neofetch');
  await new Promise(r => setTimeout(r, 1500));
  await capture('/home/martin/.gemini/antigravity/brain/ab01f69a-d3bc-481c-a06d-7e828773d79a/scratch/terminal_neofetch.png');

  ws.close();
  browser.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
