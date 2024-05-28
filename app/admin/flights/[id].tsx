"use client"

import { Airport } from "@/clients/gen/flightmngr/airports";
import { AirportsClient } from "@/clients/gen/flightmngr/airports.client";
import { Flight, FlightStatusEvent } from "@/clients/gen/flightmngr/flights";
import { FlightsClient } from "@/clients/gen/flightmngr/flights.client";
import { Timestamp } from "@/clients/gen/google/protobuf/timestamp";
import { webTransport } from "@/clients/transports/web";
import FlightStatusEventComponent from "@/components/flight-status";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FlightsIdAdmin() {
    const router = useRouter();
    const clientFlights = new FlightsClient(webTransport);
    const clientAirports = new AirportsClient(webTransport);
    const searchParams = useSearchParams();
    const flightId = searchParams.get('id') || '';
    const [flight, setFlight] = useState<Flight>();
    const [origin, setOrigin] = useState<Airport>();
    const [destination, sepestination] = useState<Airport>();
    const [isEditing, setIsEditing] = useState(false);
    const [selectedStatusEvent, setSelectedStatusEvent] = useState('');
    const [statusEvent, setStatusEvent] = useState<FlightStatusEvent>();

    useEffect(() => {
        if (flightId === '') {
            router.push('/admin/flights');
        } else {
            clientFlights.getFlight({ id: flightId }).then((result) => {
                setFlight(result.response);
            });
        }
    }, []);

    useEffect(() => {
        if (flight) {
            clientAirports.getAirport({ id: flight.originId }).then((result) => {
                setOrigin(result.response);
            });
            clientAirports.getAirport({ id: flight.destinationId }).then((result) => {
                sepestination(result.response);
            });
        }
    }, [flight]);

    const handleStatusEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        setSelectedStatusEvent(e.target.value);
    }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        switch (selectedStatusEvent) {
            case 'cancelled':
                const reason = formData.get('cancel_reason') as string;
                setStatusEvent({
                    timestamp: Timestamp.fromDate(new Date()),
                    event: {
                        oneofKind: "flightCancelled",
                        flightCancelled: { reason: reason }
                    }
                })
                break;
            case 'delayed':
                const departureTime = formData.get('delayed_departureTime') as string;
                const arrivalTime = formData.get('delayed_arrivalTime') as string;
                setStatusEvent({
                    timestamp: Timestamp.fromDate(new Date()),
                    event: {
                        oneofKind: "flightDelayed",
                        flightDelayed: {
                            departureTime: Timestamp.fromDate(new Date(departureTime)),
                            arrivalTime: Timestamp.fromDate(new Date(arrivalTime))
                        }
                    }
                })
                break;
            case 'gate_departure':
                const gateDeparture = formData.get('gate_departure') as string;
                setStatusEvent({
                    timestamp: Timestamp.fromDate(new Date()),
                    event: {
                        oneofKind: "flightGateDeparture",
                        flightGateDeparture: { gate: gateDeparture }
                    }
                })
                break;
            case 'gate_arrival':
                const gateArrival = formData.get('gate_arrival') as string;
                setStatusEvent({
                    timestamp: Timestamp.fromDate(new Date()),
                    event: {
                        oneofKind: "flightGateArrival",
                        flightGateArrival: { gate: gateArrival }
                    }
                })
                break;
        }

        clientFlights.updateFlight({ id: flightId, statusEvent });
        setIsEditing(false);
    }

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div>
            {flight === undefined ? (<h1>Flight not found</h1>) :
                isEditing ? (
                    <>
                        <h1>Edit Flight</h1>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="eventSelect">Event Type</label>
                            <select name="event" onChange={handleStatusEventChange} id="eventSelect">
                                <option value="">Select an event</option>
                                <option value="cancelled">Flight Cancelled</option>
                                <option value="delayed">Flight Delayed</option>
                                <option value="gate_departure">Flight Gate Departure</option>
                                <option value="gate_arrival">Flight Gate Arrival</option>
                            </select>

                            {selectedStatusEvent === 'cancelled' && (
                                <div>
                                    <label htmlFor="cancel_reason">Reason</label>
                                    <input type="text" id="cancel_reason" />
                                </div>
                            )}

                            {selectedStatusEvent === 'delayed' && (
                                <div>
                                    <label htmlFor="delayed_departureTime">Departure Time</label>
                                    <input type="datetime-local" id="delayed_departureTime" />
                                    <label htmlFor="delayed_arrivalTime">Arrival Time</label>
                                    <input type="datetime-local" id="delayed_arrivalTime" />
                                </div>
                            )}

                            {selectedStatusEvent === 'gate_departure' && (
                                <div>
                                    <label htmlFor="gate_departure">Gate</label>
                                    <input type="text" id="gate_departure" />
                                </div>
                            )}

                            {selectedStatusEvent === 'gate_arrival' && (
                                <div>
                                    <label htmlFor="gate_arrival">Gate</label>
                                    <input type="text" id="gate_arrival" />
                                </div>
                            )}

                            <button type="submit">Update Flight</button>
                            <button type="button" onClick={toggleEdit}>Cancel</button>
                        </form>
                    </>
                ) : (
                    <>
                        <h1>Flight id: {flight?.id}</h1>
                        <p>Origin airport: {origin?.name} - {origin?.iata}</p>
                        <p>Destination airport: {destination?.name} - {destination?.iata}</p>
                        <p>Plane id: {flight.planeId}</p>
                        <p>Departure time: {flight.departureTime ? (Timestamp.toDate(flight.departureTime).toTimeString()) : "No info available"}</p>
                        <p>Expected departure time: {flight.expectedDepartureTime ? (Timestamp.toDate(flight.expectedDepartureTime).toTimeString()) : "No info available"}</p>
                        <p>Departure gate: {flight.departureGate ? flight.departureGate : "No info available"}</p>
                        <p>Arrival time: {flight.arrivalTime ? (Timestamp.toDate(flight.arrivalTime).toTimeString()) : "No info available"}</p>
                        <p>Expected arrival time: {flight.expectedArrivalTime ? (Timestamp.toDate(flight.expectedArrivalTime).toTimeString()) : "No info available"}</p>
                        <p>Arrival gate: {flight.arrivalGate ? flight.arrivalGate : "No info available"}</p>
                        <p>Cancelled: {flight.isCancelled ? "Yes" : "No"}</p>

                        <h2>Status events</h2>
                        <ul>
                            {flight.statusEvents.map((event, index) => (
                                <li key={index}>
                                    <FlightStatusEventComponent {...event} />
                                </li>
                            ))}
                        </ul>
                        <button onClick={toggleEdit}>Edit</button>
                    </>
                )
            }
        </div>
    )
}
