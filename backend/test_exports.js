const endpoints = [
  "/reports/expense/export?format=pdf",
  "/reports/expense/export?format=excel",
  "/reports/investments/export?format=pdf",
  "/reports/investments/export?format=excel",
  "/reports/collection/export?format=pdf",
  "/reports/collection/export?format=excel",
  "/reports/adjustments/export?format=pdf",
  "/reports/adjustments/export?format=excel",
  "/members/export-all?format=pdf",
  "/members/export-all?format=excel",
  "/members/001/export?format=pdf",
  "/members/001/export?format=excel",
];

async function runTests() {
  let passed = 0;
  for (const ep of endpoints) {
    try {
      const res = await fetch("http://localhost:5000/api/v1" + ep);
      const ct = res.headers.get("content-type");
      const cd = res.headers.get("content-disposition");
      const buf = await res.arrayBuffer();
      if (res.status === 200 && buf.byteLength > 500) {
        console.log(`[PASS] STATUS ${res.status} | ${ep}`);
        console.log(`       Type: ${ct} | Size: ${buf.byteLength} bytes | Disposition: ${cd}`);
        passed++;
      } else {
        console.log(`[FAIL] STATUS ${res.status} | ${ep} | Size: ${buf.byteLength}`);
      }
    } catch (err) {
      console.error(`[ERROR] ${ep}:`, err.message);
    }
  }
  console.log(`\nTests Completed: ${passed}/${endpoints.length} passed.`);
}

runTests();
