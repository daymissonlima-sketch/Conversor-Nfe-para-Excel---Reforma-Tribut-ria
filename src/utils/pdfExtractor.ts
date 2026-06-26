let pdfjsLoadingPromise: Promise<any> | null = null;

export function loadPdfJS(): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window is not defined.'));
  }

  if ((window as any).pdfjsLib) {
    return Promise.resolve((window as any).pdfjsLib);
  }
  if (pdfjsLoadingPromise) {
    return pdfjsLoadingPromise;
  }

  pdfjsLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      resolve(pdfjsLib);
    };
    script.onerror = (err) => {
      pdfjsLoadingPromise = null;
      reject(new Error('Falha ao carregar a biblioteca de leitura de PDF.'));
    };
    document.head.appendChild(script);
  });

  return pdfjsLoadingPromise;
}

export async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdfjsLib = await loadPdfJS();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  
  let fullText = '';
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items as any[];
    
    // Group text items by their vertical coordinate (translateY = transform[5])
    const linesMap: { [key: number]: any[] } = {};
    
    for (const item of items) {
      if (!item.str || item.str.trim() === '') continue;
      
      const y = item.transform[5];
      // Find an existing line within a small threshold (e.g., 4 units)
      let foundYKey = Object.keys(linesMap).find(k => Math.abs(parseFloat(k) - y) < 4);
      
      if (foundYKey) {
        linesMap[parseFloat(foundYKey)].push(item);
      } else {
        linesMap[y] = [item];
      }
    }
    
    // Sort lines top-to-bottom (Y descending)
    const sortedYKeys = Object.keys(linesMap)
      .map(Number)
      .sort((a, b) => b - a);
      
    let pageText = '';
    for (const y of sortedYKeys) {
      const lineItems = linesMap[y];
      // Sort items left-to-right (X ascending, transform[4])
      lineItems.sort((a, b) => a.transform[4] - b.transform[4]);
      
      const lineStr = lineItems.map(item => item.str).join(' ');
      pageText += lineStr + '\n';
    }
    
    fullText += pageText + '\n';
  }
  
  return fullText;
}
