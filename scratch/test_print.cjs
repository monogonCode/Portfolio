const { spawn } = require('child_process');

async function test() {
  const browser = spawn('chromium', [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=9223',
    'http://localhost:4321'
  ]);

  await new Promise(r => setTimeout(r, 5500));
  try {
    const jsonRes = await fetch('http://127.0.0.1:9223/json');
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

    // Open CV viewer window
    const openCV = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const icon = document.querySelector('[title*="CV_Martin"]');
          if (icon) {
            icon.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
            return 'opened by title';
          }
          const allCards = Array.from(document.querySelectorAll('.desktop-icon-card'));
          const found = allCards.find(c => c.innerText.includes('CV'));
          if (found) {
            found.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
            return 'opened by text';
          }
          return 'all icons: ' + allCards.map(c => c.innerText.trim()).join(' | ');
        })()
      `,
      returnByValue: true
    });
    console.log('Open CV result:', openCV);

    await new Promise(r => setTimeout(r, 2000));

    // Test iframe print
    const testPrint = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const iframe = document.querySelector('iframe');
          if (!iframe) return 'no iframe';
          try {
            console.log('iframe.contentWindow:', iframe.contentWindow);
            return {
              hasContentWindow: !!iframe.contentWindow,
              src: iframe.src
            };
          } catch(e) {
            return { error: e.message };
          }
        })()
      `,
      returnByValue: true
    });
    console.log('Test print result:', testPrint);

    // Test calling print on the iframe
    const callPrint = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const iframe = document.querySelector('iframe');
          try {
            iframe.contentWindow.focus();
            // We won't actually trigger print dialog if it blocks, but let's check if iframe.contentWindow.print exists
            return typeof iframe.contentWindow.print;
          } catch(e) {
            return { error: e.message };
          }
        })()
      `,
      returnByValue: true
    });
    console.log('Call print result:', callPrint);

    ws.close();
  } finally {
    browser.kill();
  }
}

test().catch(console.error);
