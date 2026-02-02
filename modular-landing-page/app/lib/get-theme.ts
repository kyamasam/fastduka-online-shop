// Server-side theme fetcher
// This runs on the server during SSR

export async function getTheme(): Promise<string> {
  // Simulate API call to your backend
  // In production, replace this with actual API call:
  // const response = await fetch('https://your-backend.com/api/theme', {
  //   headers: {
  //     // Pass any necessary headers (auth, tenant-id, etc.)
  //   },
  //   cache: 'no-store', // or use Next.js revalidation
  // });
  // const data = await response.json();
  // return data.theme;

  // For now, simulate delay and return theme
  await new Promise(resolve => setTimeout(resolve, 100));

  // Priority order:
  // 1. Environment variable (for testing)
  // 2. Could check headers/cookies here
  // 3. Default to 'default'
  return process.env.NEXT_PUBLIC_THEME || 'default'; // construction, default, clothing
}
