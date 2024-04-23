const { model, Schema } = require('mongoose');

let blockcmdSchema = new Schema({
    Guild: String,
    Command: String
});

module.exports = model('blockcmdSchema', blockcmdSchema);