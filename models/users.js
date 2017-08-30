/**
 * Created by havard on 30.08.2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String
});

mongoose.model('users', userSchema);

