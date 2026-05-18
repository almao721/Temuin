async function testLogin() {
  // Test with the existing admin user (nis_nip: 123456)
  const tests = [
    { nis_nip: '123456', password: 'admin123' },
    { nis_nip: '123456', password: 'password' },
    { nis_nip: '123456', password: '123456' },
    { nis_nip: '544241097', password: 'password' },
    { nis_nip: '544241097', password: '544241097' },
  ];
  
  for (const t of tests) {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t)
      });
      const data = await res.json();
      console.log(`${t.nis_nip} / ${t.password} =>`, data.success ? '✅ LOGIN OK' : `❌ ${data.message}`);
      if (data.success) {
        console.log('  Token:', data.data.token.substring(0, 30) + '...');
        console.log('  User:', data.data.user);
      }
    } catch (err) {
      console.error(`${t.nis_nip} / ${t.password} => ERROR:`, err.message);
    }
  }
}
testLogin();
