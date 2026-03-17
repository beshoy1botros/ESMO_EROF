import { createClient } from "@supabase/supabase-js";

// Supabase credentials provided by user
const SUPABASE_URL = "https://xbsgkyikyxwakmszmnsg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_LF1an3VzfZMZTO_yBA5egQ_8oJey3oE";

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Supabase Storage base URL for videos
// Format: https://{project_ref}.supabase.co/storage/v1/object/public/{bucket}/{path}
export const SUPABASE_VIDEO_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/melodies-videos.`;

// Helper function to get video URL from Supabase
export function getVideoUrl(filename: string): string {
  return `${SUPABASE_VIDEO_BASE_URL}/${filename}`;
}
