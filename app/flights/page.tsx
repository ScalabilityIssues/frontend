"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { SaleClient } from "@/clients/gen/salesvc/sale.client";
import { webTransport } from "@/clients/transports/web";
import { Offer, OfferClaims } from "@/clients/gen/salesvc/sale";
import { PassengerDetails } from "@/clients/gen/ticketsrvc/tickets";
import { Timestamp } from "@/clients/gen/google/protobuf/timestamp";
import { off } from "process";

/*
API pseudo structure
- On GET with the params, it will return the list of flights calling the gRPC method (if no params return all the not sold flights)
- Selecting the flight will show the flight details hided by CSS and retrieved before by calling the gRPC method
- Pressing a button is possible to buy the flight calling the gRPC method (similar to POST) directly from the page
*/

export default function Flights() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const departure = searchParams.get('departure') || '';
    const destination = searchParams.get('destination') || '';
    const departureDate = searchParams.get('departureDate') || '';

    const [offers, setOffers] = useState<Offer[]>([]);
    const [selectedOffer, setSelectedOffer] = useState(-1);

    const [step, setStep] = useState(1); // 1: Select flight, 2: Enter user info
    const [passenger, setPassenger] = useState({
        ssn: '',
        name: '',
        surname: '',
        birth_date: '',
        email: ''
    });
    const isUserInfoComplete = passenger.ssn && passenger.name && passenger.surname && passenger.birth_date && passenger.email;


    const saleClient = new SaleClient(webTransport);

    // Redirect to the home page if the search params are not present
    useEffect(() => {
        if (Object.values(searchParams).length === 0) {
            router.push('/');
        }
    }, [router]);


    const handlePrevious = () => {
        setStep(1);
    };
    const handleNext = () => {
        if (selectedOffer) {
            setStep(2);
        }
    };
    const handlePurchase = async () => {
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
                    router.push('/flights/tickets/' + purchase.response.ticket.id);
                } else {
                    alert('Error purchasing the ticket');
                }
            });
        }
    }

    useEffect(() => {
        saleClient.searchOffers({
            departureAirport: departure, arrivalAirport: destination,
            departureDate: Timestamp.fromDate(new Date(departureDate))
        }).then((result) => {
            setOffers(result.response.offers);
        });
    }, []);


    return (
        <div className="container mx-auto p-4">
            {step === 1 ? (
                <>
                    <h1 className="text-2xl font-bold mb-4">Flight Results</h1>
                    {offers.length > 0 ? (
                        <ul>
                            {offers.map((offer, index) => (
                                <li key={index}
                                    className={`p-4 mb-4 border rounded cursor-pointer
                                    ${selectedOffer === index ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}>
                                    <h2>Flight {index}</h2>
                                    <p>{offer.flight?.departureTime && offer.flight?.arrivalTime ?
                                        `${Timestamp.toDate(offer.flight.departureTime).toString()} - ${Timestamp.toDate(offer.flight.arrivalTime).toString()}` : ''}
                                    </p>
                                    <p>{offer.price}</p>
                                    <button onClick={() => setSelectedOffer(index)}>Select</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No flights found</p>
                    )}
                    <button onClick={handleNext} disabled={selectedOffer === -1}>
                        Next
                    </button>
                </>
            ) : (
                <div>
                    <h1>Enter User Information</h1>
                    <form onSubmit={handlePurchase}>
                        <div>
                            <label htmlFor="ssn">SSN</label>
                            <input type="text" id="ssn" value={passenger.ssn} onChange={(e) => setPassenger({ ...passenger, ssn: e.target.value })} />
                        </div>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" value={passenger.name} onChange={(e) => setPassenger({ ...passenger, name: e.target.value })} />
                        </div>
                        <div>
                            <label htmlFor="surname">Surname</label>
                            <input type="text" id="surname" value={passenger.surname} onChange={(e) => setPassenger({ ...passenger, surname: e.target.value })} />
                        </div>
                        <div>
                            <label htmlFor="birth_date">Birth Date</label>
                            <input type="date" id="birth_date" value={passenger.birth_date} onChange={(e) => setPassenger({ ...passenger, birth_date: e.target.value })} />
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" value={passenger.email} onChange={(e) => setPassenger({ ...passenger, email: e.target.value })} />
                        </div>

                        <div>
                            <button type="button" onClick={handlePrevious}>Previous</button>
                            <button type="submit" disabled={!isUserInfoComplete}>Purchase</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};