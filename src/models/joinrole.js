const mongoose = require('mongoose');

const joinRoleSchema = new mongoose.Schema({
    Guild: String,
    RoleID: String,
});

module.exports = mongoose.model('JoinRole', joinRoleSchema);
