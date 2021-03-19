import User from './../models/userModel';


const userCtrl = async (req, res) {
    try {
        res.send({msg: "Register Test"});
    } catch (err) {
        return res.status(500).send({msg: err.message})
    }
}

export default userCtrl;