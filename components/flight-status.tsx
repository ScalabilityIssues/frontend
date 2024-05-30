import { FlightStatusEvent } from '@/clients/gen/flightmngr/flights';
import { Timestamp } from '@/clients/gen/google/protobuf/timestamp';
import React from 'react';

export default function FlightStatusEventComponent({ props }: { props: FlightStatusEvent }) {
    const renderEvent = () => {
        switch (props.event.oneofKind) {
            case 'flightCancelled':
                return <div>Flight Cancelled: {props.event.flightCancelled.reason}</div>;
            case 'flightDelayed':
                return (
                    <div>
                        <div>Flight Delayed</div>
                        <div>New Departure Time: {props.event.flightDelayed.departureTime ?
                            Timestamp.toDate(props.event.flightDelayed.departureTime).toLocaleString() : "No departure time available"}</div>
                        <div>New Arrival Time: {props.event.flightDelayed.arrivalTime ?
                            Timestamp.toDate(props.event.flightDelayed.arrivalTime).toLocaleString() : "No arrival time available"}</div>
                    </div>
                );
            case 'flightGateDeparture':
                return <div>Flight Gate Departure: Gate {props.event.flightGateDeparture.gate}</div>;
            case 'flightGateArrival':
                return <div>Flight Gate Arrival: Gate {props.event.flightGateArrival.gate}</div>;
            default:
                return <div>Unknown event</div>;
        }
    };

    return (
        <div>
            <div>Event Timestamp: {props.timestamp ?
                Timestamp.toDate(props.timestamp).toTimeString() : ("No timestamp available")}</div>
            {renderEvent()}
        </div>
    );
};

