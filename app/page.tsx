"use client"

import React, { useEffect, useState } from 'react';
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useRouter } from "next/navigation";
import { webTransport } from '@/clients/transports/web'
import { AirportsClient } from '@/clients/gen/flightmngr/airports.client';
import { Airport } from '@/clients/gen/flightmngr/airports';

/* import { webTransport } from '@/clients/transports/web';
import { exampleServerGRPC } from '@/components/example'; 
import { AirportsClient } from '@/clients/gen/flightmngr/airports.client'; */
/* // example of server call
useEffect(() => {
  exampleServerGRPC().then((planes) => console.log(planes));
});
// example of client call
const s = new AirportsClient(webTransport);
s.listAirports({}).then((planes) => console.log(planes.response)); */

export default function Home() {

  const airportsClient = new AirportsClient(webTransport);

  const router = useRouter();
  const [airports, setAirports] = useState<Airport[]>([]);
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');

  useEffect(() => {
    airportsClient.listAirports({ showDeleted: false }).then((result) => {
      setAirports(result.response.airports);
    });
  }, []);

  const handleSubmit = () => {
    const params = new URLSearchParams();
    params.set('departure', departure);
    params.set('destination', destination);
    params.set('departureDate', departureDate);
    router.push(`/flights?${params.toString()}`);
  };

  return (
    <>
      <div className='flex items-center justify-center'>
        <form className="bg-blue-200 p-8 rounded-lg grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="departure">Departure:</label>
            <select value={departure} id="departure" onChange={(e) => setDeparture(e.target.value)}>
              <option value="">Select Departure</option>
              {airports.map((airport, index) => (
                <option key={index} value={airport.id}>
                  {airport.iata + ' - ' + airport.name + ' - ' + airport.country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="destination">Destination:</label>
            <select value={destination} id="destination" onChange={(e) => setDestination(e.target.value)}>
              <option value="">Select Destination</option>
              {airports.map((airport, index) => (
                <option key={index} value={airport.id}>
                  {airport.iata + ' - ' + airport.name + ' - ' + airport.country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="departureDate">Departure Date:</label>
            <input
              type="date"
              id="departureDate"
              className='pl-2 rounded-lg'
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </div>

          <div>
            <button type="button" className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-extrabold
              text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-blue-700" onClick={handleSubmit}>
              Search Flights
            </button>
          </div>

        </form>
      </div>
    </>
  )
}
