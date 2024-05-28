"use client"

import { Airport } from "@/clients/gen/flightmngr/airports";
import { AirportsClient } from "@/clients/gen/flightmngr/airports.client";
import { Flight } from "@/clients/gen/flightmngr/flights";
import { FlightsClient } from "@/clients/gen/flightmngr/flights.client";
import { Timestamp } from "@/clients/gen/google/protobuf/timestamp";
import { webTransport } from "@/clients/transports/web";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/*
API pseudo structure
- On GET show the form for inserting new flights
- On form submit call gRPC method to insert the new flight
*/
export default function FlightsAdmin() {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [airportDict, setAirportDict] = useState<Record<string, Airport>>({});
    const router = useRouter();
    const clientAirports = new AirportsClient(webTransport);
    const clientFlights = new FlightsClient(webTransport);

    useEffect(() => {
        clientFlights.listFlights({ includeCancelled: true }).then((result) => {
            setFlights(result.response.flights);
        });
    }, []);

    useEffect(() => {
        if (flights.length !== 0) {
            const uniqueAirportIds = flights.map((flight) => [flight.originId, flight.destinationId]).flat();
            uniqueAirportIds.forEach((id) => {
                if (!airportDict[id]) {
                    clientAirports.getAirport({ id: id }).then((result) => {
                        setAirportDict((prev) => ({ ...prev, [id]: result.response }));
                    });
                }
            });
        }
    }, [flights]);
    return (
        <div>
            <h2>Flight list</h2>
            <table>
                <thead>
                    <tr>
                        <th>Origin</th>
                        <th>Destination</th>
                        <th>Departure time</th>
                        <th>Arrival time</th>
                        <th>Last status</th>
                        <th>Additional action</th>
                    </tr>
                </thead>
                <tbody>
                    {flights.map((flight, index) => (
                        <tr key={index}>
                            <td>{airportDict[flight.id]?.name} - {airportDict[flight.id].iata}</td>
                            <td>{airportDict[flight.id]?.name} - {airportDict[flight.id].iata}</td>
                            <td>{flight.departureTime ? (Timestamp.toDate(flight.departureTime).toTimeString()) : "No info available"}</td>
                            <td>{flight.arrivalTime ? (Timestamp.toDate(flight.arrivalTime).toTimeString()) : "No info available"}</td>
                            <td>{flight.statusEvents[flight.statusEvents.length - 1].event.oneofKind}</td>
                            <td>
                                <button onClick={() => router.push(`/admin/planes/${flight.planeId}`)}>More plane info</button>
                                <button onClick={() => router.push(`/admin/flights/${flight.id}`)}>More flight info</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>)
}