"use client"

import { ValidationClient } from "@/clients/gen/validationsvc/validation.client"
import { webTransport } from "@/clients/transports/web";
import QrScanner from "@/components/qr-scanner"
import { useEffect, useState } from "react"
import * as ed from '@noble/ed25519';
import { SignedTicket } from "@/clients/gen/validationsvc/validation";
import { Html5QrcodeResult } from "html5-qrcode";
import { Ticket } from "@/clients/gen/ticketsrvc/tickets";

/*
API pseudo structure
- On GET show the home page for validating the ticket by the staff
- On button clicking call gRPC method to validate the ticket
@ JonM0
*/
export default function Staff() {
    const clientValidate = new ValidationClient(webTransport);
    const [keys, setKeys] = useState<Uint8Array[]>([])

    useEffect(() => {
        clientValidate.getVerificationKeys({}).then((result) => {
            setKeys(result.response.verificationKeys)
        })
    }, [])


    const handleScan = async (detectedCode: string, result: Html5QrcodeResult) => {
        const data = Buffer.from(detectedCode, 'base64')
        const { signature, ticket: ticketBlob } = SignedTicket.fromBinary(data)

        const isvalid = await ed.verifyAsync(signature, ticketBlob, keys[0])
        const ticket = Ticket.fromBinary(ticketBlob)

        console.log(isvalid, ticket)
    }


    return (
        <div className="container mx-auto">
            <QrScanner successCallback={handleScan} />
        </div>
    )
}