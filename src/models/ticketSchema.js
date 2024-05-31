const { model, Schema } = require('mongoose');

const ticketSchema = new Schema({
    GuildID: String,
    Category: String,
    Channel: String,
    Role: String,
    Logs: String,
    ClaimedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Annahme: Du hast ein separates User-Modell
    },
    ClaimedAt: Date,
    Title: String,
    Description: String
});

module.exports = model('tickets', ticketSchema);
