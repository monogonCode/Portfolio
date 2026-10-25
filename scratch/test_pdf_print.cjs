const { spawn } = require('child_process');

async function test() {
  const browser = spawn('chromium', [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=9225',
    'http://localhost:4321'
  ]);

  await new Promise(r => setTimeout(r, 5500));
  try {
    const jsonRes = await fetch('http://127.0.0.1:9225/json');
    const targets = await jsonRes.json();
    console.log('All targets:', targets.map(t => ({ type: t.type, url: t.url })));

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

    // Check targets again to see if PDF target exists
    const jsonRes2 = await fetch('http://127.0.0.1:9225/json');
    const targets2 = await jsonRes2.json();
    console.log('Targets after opening CV:', targets2.map(t => ({ type: t.type, url: t.url })));

    // Let's test calling print on iframe
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const iframe = document.querySelector('iframe');
          if (!iframe) return 'no iframe found';
          try {
            console.log('iframe src:', iframe.src);
            const win = iframe.contentWindow;
            return {
              hasWin: !!win,
              locationHref: win ? (function() { try { return win.location.href; } catch(e) { return e.message; } })() : null,
              printType: typeof win.print
            };
          } catch(e) {
            return { error: e.message };
          }
        })()
      `,
      returnByValue: true
    });
    console.log('Eval result:', evalRes);

    ws.close();
  } finally {
    browser.kill();
  }
}

test().catch(console.error);
