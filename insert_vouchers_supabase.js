const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zfkvpqqqekxaxnhevwno.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpma3ZwcXFxZWt4YXhuaGV2d25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzYyMzYsImV4cCI6MjA1NDg1MjIzNn0.Rw7bFAtUNMIPYL3cwEEGg_3amQe5aTHeG0Csj1m3v3U';
const supabase = createClient(supabaseUrl, supabaseKey);

const voucherIds = [
  "BJA2K7", "BJB3M8", "BJC4N1", "BJD5P9", "BJE6R2", "BJF7T4", "BJG8V5", "BJH9X3",
  "BJJ1L6", "BJK2Q8", "BJL3S5", "BJM4W7", "BJN5Y2", "BJP6C9", "BJQ7D1", "BJR8F4",
  "BJS9G6", "BJT1H8", "BJV2K5", "BJW3M7", "BJX4N9", "BJY5P1", "BJZ6R3", "BJA7T8",
  "BJB8V2", "BJC9X5", "BJD1L7", "BJE2Q9", "BJF3S6", "BJG4W1", "BJH5Y8", "BJJ6C2",
  "BJK7D4", "BJL8F9", "BJM9G3", "BJN1H5", "BJP2K8", "BJQ3M6", "BJR4N1", "BJS5P7",
  "BJT6R9", "BJV7T2", "BJW8V4", "BJX9X6", "BJY1L3", "BJZ2Q5", "BJA3S8", "BJB4W9",
  "BJC5Y1", "BJD6C7", "BJE7D2", "BJF8F5", "BJG9G4", "BJH1H6", "BJJ2K9", "BJK3M1",
  "BJL4N8", "BJM5P2", "BJN6R7", "BJP7T3", "BJQ8V9", "BJR9X1", "BJS1L4", "BJT2Q6",
  "BJV3S7", "BJW4W5", "BJX5Y9", "BJY6C1", "BJZ7D8", "BJA8F2", "BJB9G5", "BJC1H7",
  "BJD2K4", "BJE3M9", "BJF4N6", "BJG5P1", "BJH6R8", "BJJ7T2", "BJK8V3", "BJL9X5",
  "BJM1L7", "BJN2Q4", "BJP3S9", "BJQ4W6", "BJR5Y2", "BJS6C8", "BJT7D1", "BJV8F9",
  "BJW9G3", "BJX1H5", "BJY2K7", "BJZ3M8", "BJA4N1", "BJB5P6", "BJC6R2", "BJD7T9",
  "BJE8V4", "BJF9X5"
];

async function insert() {
  const payloads = voucherIds.map(code => ({
    voucher_id: code,
    value: "1 Gelato Pequeno",
    active: true
  }));

  console.log(`Inserting ${payloads.length} vouchers...`);
  const { data, error } = await supabase
    .from('Vouchers')
    .insert(payloads);

  if (error) {
    console.error("Error inserting vouchers:", error);
  } else {
    console.log("Successfully inserted all vouchers in Supabase!");
  }
}

insert();
