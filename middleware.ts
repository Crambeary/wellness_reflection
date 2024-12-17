import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { coachMiddleware } from './middleware/coachMiddleware'

export async function middleware(request: NextRequest) {
  // Check if the route starts with /coach
  if (request.nextUrl.pathname.startsWith('/coach')) {
    return await coachMiddleware(request)
  }
  
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/coach/:path*'  // Add this to specifically match coach routes
  ],
}