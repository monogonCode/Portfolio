const { spawn } = require('child_process');
const fs = require('fs');

async function capture() {
  const browser = spawn('chromium', [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=9227',
    '--window-size=1280,850',
    'http://localhost:4321'
  ]);

  await new Promise(r => setTimeout(r, 5500));
  try {
    const jsonRes = await fetch('http://127.0.0.1:9227/json');
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

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const outPath = '/home/martin/.gemini/antigravity/brain/ab01f69a-d3bc-481c-a06d-7e828773d79a/cv_viewer_verified.png';
    fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
    console.log('Saved:', outPath);

    ws.close();
  } finally {
    browser.kill();
  }
}

capture().catch(console.error);
