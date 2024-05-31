const { model, Schema } = require('mongoose');

let reactorSchema = new Schema ({
    Guild: String,
    Channel: String,
    Emoji: String,
})

module.exports = model('reactorSchema', reactorSchema);