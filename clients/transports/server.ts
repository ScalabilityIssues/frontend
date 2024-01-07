import { ChannelCredentials } from "@grpc/grpc-js";
import { GrpcTransport } from "@protobuf-ts/grpc-transport";

const channelCredentials = ChannelCredentials.createInsecure();

export const serverTransport = {
    flightManager: new GrpcTransport({ host: process.env.SVC_FLIGHTMNGR_HOST, channelCredentials })
} as const;
