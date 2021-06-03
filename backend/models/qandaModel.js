import mongoose from "mongoose";
const qandaSchema = new mongoose.Schema({
    question: {type: String},
    answer: {type: String},

})
const Qanda= mongoose.model('Qanda', qandaSchema);
export default Qanda;