/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf')
var goog = jspb
var global = Function('return this')()

var transaction_pb = require('./transaction_pb.js')
goog.exportSymbol('proto.iroha.protocol.Proposal', null, global)

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
proto.iroha.protocol.Proposal = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.iroha.protocol.Proposal.repeatedFields_, null)
}
goog.inherits(proto.iroha.protocol.Proposal, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.Proposal.displayName = 'proto.iroha.protocol.Proposal'
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.iroha.protocol.Proposal.repeatedFields_ = [2]

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
  proto.iroha.protocol.Proposal.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.Proposal.toObject(opt_includeInstance, this)
  }

  /**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.iroha.protocol.Proposal} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
  proto.iroha.protocol.Proposal.toObject = function (includeInstance, msg) {
    var f, obj = {
      height: jspb.Message.getFieldWithDefault(msg, 1, 0),
      transactionsList: jspb.Message.toObjectList(msg.getTransactionsList(),
        transaction_pb.Transaction.toObject, includeInstance),
      createdTime: jspb.Message.getFieldWithDefault(msg, 3, 0)
    }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.iroha.protocol.Proposal}
 */
proto.iroha.protocol.Proposal.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.Proposal()
  return proto.iroha.protocol.Proposal.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.iroha.protocol.Proposal} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.iroha.protocol.Proposal}
 */
proto.iroha.protocol.Proposal.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint64())
        msg.setHeight(value)
        break
      case 2:
        var value = new transaction_pb.Transaction()
        reader.readMessage(value, transaction_pb.Transaction.deserializeBinaryFromReader)
        msg.addTransactions(value)
        break
      case 3:
        var value = /** @type {number} */ (reader.readUint64())
        msg.setCreatedTime(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.iroha.protocol.Proposal.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.Proposal.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.iroha.protocol.Proposal} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.iroha.protocol.Proposal.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getHeight()
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    )
  }
  f = message.getTransactionsList()
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      transaction_pb.Transaction.serializeBinaryToWriter
    )
  }
  f = message.getCreatedTime()
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    )
  }
}

/**
 * optional uint64 height = 1;
 * @return {number}
 */
proto.iroha.protocol.Proposal.prototype.getHeight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/** @param {number} value */
proto.iroha.protocol.Proposal.prototype.setHeight = function (value) {
  jspb.Message.setProto3IntField(this, 1, value)
}

/**
 * repeated Transaction transactions = 2;
 * @return {!Array.<!proto.iroha.protocol.Transaction>}
 */
proto.iroha.protocol.Proposal.prototype.getTransactionsList = function () {
  return /** @type{!Array.<!proto.iroha.protocol.Transaction>} */ (
    jspb.Message.getRepeatedWrapperField(this, transaction_pb.Transaction, 2))
}

/** @param {!Array.<!proto.iroha.protocol.Transaction>} value */
proto.iroha.protocol.Proposal.prototype.setTransactionsList = function (value) {
  jspb.Message.setRepeatedWrapperField(this, 2, value)
}

/**
 * @param {!proto.iroha.protocol.Transaction=} opt_value
 * @param {number=} opt_index
 * @return {!proto.iroha.protocol.Transaction}
 */
proto.iroha.protocol.Proposal.prototype.addTransactions = function (opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.iroha.protocol.Transaction, opt_index)
}

proto.iroha.protocol.Proposal.prototype.clearTransactionsList = function () {
  this.setTransactionsList([])
}

/**
 * optional uint64 created_time = 3;
 * @return {number}
 */
proto.iroha.protocol.Proposal.prototype.getCreatedTime = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0))
}

/** @param {number} value */
proto.iroha.protocol.Proposal.prototype.setCreatedTime = function (value) {
  jspb.Message.setProto3IntField(this, 3, value)
}

goog.object.extend(exports, proto.iroha.protocol)