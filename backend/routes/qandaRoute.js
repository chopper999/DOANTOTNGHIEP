import express from 'express';
import Qanda from './../models/qandaModel';
import { isAuth, isAdmin } from '../util.js';
import expressAsyncHandler from 'express-async-handler';

const qandaRoute = express.Router();
qandaRoute.get("/",expressAsyncHandler(async (req, res)=> {
    const qandas = await Qanda.find({});
    res.send({qandas});

}));

// create Q and A
qandaRoute.post("/", isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const qanda = new Qanda({
        question: 'question',
        answer: 'answer',
    });
    const createdQanda = await qanda.save();
    res.send({message: 'Q and A Created', qanda: createdQanda});
})
);

//get detail Q and A
qandaRoute.get("/:id", expressAsyncHandler(async (req, res) => {
    const qanda = await Qanda.findById(req.params.id);
    if (qanda){
        res.send(qanda);
    } else{
        res.status(404).send({message: "Q and A not found"});
    }
}))

// update Q and A
qandaRoute.put("/:id", isAuth, isAdmin, expressAsyncHandler(async (req, res) =>{
    const qandaId = req.params.id;
    const qanda = await Qanda.findById(qandaId);
    if (qanda){
        qanda.question = req.body.question;
        qanda.answer = req.body.answer;
        const updatedQanda = await qanda.save();
        if (updatedQanda){
            return res.send({message: 'Q and A Updated', qanda:updatedQanda});
        }
    }
    else{
        res.status(404).send({message: 'Q and A not found'});
    }
}));

//delete Q and A
qandaRoute.delete("/:id", isAuth, isAdmin, expressAsyncHandler(async (req, res)=>{
    const qanda = await Qanda.findById(req.params.id);
    if(qanda){
        const deleteQanda = await qanda.remove();
        res.send({message: 'Q and A Deleted', qanda: deleteQanda});
    }
    else{
        res.status(404).send({message:'Q and A not found'});
    }
}));

qandaRoute.get(
    "/seed",
    expressAsyncHandler(async (req, res) => {
      const createdQands = await Product.insertMany(qandas);
      res.send({ createdQands });
    })
  );

qandaRoute.post("/newQuestion",expressAsyncHandler(async (req, res)=>{
    const qanda = new Qanda({
        question: req.body.question,
        answer: '',
    });
    const createdQanda = await qanda.save();
    res.send({message: 'New Question Created', qanda: createdQanda});
}))
export default qandaRoute;
