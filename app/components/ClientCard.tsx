'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function ClientCard({ clientName = 'John Doe', clientID }: { clientName: string, clientID: string }) {
    const router = useRouter()
    const ViewClientReflection = () => {
      router.push(`/coach/view-clients/${clientID}/reflections`)
    }
    return (
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle>{clientName}</CardTitle>
            <Avatar>
              <AvatarImage  />
              <AvatarFallback>{clientName.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent>
            <Button className="border-none w-full" onClick={ViewClientReflection}>View Client Reflections</Button>
          </CardContent>
        </Card>
    )
}