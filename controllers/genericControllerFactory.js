function genericGetController(model) {
  return (req, res) => {
    model.find(req.query)
      .then((results) => res.json(results))
      .catch((err) => { console.log(err); res.status(500).send(err); });
  };
}

function genericCreateController(model) {
  return (req, res) => {
    model.create(req.body)
      .then(() => res.sendStatus(200))
      .catch((err) => { console.log(err); res.status(500).send(err); });
  };
}

function genericUpdateController(model) {
  return (req, res) => {
    model.findOneAndUpdate(req.body.filter, req.body.update)
      .then(() => res.sendStatus(200))
      .catch((err) => { console.log(err); res.status(500).send(err); });
  };
}

function genericDeleteController(model) {
  return (req, res) => {
    model.findOneAndDelete(req.body)
      .then(() => res.sendStatus(200))
      .catch((err) => { console.log(err); res.status(500).send(err); });
  };
}

module.exports = {
  genericGetController,
  genericCreateController,
  genericUpdateController,
  genericDeleteController,
};
