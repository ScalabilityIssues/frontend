import { ChannelCredentials } from "@grpc/grpc-js";
import { GrpcTransport } from "@protobuf-ts/grpc-transport";

const channelCredentials = ChannelCredentials.createInsecure();

export const serverTransport = {
    flightManager: new GrpcTransport({ host: process.env.SVC_FLIGHTMNGR_HOST, channelCredentials }),
    ticketSvc: new GrpcTransport({ host: process.env.SVC_TICKET_HOST, channelCredentials }),
    saleSvc: new GrpcTransport({ host: process.env.SVC_SALE_HOST, channelCredentials }),
    validationSvc: new GrpcTransport({ host: process.env.SVC_VALIDATION_HOST, channelCredentials }),
} as const;
