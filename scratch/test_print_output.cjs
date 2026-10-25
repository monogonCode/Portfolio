const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
  const browser = spawn('chromium', [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=9226',
    'http://localhost:4321'
  ]);

  await new Promise(r => setTimeout(r, 5500));
  try {
    const jsonRes = await fetch('http://127.0.0.1:9226/json');
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

    // Get list of targets now
    const jsonRes2 = await fetch('http://127.0.0.1:9226/json');
    const targets2 = await jsonRes2.json();
    console.log('Targets:', targets2);

    // If there's an iframe target for the PDF, can we connect to it and printToPDF?
    const pdfTarget = targets2.find(t => t.url.includes('CV_Martin_26.pdf'));
    if (pdfTarget) {
      console.log('Found PDF target:', pdfTarget.url);
      const wsPdf = new WebSocket(pdfTarget.webSocketDebuggerUrl);
      await new Promise(r => wsPdf.onopen = r);
      let pdfId = 1;
      function sendPdf(method, params = {}) {
        return new Promise((resolve, reject) => {
          const curId = pdfId++;
          const handler = (evt) => {
            const msg = JSON.parse(evt.data);
            if (msg.id === curId) {
              wsPdf.removeEventListener('message', handler);
              if (msg.error) reject(msg.error);
              else resolve(msg.result);
            }
          };
          wsPdf.addEventListener('message', handler);
          wsPdf.send(JSON.stringify({ id: curId, method, params }));
        });
      }
      const pdfData = await sendPdf('Page.printToPDF', {});
      fs.writeFileSync('/home/martin/Proyectos/Desarrollo/Personal/Portfolio/scratch/output_print.pdf', Buffer.from(pdfData.data, 'base64'));
      console.log('Saved output_print.pdf, size:', fs.statSync('/home/martin/Proyectos/Desarrollo/Personal/Portfolio/scratch/output_print.pdf').size);
      wsPdf.close();
    } else {
      console.log('No direct PDF target found');
    }

    ws.close();
  } finally {
    browser.kill();
  }
}

test().catch(console.error);
