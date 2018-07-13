// package: iroha.ordering.proto
// file: ordering.proto

var ordering_pb = require("./ordering_pb");
var block_pb = require("./block_pb");
var proposal_pb = require("./proposal_pb");
var google_protobuf_empty_pb = require("google-protobuf/google/protobuf/empty_pb");
var grpc = require("grpc-web-client").grpc;

var OrderingGateTransportGrpc = (function () {
  function OrderingGateTransportGrpc() {}
  OrderingGateTransportGrpc.serviceName = "iroha.ordering.proto.OrderingGateTransportGrpc";
  return OrderingGateTransportGrpc;
}());

OrderingGateTransportGrpc.onProposal = {
  methodName: "onProposal",
  service: OrderingGateTransportGrpc,
  requestStream: false,
  responseStream: false,
  requestType: proposal_pb.Proposal,
  responseType: google_protobuf_empty_pb.Empty
};

exports.OrderingGateTransportGrpc = OrderingGateTransportGrpc;

function OrderingGateTransportGrpcClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

OrderingGateTransportGrpcClient.prototype.onProposal = function onProposal(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(OrderingGateTransportGrpc.onProposal, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

exports.OrderingGateTransportGrpcClient = OrderingGateTransportGrpcClient;

var OrderingServiceTransportGrpc = (function () {
  function OrderingServiceTransportGrpc() {}
  OrderingServiceTransportGrpc.serviceName = "iroha.ordering.proto.OrderingServiceTransportGrpc";
  return OrderingServiceTransportGrpc;
}());

OrderingServiceTransportGrpc.onTransaction = {
  methodName: "onTransaction",
  service: OrderingServiceTransportGrpc,
  requestStream: false,
  responseStream: false,
  requestType: block_pb.Transaction,
  responseType: google_protobuf_empty_pb.Empty
};

exports.OrderingServiceTransportGrpc = OrderingServiceTransportGrpc;

function OrderingServiceTransportGrpcClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

OrderingServiceTransportGrpcClient.prototype.onTransaction = function onTransaction(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(OrderingServiceTransportGrpc.onTransaction, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

exports.OrderingServiceTransportGrpcClient = OrderingServiceTransportGrpcClient;

