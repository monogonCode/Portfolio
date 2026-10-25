const { spawn } = require('child_process');

async function test() {
  const browser = spawn('chromium', [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=9224',
    'http://localhost:4321'
  ]);

  await new Promise(r => setTimeout(r, 5500));
  try {
    const jsonRes = await fetch('http://127.0.0.1:9224/json');
    const targets = await jsonRes.json();
    const page = targets.find(t => t.type === 'page');
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

    await new Promise(r => ws.onopen = r);

    // Listen to console
    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        console.log('Browser console:', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
      }
    });
    await send('Runtime.enable');

    // Open CV
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const icon = document.querySelector('[title*="CV_Martin"]');
          if (icon) icon.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
        })()
      `
    });

    await new Promise(r => setTimeout(r, 2000));

    // Click "Imprimir" button
    const clickResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const printBtn = buttons.find(b => b.textContent.includes('Imprimir'));
          if (!printBtn) return { error: 'Print button not found' };
          try {
            printBtn.click();
            return { clicked: true, text: printBtn.textContent };
          } catch(e) {
            return { error: e.message };
          }
        })()
      `,
      returnByValue: true
    });
    console.log('Click print result:', clickResult);

    await new Promise(r => setTimeout(r, 1000));

    ws.close();
  } finally {
    browser.kill();
  }
}

test().catch(console.error);
