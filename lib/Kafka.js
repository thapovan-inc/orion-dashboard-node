var kafka = require('kafka-node')
var ConsumerGroup = kafka.ConsumerGroup

const options = {
  kafkaHost: process.env.KAFKA_HOST || 'localhost:29092',
  groupId: 'ExampleTestGroup',
  sessionTimeout: 15000,
  protocol: ['roundrobin'],
  fromOffset: 'earliest',
  commitOffsetsOnFirstJoin: true,
  outOfRangeOffset: 'earliest',
  migrateHLC: false,
  migrateRolling: true,
  onRebalance: (isAlreadyMember, callback) => { callback() } // or null
}

var topic = process.env.KAFKA_TOPIC || '';

const consumerGroup = new ConsumerGroup(options, 'requestStatistics')

module.exports = class Kafka {
  startConsumer (callback) {
    consumerGroup.on('message', function (message) {
      callback(message.value)
    })

    consumerGroup.on('error', function (err) {
      callback(err)
    })
  }

  stopConsumer () {
    process.on('SIGINT', function () {
      consumerGroup.close(true, function () {
        process.exit()
      })
    })
  }
}