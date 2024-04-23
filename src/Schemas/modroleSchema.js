const { model, Schema } = require('mongoose');

let modroleSchema = new Schema({
    Guild: String,
    Role: String
});

module.exports = model('modroleSchema', modroleSchema);