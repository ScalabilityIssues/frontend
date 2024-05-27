"use client"

import { FlightsClient } from '@/clients/gen/flightmngr/flights.client'
import { Ticket } from '@/clients/gen/ticketsrvc/tickets'
import { TicketsClient } from '@/clients/gen/ticketsrvc/tickets.client'
import { webTransport } from '@/clients/transports/web'
import { useQRCode } from 'next-qrcode'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'


export default function TicketIdDetails() {
    const router = useRouter()
    const clientTicket = new TicketsClient(webTransport)
    const clientFlights = new FlightsClient(webTransport)
    const searchParams = useSearchParams();
    const ticketId = searchParams.get('id') || '';

    const [ticket, setTicket] = useState<Ticket | null>(null)
    const { Canvas } = useQRCode();

    useEffect(() => {
        if (ticketId !== '') {
            clientTicket.getSignedTicket({ id: ticketId, allowNonvalid: false }).then((result) => {
                //setTicket(result.response.ticket)
            })
        } else {
            router.push('/')
        }
    }, [ticketId])


    return (
        <><p>Post: {router.query.id}</p>
            <Canvas
                text={'https://github.com/bunlong/next-qrcode'}
                options={{
                    errorCorrectionLevel: 'M',
                    margin: 3,
                    scale: 4,
                    width: 200,
                    color: {
                        dark: '#010599FF',
                        light: '#FFBF60FF',
                    },
                }}
            />
        </>
    )
}