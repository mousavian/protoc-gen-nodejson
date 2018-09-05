const protocPlugin = require('protoc-plugin')
const findCommentByPath = protocPlugin.findCommentByPath

protocPlugin(protos => {
  let out = []

  protos.forEach(proto => {
    let pb_package = proto.pb_package

    proto.messageTypeList.forEach(messageType => {
      out.push(`${pb_package}.${messageType.name}.prototype.toJSON = function (includeInstance, msg) {`)
      out.push('  return {')
      messageType.fieldList.forEach(field => {
        out.push(`    ${field.name}: jspb.Message.getFieldWithDefault(msg, ${field.number}, ""),`)
      })
      out.push('  }')
      out.push(`}`)
    })
  })

  return [{
    name: 'output.js',
    content: out.join('\n')
  }]
})
