const express = require("express");
const Job = require("../models/job.model");


const router = express.Router();


  router.post("/", async (req, res) => {
    try {
      const job = await Job.create(req.body);
      return res.status(201).send(job);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });

  router.get("", async (req, res) => {
    try {
      const job = await Job.find().lean().exec();
  
      return res.status(200).send(job);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });

  router.get("/:city", async (req, res) => {
    try {
    //   const comment = await Internship.findById(req.params.id).lean().exec();

      const jobCity = await Job.find(req.params).lean().exec();
    //   db.movie.find({"movie_name" :{$eq : "Me and Orson Welles"}}).pretty()
  
      return res.status(201).send(jobCity);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });

  router.get("/user/:time", async (req, res) => {
    try {

      const jobType = await Job.find(req.params).lean().exec();
    //   db.movie.find({"movie_name" :{$eq : "Me and Orson Welles"}}).pretty()

      return res.status(201).send(jobType);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });

  module.exports = router;