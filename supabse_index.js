const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhaHB6em9iYnlxaXdmZmpubWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ5OTQzOTEsImV4cCI6MTk5MDU3MDM5MX0.zRjFz_ywQ75xbDMIUo8CCZuVE33uWtWWy57FdcqNVR4";

const url = "https://aahpzzobbyqiwffjnmeg.supabase.co";

const database = supabase.createClient(url, key);

const fetchData = async () => {
  let ahu_password = "";
  let altoxv_password = "";
  const res = await database.from("checklist").select("*");
  if (res) {
    ahu_password = res.data[0].ahu_password;
    altoxv_password = res.data[0].altoxv_password;
  }
};

fetchData();
