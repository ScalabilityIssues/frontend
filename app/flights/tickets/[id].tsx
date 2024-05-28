"use client"

import { Airport } from '@/clients/gen/flightmngr/airports'
import { AirportsClient } from '@/clients/gen/flightmngr/airports.client'
import { Flight, FlightStatusEvent } from '@/clients/gen/flightmngr/flights'
import { FlightsClient } from '@/clients/gen/flightmngr/flights.client'
import { Timestamp } from '@/clients/gen/google/protobuf/timestamp'
import { Ticket } from '@/clients/gen/ticketsrvc/tickets'
import { TicketsClient } from '@/clients/gen/ticketsrvc/tickets.client'
import { webTransport } from '@/clients/transports/web'
import FlightStatusEventComponent from '@/components/flight-status'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'


export default function TicketIdDetails() {
    const router = useRouter()
    const clientTicket = new TicketsClient(webTransport)
    const clientFlights = new FlightsClient(webTransport)
    const clientAirports = new AirportsClient(webTransport)
    const searchParams = useSearchParams();
    const ticketId = searchParams.get('id') || '';

    const [ticket, setTicket] = useState<Ticket>()
    const [qrCode, setQrCode] = useState<Uint8Array>()
    const [flight, setFlight] = useState<Flight>()
    const [origin, setOrigin] = useState<Airport>()
    const [destination, setDestination] = useState<Airport>()
    const [lastStatus, setLastStatus] = useState<FlightStatusEvent>()

    useEffect(() => {
        if (ticketId === '') {
            router.push('/')
        } else {
            clientTicket.getTicketWithQrCode({ id: ticketId, allowNonvalid: false }).then((result) => {
                setTicket(result.response.ticket)
                setQrCode(result.response.qrCode)
            })
        }
    }, [ticketId])

    useEffect(() => {
        if (ticket) {
            clientFlights.getFlight({ id: ticket.flightId }).then((result) => {
                setFlight(result.response)
            })
        }
    }, [ticket])

    useEffect(() => {
        if (flight) {
            clientAirports.getAirport({ id: flight.originId }).then((result) => {
                setOrigin(result.response)
            })
            clientAirports.getAirport({ id: flight.destinationId }).then((result) => {
                setDestination(result.response)
            })
        }
    }, [flight])

    useEffect(() => {
        if (flight) {
            const event = flight.statusEvents[flight.statusEvents.length - 1]
            switch (event.event.oneofKind) {
                case 'flightCancelled':
                    setLastStatus(event)
                    break
                case 'flightDelayed':
                    setLastStatus(event)
                    break
                case 'flightGateArrival':
                    setLastStatus(event)
                    break
                case 'flightGateDeparture':
                    setLastStatus(event)
                    break
            }
        }
    }, [flight])


    return (
        <div>
            {ticket === undefined ? (<h1>Ticket not found</h1>) :
                <>
                    <h1>Ticket details</h1>
                    <p>Id: {ticket.id}</p>
                    <p>Reservation datetime: {ticket.reservationDatetime ? (Timestamp.toDate(ticket.reservationDatetime).toLocaleString()) : ("No info available")}</p>

                    <h2>QR Code</h2>
                    <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" className='qrCode' />

                    <h2>Passenger Details</h2>
                    <p>SSN: {ticket.passenger?.ssn}</p>
                    <p>Name: {ticket.passenger?.name}</p>
                    <p>Surname: {ticket.passenger?.surname}</p>
                    <p>Birth date: {ticket.passenger?.birthDate ?
                        (Timestamp.toDate(ticket.passenger?.birthDate).toDateString()) : ("No info available")}</p>
                    <p>Email: {ticket.passenger?.email}</p>

                    <p>Reservation datetime: {ticket.reservationDatetime ?
                        (Timestamp.toDate(ticket.reservationDatetime).toLocaleString()) : ("No info available")}</p>
                    <p>Estimated cargo weight: {ticket.estimatedCargoWeight}</p>

                    <h2>Flight details</h2>
                    <p>Source airport: {origin?.iata} - {origin?.name} - {origin?.country}</p>
                    <p>Destination airport: {destination?.iata} - {destination?.name} - {destination?.country}</p>
                    <p>Departure datetime: {flight?.departureTime ?
                        (Timestamp.toDate(flight?.departureTime).toLocaleString()) : ("No info available")}</p>
                    <p>Arrival datetime: {flight?.arrivalTime ?
                        (Timestamp.toDate(flight?.arrivalTime).toLocaleString()) : ("No info available")}</p>

                    <h2>Flight status</h2>
                    <p>Last event:
                        {lastStatus === undefined ?
                            (<p>No status available</p>) : (<FlightStatusEventComponent {...lastStatus} />)}
                    </p>
                    <p>Expected departure: {flight?.expectedDepartureTime ?
                        (Timestamp.toDate(flight?.expectedDepartureTime).toLocaleString()) : ("No info available")}</p>
                    <p>Expected arrival: {flight?.expectedArrivalTime ?
                        (Timestamp.toDate(flight?.expectedArrivalTime).toLocaleString()) : ("No info available")}</p>

                </>
            }
        </div>
    )
}