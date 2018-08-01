/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var transaction_pb = require('./transaction_pb.js');
var queries_pb = require('./queries_pb.js');
var qry_responses_pb = require('./qry_responses_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');
goog.exportSymbol('proto.iroha.protocol.ToriiResponse', null, global);
goog.exportSymbol('proto.iroha.protocol.TxList', null, global);
goog.exportSymbol('proto.iroha.protocol.TxStatus', null, global);
goog.exportSymbol('proto.iroha.protocol.TxStatusRequest', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.iroha.protocol.ToriiResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.iroha.protocol.ToriiResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.ToriiResponse.displayName = 'proto.iroha.protocol.ToriiResponse';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.iroha.protocol.ToriiResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.iroha.protocol.ToriiResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.iroha.protocol.ToriiResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.iroha.protocol.ToriiResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    txStatus: jspb.Message.getFieldWithDefault(msg, 1, 0),
    txHash: msg.getTxHash_asB64(),
    errorMessage: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.iroha.protocol.ToriiResponse}
 */
proto.iroha.protocol.ToriiResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.iroha.protocol.ToriiResponse;
  return proto.iroha.protocol.ToriiResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.iroha.protocol.ToriiResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.iroha.protocol.ToriiResponse}
 */
proto.iroha.protocol.ToriiResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.iroha.protocol.TxStatus} */ (reader.readEnum());
      msg.setTxStatus(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setTxHash(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setErrorMessage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.iroha.protocol.ToriiResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.iroha.protocol.ToriiResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.iroha.protocol.ToriiResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.iroha.protocol.ToriiResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTxStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getTxHash_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = message.getErrorMessage();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional TxStatus tx_status = 1;
 * @return {!proto.iroha.protocol.TxStatus}
 */
proto.iroha.protocol.ToriiResponse.prototype.getTxStatus = function() {
  return /** @type {!proto.iroha.protocol.TxStatus} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.iroha.protocol.TxStatus} value */
proto.iroha.protocol.ToriiResponse.prototype.setTxStatus = function(value) {
  jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional bytes tx_hash = 2;
 * @return {!(string|Uint8Array)}
 */
proto.iroha.protocol.ToriiResponse.prototype.getTxHash = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes tx_hash = 2;
 * This is a type-conversion wrapper around `getTxHash()`
 * @return {string}
 */
proto.iroha.protocol.ToriiResponse.prototype.getTxHash_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getTxHash()));
};


/**
 * optional bytes tx_hash = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTxHash()`
 * @return {!Uint8Array}
 */
proto.iroha.protocol.ToriiResponse.prototype.getTxHash_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getTxHash()));
};


/** @param {!(string|Uint8Array)} value */
proto.iroha.protocol.ToriiResponse.prototype.setTxHash = function(value) {
  jspb.Message.setProto3BytesField(this, 2, value);
};


/**
 * optional string error_message = 3;
 * @return {string}
 */
proto.iroha.protocol.ToriiResponse.prototype.getErrorMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.iroha.protocol.ToriiResponse.prototype.setErrorMessage = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.iroha.protocol.TxStatusRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.iroha.protocol.TxStatusRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.TxStatusRequest.displayName = 'proto.iroha.protocol.TxStatusRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.iroha.protocol.TxStatusRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.iroha.protocol.TxStatusRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.iroha.protocol.TxStatusRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.iroha.protocol.TxStatusRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    txHash: msg.getTxHash_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.iroha.protocol.TxStatusRequest}
 */
proto.iroha.protocol.TxStatusRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.iroha.protocol.TxStatusRequest;
  return proto.iroha.protocol.TxStatusRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.iroha.protocol.TxStatusRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.iroha.protocol.TxStatusRequest}
 */
proto.iroha.protocol.TxStatusRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setTxHash(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.iroha.protocol.TxStatusRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.iroha.protocol.TxStatusRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.iroha.protocol.TxStatusRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.iroha.protocol.TxStatusRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTxHash_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes tx_hash = 1;
 * @return {!(string|Uint8Array)}
 */
proto.iroha.protocol.TxStatusRequest.prototype.getTxHash = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes tx_hash = 1;
 * This is a type-conversion wrapper around `getTxHash()`
 * @return {string}
 */
proto.iroha.protocol.TxStatusRequest.prototype.getTxHash_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getTxHash()));
};


/**
 * optional bytes tx_hash = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTxHash()`
 * @return {!Uint8Array}
 */
proto.iroha.protocol.TxStatusRequest.prototype.getTxHash_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getTxHash()));
};


/** @param {!(string|Uint8Array)} value */
proto.iroha.protocol.TxStatusRequest.prototype.setTxHash = function(value) {
  jspb.Message.setProto3BytesField(this, 1, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.iroha.protocol.TxList = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.iroha.protocol.TxList.repeatedFields_, null);
};
goog.inherits(proto.iroha.protocol.TxList, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.TxList.displayName = 'proto.iroha.protocol.TxList';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.iroha.protocol.TxList.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.iroha.protocol.TxList.prototype.toObject = function(opt_includeInstance) {
  return proto.iroha.protocol.TxList.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.iroha.protocol.TxList} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.iroha.protocol.TxList.toObject = function(includeInstance, msg) {
  var f, obj = {
    transactionsList: jspb.Message.toObjectList(msg.getTransactionsList(),
    transaction_pb.Transaction.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.iroha.protocol.TxList}
 */
proto.iroha.protocol.TxList.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.iroha.protocol.TxList;
  return proto.iroha.protocol.TxList.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.iroha.protocol.TxList} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.iroha.protocol.TxList}
 */
proto.iroha.protocol.TxList.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new transaction_pb.Transaction;
      reader.readMessage(value,transaction_pb.Transaction.deserializeBinaryFromReader);
      msg.addTransactions(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.iroha.protocol.TxList.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.iroha.protocol.TxList.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.iroha.protocol.TxList} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.iroha.protocol.TxList.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTransactionsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      transaction_pb.Transaction.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Transaction transactions = 1;
 * @return {!Array.<!proto.iroha.protocol.Transaction>}
 */
proto.iroha.protocol.TxList.prototype.getTransactionsList = function() {
  return /** @type{!Array.<!proto.iroha.protocol.Transaction>} */ (
    jspb.Message.getRepeatedWrapperField(this, transaction_pb.Transaction, 1));
};


/** @param {!Array.<!proto.iroha.protocol.Transaction>} value */
proto.iroha.protocol.TxList.prototype.setTransactionsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.iroha.protocol.Transaction=} opt_value
 * @param {number=} opt_index
 * @return {!proto.iroha.protocol.Transaction}
 */
proto.iroha.protocol.TxList.prototype.addTransactions = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.iroha.protocol.Transaction, opt_index);
};


proto.iroha.protocol.TxList.prototype.clearTransactionsList = function() {
  this.setTransactionsList([]);
};


/**
 * @enum {number}
 */
proto.iroha.protocol.TxStatus = {
  STATELESS_VALIDATION_FAILED: 0,
  STATELESS_VALIDATION_SUCCESS: 1,
  STATEFUL_VALIDATION_FAILED: 2,
  STATEFUL_VALIDATION_SUCCESS: 3,
  COMMITTED: 4,
  MST_EXPIRED: 5,
  NOT_RECEIVED: 6
};

goog.object.extend(exports, proto.iroha.protocol);