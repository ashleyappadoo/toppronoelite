// Expose public Supabase credentials to the client
// SUPABASE_URL and SUPABASE_ANON_KEY must be set in Vercel Environment Variables
module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.json({
    supabaseUrl:     process.env.SUPABASE_URL     || null,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || null,
  });
};
