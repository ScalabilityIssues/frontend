import { ChannelCredentials } from "@grpc/grpc-js";
import { GrpcTransport } from "@protobuf-ts/grpc-transport";

const url = '127.0.0.1:50051';
export const serverTransport = new GrpcTransport({ host: url, channelCredentials: ChannelCredentials.createInsecure() });