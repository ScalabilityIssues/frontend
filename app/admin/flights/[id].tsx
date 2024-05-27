"use client"

import { Airport } from "@/clients/gen/flightmngr/airports";
import { AirportsClient } from "@/clients/gen/flightmngr/airports.client";
import { Flight } from "@/clients/gen/flightmngr/flights";
import { FlightsClient } from "@/clients/gen/flightmngr/flights.client";
import { webTransport } from "@/clients/transports/web";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FlightsIdAdmin() {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [airports_origin, setAirports_origin] = useState<Airport[]>([]);
    const [airports_destination, setAirports_destination] = useState<Airport[]>([]);
    const router = useRouter();
    const clientAirports = new AirportsClient(webTransport);
    const clientFlights = new FlightsClient(webTransport);


    return (<div></div>)
}