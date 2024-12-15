import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Elevate Wellness',
    short_name: 'Elevate',
    description: 'Wellness Tracker and Reflection',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
  }
}