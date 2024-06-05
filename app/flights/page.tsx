"use client"

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { SaleClient } from "@/clients/gen/salesvc/sale.client";
import { webTransport } from "@/clients/transports/web";
import { Offer, OfferClaims } from "@/clients/gen/salesvc/sale";
import { PassengerDetails } from "@/clients/gen/ticketsrvc/tickets";
import { Timestamp } from "@/clients/gen/google/protobuf/timestamp";
import { AirportsClient } from "@/clients/gen/flightmngr/airports.client";
/*
API pseudo structure
- On GET with the params, it will return the list of flights calling the gRPC method (if no params return all the not sold flights)
- Selecting the flight will show the flight details hided by CSS and retrieved before by calling the gRPC method
- Pressing a button is possible to buy the flight calling the gRPC method (similar to POST) directly from the page
*/


export default function Flights({ searchParams }: {
    searchParams: {
        departure: string,
        destination: string,
        departureDate: string
    }
}) {
    const ITEMS_PER_PAGE = 20;
    const router = useRouter();
    const departure = searchParams.departure || '';
    const destination = searchParams.destination || '';
    const departureDate = searchParams.departureDate || '';

    const [offers, setOffers] = useState<Offer[]>([]);
    const [selectedOffer, setSelectedOffer] = useState(-1);
    const [currentPage, setCurrentPage] = useState(1);
    const [departure_name, setDepartureName] = useState('');
    const [destination_name, setDestinationName] = useState('');
    const [step, setStep] = useState(1); // 1: Select flight, 2: Enter user info
    const [passenger, setPassenger] = useState({
        ssn: '',
        name: '',
        surname: '',
        birth_date: '',
        email: ''
    });
    const isUserInfoComplete = passenger.ssn && passenger.name &&
        passenger.surname && passenger.birth_date && passenger.email;


    const saleClient = new SaleClient(webTransport);
    const clientAirports = new AirportsClient(webTransport);

    useEffect(() => {
        if (departure && destination && departureDate) {
            saleClient.searchOffers({
                departureAirport: departure, arrivalAirport: destination,
                departureDate: Timestamp.fromDate(new Date(departureDate))
            }).then((result) => {
                setOffers(result.response.offers);
            });
        }
    }, [departure, destination, departureDate]);

    useEffect(() => {
        if (departure && destination) {
            clientAirports.getAirport({ id: departure }).then((result) => {
                setDepartureName(result.response.name);
            });
            clientAirports.getAirport({ id: destination }).then((result) => {
                setDestinationName(result.response.name);
            });
        }

    }, [departure, destination]);

    const handlePrevious = () => {
        setStep(1);
    };
    const handleNext = () => {
        if (selectedOffer !== -1) {
            setStep(2);
        }
    };

    const handlePurchase = (event: FormEvent) => {
        event.preventDefault();

        if (selectedOffer !== -1) {
            const currOffer = offers[selectedOffer];
            const flight_id = currOffer.flight?.id || ''
            const price = currOffer.price
            const expiration = currOffer.expiration
            const tag = currOffer.tag

            const offerClaim: OfferClaims = {
                flightId: flight_id,
                price: price,
                expiration: expiration
            }

            const passengerData: PassengerDetails = {
                ssn: passenger.ssn,
                name: passenger.name,
                surname: passenger.surname,
                birthDate: Timestamp.fromDate(new Date(passenger.birth_date)),
                email: passenger.email
            };
            saleClient.purchaseOffer({ offer: offerClaim, data: passengerData, tag: tag }).then((purchase) => {
                if (purchase.response.ticket) {
                    router.push('/flights/tickets/' + purchase.response.ticket.url);
                } else {
                    alert('Error purchasing the ticket');
                }
            });
        }
    };

    const updatePassenger = (field: string, value: string) => {
        setPassenger({ ...passenger, [field]: value });
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const paginatedOffers = offers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const totalPages = Math.ceil(offers.length / ITEMS_PER_PAGE);

    return (
        <div className="container mx-auto p-4">
            {step === 1 ? (
                <>
                    <h1 className="text-2xl font-bold mb-6">Flight Results</h1>
                    <h2 className="text-xl font-semibold">From {departure_name} to {destination_name}</h2>
                    {offers.length > 0 ? (
                        <>
                            <ul className="space-y-4">
                                {paginatedOffers.map((offer, index) => (
                                    <li key={index}
                                        className={`p-4 border rounded cursor-pointer transition-colors
                                        ${selectedOffer === index + (currentPage - 1) * ITEMS_PER_PAGE ? 'bg-blue-500 text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                                        onClick={() => setSelectedOffer(index + (currentPage - 1) * ITEMS_PER_PAGE)}>
                                        <h2 className="text-xl font-semibold">Flight {index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}</h2>
                                        <p className="block text-black-700">
                                            {offer.flight?.departureTime && offer.flight?.arrivalTime ?
                                                `${Timestamp.toDate(offer.flight.departureTime).toLocaleString()} - ${Timestamp.toDate(offer.flight.arrivalTime).toLocaleString()}` : ''}
                                        </p>
                                        <p className="block text-black-700">{offer.price?.units}{offer.price?.currencyCode}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    type="button"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <button
                                    type="button"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                            <button type="button" onClick={handleNext} disabled={selectedOffer === -1} className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                Add passenger info
                            </button>
                        </>
                    ) : (
                        <p className="block text-black-700 text-red-500">No flights found</p>
                    )}
                </>
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-6">Enter User Information</h1>
                    <form onSubmit={handlePurchase} className="space-y-4">
                        <div>
                            <label htmlFor="ssn" className="block text-black-700 font-medium">SSN</label>
                            <input type="text" id="ssn" value={passenger.ssn} onChange={(e) => updatePassenger('ssn', e.target.value)} className="mt-1 block w-full p-1 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-black-700 font-medium">Name</label>
                            <input type="text" id="name" value={passenger.name} onChange={(e) => updatePassenger('name', e.target.value)} className="mt-1 block w-full p-1 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="surname" className="block text-black-700 font-medium">Surname</label>
                            <input type="text" id="surname" value={passenger.surname} onChange={(e) => updatePassenger('surname', e.target.value)} className="mt-1 block w-full p-1 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="birth_date" className="block text-black-700 font-medium">Birth Date</label>
                            <input type="date" id="birth_date" value={passenger.birth_date} onChange={(e) => updatePassenger('birth_date', e.target.value)} className="mt-1 block w-full p-1 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-black-700 font-medium">Email</label>
                            <input type="email" id="email" value={passenger.email} onChange={(e) => updatePassenger('email', e.target.value)} className="mt-1 block w-full p-1 border border-gray-300 rounded-md" />
                        </div>

                        <div className="flex justify-between">
                            <button type="button" onClick={handlePrevious} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                                Previous
                            </button>
                            <button type="submit" disabled={!isUserInfoComplete} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                Purchase
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};
