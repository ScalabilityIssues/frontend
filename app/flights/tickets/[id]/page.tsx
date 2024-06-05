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
import QrCode from '@/components/qr-code'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'


export default function TicketIdDetails({ params }: { params: { id: string } }) {
    const clientTicket = new TicketsClient(webTransport)
    const clientFlights = new FlightsClient(webTransport)
    const clientAirports = new AirportsClient(webTransport)

    const [ticket, setTicket] = useState<Ticket>()
    const [qrCode, setQrCode] = useState<Uint8Array>()
    const [flight, setFlight] = useState<Flight>()
    const [origin, setOrigin] = useState<Airport>()
    const [destination, setDestination] = useState<Airport>()
    const [lastStatus, setLastStatus] = useState<FlightStatusEvent>()

    useEffect(() => {

        clientTicket.getTicketWithQrCode({
            query: { oneofKind: "id", id: params.id },
            allowNonvalid: false
        }).then((result) => {
            setTicket(result.response.ticket)
            setQrCode(result.response.qrCode)
        })
    }, [])

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
        if (flight && flight.statusEvents.length > 0) {
            const event = flight.statusEvents.slice().sort((a, b) => {
                return ((a.timestamp && Timestamp.toDate(a.timestamp).getTime()) || 0) -
                    ((b.timestamp && Timestamp.toDate(b.timestamp).getTime()) || 0);
            })[flight.statusEvents.length - 1]
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
        <div className="container mx-auto p-4">
            {ticket === undefined ? (
                <h1 className="text-2xl font-bold text-center text-red-500">Ticket not found</h1>
            ) : (
                <>
                    <h1 className="text-2xl font-bold text-center mb-6">Ticket Details</h1>
                    <div className="space-y-4">
                        <p className="block text-black-700"><span className="font-semibold">Id:</span> {ticket.id}</p>
                        <p className={`block ${ticket.ticketStatus == 0 ? 'text-green-600' : 'text-red-600'}`}><span className="font-semibold">Status:</span> {ticket.ticketStatus == 0 ? "Valid" : "Deleted"}</p>
                        <p className="block text-black-700"><span className="font-semibold">Reservation datetime:</span> {ticket.reservationDatetime ? (Timestamp.toDate(ticket.reservationDatetime).toLocaleString()) : ("No info available")}</p>
                        <p className="block text-black-700"><span className="font-semibold">Estimated cargo weight:</span> {ticket.estimatedCargoWeight}</p>

                        <h2 className="text-2xl font-semibold mt-6">QR Code</h2>
                        <QrCode data={qrCode} className="w-1/3 mx-auto" alt="Ticket QR Code" />

                        <h2 className="text-2xl font-semibold mt-6">Passenger Details</h2>
                        <p className="block text-black-700"><span className="font-semibold">SSN:</span> {ticket.passenger?.ssn}</p>
                        <p className="block text-black-700"><span className="font-semibold">Name:</span> {ticket.passenger?.name}</p>
                        <p className="block text-black-700"><span className="font-semibold">Surname:</span> {ticket.passenger?.surname}</p>
                        <p className="block text-black-700"><span className="font-semibold">Birth date:</span> {ticket.passenger?.birthDate ? (Timestamp.toDate(ticket.passenger?.birthDate).toLocaleDateString()) : ("No info available")}</p>
                        <p className="block text-black-700"><span className="font-semibold">Email:</span> {ticket.passenger?.email}</p>

                        <h2 className="text-2xl font-semibold mt-6">Flight Details</h2>
                        <p className="block text-black-700"><span className="font-semibold">Source airport:</span> {origin?.iata} - {origin?.name} - {origin?.country}</p>
                        <p className="block text-black-700"><span className="font-semibold">Destination airport:</span> {destination?.iata} - {destination?.name} - {destination?.country}</p>
                        <p className="block text-black-700"><span className="font-semibold">Departure datetime:</span> {flight?.departureTime ? (Timestamp.toDate(flight?.departureTime).toLocaleString()) : ("No info available")}</p>
                        <p className="block text-black-700"><span className="font-semibold">Arrival datetime:</span> {flight?.arrivalTime ? (Timestamp.toDate(flight?.arrivalTime).toLocaleString()) : ("No info available")}</p>

                        <h2 className="text-2xl font-semibold mt-6">Flight Status</h2>
                        <p className="block text-black-700"><span className="font-semibold">Last event:</span></p>
                        {lastStatus === undefined ? (
                            <p className="block text-black-700">No status available</p>
                        ) : (
                            <FlightStatusEventComponent props={lastStatus} />
                        )}
                        <p className="block text-black-700"><span className="font-semibold">Expected departure:</span> {flight?.expectedDepartureTime ? (Timestamp.toDate(flight?.expectedDepartureTime).toLocaleString()) : ("No info available")}</p>
                        <p className="block text-black-700"><span className="font-semibold">Expected arrival:</span> {flight?.expectedArrivalTime ? (Timestamp.toDate(flight?.expectedArrivalTime).toLocaleString()) : ("No info available")}</p>
                    </div>
                </>
            )}
        </div>

    )
}