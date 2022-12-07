const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

// connect to the database
mongoose.connect('mongodb://localhost:27017/test', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const ticketSchema = new mongoose.Schema({
  name: String,
  problem: String,
  type: String
});

ticketSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });
  
ticketSchema.set('toJSON', {
  virtuals: true
});

const Ticket = mongoose.model('Ticket', ticketSchema);

app.get('/api/tickets', async (req, res) => {
  try {
    let tickets = await Ticket.find();
    res.send({
      tickets: tickets
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/tickets', async (req, res) => {
  const ticket = new Ticket({
    name: req.body.name,
    problem: req.body.problem,
    type: req.body.type
  });
  try {
    await ticket.save();
    res.send({
      ticket: ticket
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/tickets/:id', async (req, res) => {
  try {
    await Ticket.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));