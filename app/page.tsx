import React, { useState } from 'react';
import Header from "@/components/header"
import Footer from "@/components/footer"
import useSWR from 'swr'


//https://nextjs.org/docs/pages/building-your-application/data-fetching/client-side
export default function Home() {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [numPassengers, setNumPassengers] = useState(1);

  return (
    <>
      <Header></Header>
      <main>
        <h1>Welcome to Horizon Airline!</h1>
        <div>
          <form>
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
            <button type="submit">Search Flights</button>
          </form>
        </div>

      </main>
      <Footer></Footer>
    </>
  )
}
