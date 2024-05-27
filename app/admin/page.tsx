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
- On GET show admin page with button for inserting new flights, planes (by admin/flights/ and admin/planes)
  and below the list of all the flights
*/
export default function Admin() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airports_origin, setAirports_origin] = useState<Airport[]>([]);
  const [airports_destination, setAirports_destination] = useState<Airport[]>([]);
  const router = useRouter();
  const clientAirports = new AirportsClient(webTransport);
  const clientFlights = new FlightsClient(webTransport);

  const handleInsertFlight = () => {
    router.push('/admin/flights/');
  };

  const handleInsertPlane = () => {
    router.push('/admin/planes/');
  };

  useEffect(() => {
    clientFlights.listFlights({ includeCancelled: true }).then((result) => {
      setFlights(result.response.flights);
    });
  }, []);

  useEffect(() => {
    if (flights.length !== 0) {
      Promise.all(flights.map((flight) => clientAirports.getAirport({ id: flight.originId })))
        .then((responses) => setAirports_origin(responses.map((response) => response.response)));

      Promise.all(flights.map((flight) => clientAirports.getAirport({ id: flight.destinationId })))
        .then((responses) => setAirports_destination(responses.map((response) => response.response)));
    }
  }, [flights]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={handleInsertFlight}>Insert New Flight</button>
      <button onClick={handleInsertPlane}>Insert New Plane</button>

      <h2>Flights</h2>
      <table>
        <thead>
          <tr>
            <th>Origin</th>
            <th>Destination</th>
            <th>Departure time</th>
            <th>Arrival time</th>
            <th>Plane</th>
            <th>Last status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight, index) => (
            <tr key={index}>
              <td>{airports_origin[index]?.name} - {airports_origin[index].iata}</td>
              <td>{airports_destination[index]?.name} - {airports_destination[index].iata}</td>
              <td>{flight.departureTime ? (Timestamp.toDate(flight.departureTime).toTimeString()) : "No info available"}</td>
              <td>{flight.arrivalTime ? (Timestamp.toDate(flight.arrivalTime).toTimeString()) : "No info available"}</td>
              <td>{flight.planeId}</td>
              <td>{flight.statusEvents[flight.statusEvents.length - 1].event.oneofKind}</td>
              <td>
                <button onClick={() => router.push(`/admin/flights/${flight.id}`)}>More info</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
