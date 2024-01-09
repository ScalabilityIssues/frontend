'use client'
import React, { useEffect, useState } from 'react';
import Header from "@/components/header"
import Footer from "@/components/footer"
import { webTransport } from '@/clients/transports/web';
import { exampleServerGRPC } from '@/components/example';
import { AirportsClient } from '@/clients/gen/airports.client';


export default function Home() {

  // example of server call
  useEffect(() => {
    exampleServerGRPC().then((planes) => console.log(planes));
  });
  // example of client call
  const s = new AirportsClient(webTransport);
  s.listAirports({}).then((planes) => console.log(planes.response));

  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [numPassengers, setNumPassengers] = useState(1);

  return (
    <>
      <Header />
      <main>
        <div className='flex items-center justify-center'>
          <form className="bg-blue-200 p-8 rounded-lg grid grid-cols-6 gap-4">
            <label htmlFor="departure">Departure:</label>
            <input
              type="text"
              id="departure"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)} //must fetch airports from flight management service
            />

            <label htmlFor="destination">Destination:</label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)} //must fetch airports from flight management service
            />

            <label htmlFor="departureDate">Departure Date:</label>
            <input
              type="date"
              id="departureDate"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />

            <label htmlFor="returnDate">Return Date:</label>
            <input
              type="date"
              id="returnDate"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />

            <label htmlFor="numPassengers">Number of Passengers:</label>
            <input
              type="number"
              id="numPassengers"
              value={numPassengers}
              onChange={(e) => setNumPassengers(parseInt(e.target.value))}
              min="1"
            />
            <div>
              <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Search Flights
              </button>
            </div>
               
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
