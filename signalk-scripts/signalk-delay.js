
module.exports = function(RED) {
  function signalK(config) {
    RED.nodes.createNode(this,config);
    var node = this;

    node.on('input', msg => {
      const _ = node.context().global.get('lodash')
    
      let firstMessage = node.context().get('firstMessage')
      let lastValue = node.context().get('lastValue')

      if ( lastValue && !_.isEqual(msg.payload, lastValue))
      {
        firstMessage = null
      }
      
      if ( !firstMessage ) {
        node.context().set('firstMessage', Date.now())
        node.context().set('lastValue', msg.payload)
      } else {
        let diff = Date.now() - firstMessage
        if ( diff > config.delay ) {
          node.send(msg)
          node.status({fill:"green",shape:"dot",text:`sent`});
        } else {
          node.status({fill:"green",shape:"dot",text:`${diff/1000}s`});
        }
      }

    })
  }
  RED.nodes.registerType("signalk-delay", signalK);
}
