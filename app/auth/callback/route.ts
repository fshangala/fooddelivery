import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ProfileService } from '@/lib/services/profile_service'

/**
 * Route handler for handling Supabase authentication callbacks (e.g., email confirmation).
 * Exchanges the 'code' query parameter for a session and redirects the user
 * based on their role.
 * 
 * @param request - The incoming request object.
 * @returns A promise that resolves to a NextResponse redirecting the user.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Fetch user profile to determine their role
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const profile = await ProfileService.getProfile(supabase, user.id)
        
        // Redirect to /admin if the user is an administrator
        if (profile?.role === 'admin') {
          return NextResponse.redirect(`${origin}/admin`)
        }
      }
      
      // For customers, drivers, or if role is unknown, redirect to 'next' (default /)
      // Append confirmation success to the URL for the home page to show a message if needed
      const isNextHomePage = next === '/' || next === ''
      const redirectUrl = isNextHomePage 
        ? `${origin}${next}?email_comfirmation=success`
        : `${origin}${next}`
        
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Return the user to the login page with an error parameter if exchange fails
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}
