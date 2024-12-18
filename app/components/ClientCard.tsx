'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export default function ClientCard({ clientName = 'John Doe' }: { clientName: string }) {
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
            <Button className="border-none w-full">View Client Reflections</Button>
          </CardContent>
        </Card>
    )
}