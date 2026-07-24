const supabaseUrl = 'https://zfkvpqqqekxaxnhevwno.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpma3ZwcXFxZWt4YXhuaGV2d25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzYyMzYsImV4cCI6MjA1NDg1MjIzNn0.Rw7bFAtUNMIPYL3cwEEGg_3amQe5aTHeG0Csj1m3v3U';

async function check() {
  try {
    const response = await fetch(supabaseUrl + '/rest/v1/', {
      headers: {
        'apikey': supabaseKey,
      }
    });
    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body preview:', text.substring(0, 500));
  } catch (err) {
    console.error('Error fetching:', err);
  }
}
check();
