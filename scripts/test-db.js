const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read env
const envPath = path.resolve(__dirname, '../.env.local');
let env = {};
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const index = trimmed.indexOf('=');
      if (index !== -1) {
        const key = trimmed.substring(0, index).trim();
        const val = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
        env[key] = val;
      }
    }
  });
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("Missing env keys!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndCreateGuest() {
  // Check if guest user already exists
  const { data: profiles, error: profErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'customer');
  
  console.log("Existing profiles:", profiles);

  let guestProfile = profiles.find(p => p.full_name === 'Khách hàng vãng lai' || p.full_name === 'Guest User');
  
  if (!guestProfile) {
    console.log("Creating a guest user...");
    const { data: userData, error: userErr } = await supabase.auth.admin.createUser({
      email: 'guest@vietnamprosperity.com',
      password: 'guestPassword123!',
      email_confirm: true,
      user_metadata: { full_name: 'Khách hàng vãng lai' }
    });

    if (userErr) {
      console.error("Error creating guest user:", userErr);
    } else {
      console.log("Guest user created successfully:", userData.user.id);
    }
  } else {
    console.log("Guest user already exists. ID:", guestProfile.id);
  }
}

checkAndCreateGuest();
