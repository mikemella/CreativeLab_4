import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // setup state
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [problem, setProblem] = useState("");
  const [type, setType] = useState("");

  const fetchTickets = async () => {
    try {
      const response = await axios.get("/api/tickets");
      setTickets(response.data.tickets);
    }
    catch (error) {
      setError("error retrieving words: " + error);
    }
  }
  const createTicket = async () => {
    try {
      await axios.post("/api/tickets", { name: name, problem: problem, type: type });
    }
    catch (error) {
      setError("error adding a word: " + error);
    }
  }
  const deleteOneTicket = async (ticket) => {
    try {
      await axios.delete("/api/tickets/" + ticket.id);
    }
    catch (error) {
      setError("error deleting a word" + error);
    }
  }
  const deleteAllTickets = async() =>{
    try {
      
      for(let i = 0; i < tickets.length; i++){
        console.log(tickets.at(i).id);
        const ticket = tickets.at(i);
        await deleteOneTicket(ticket);
      }
     
    }
    catch (error) {
      setError("error deleting all" + error);
    }
  }

  // fetch ticket data
  useEffect(() => {
    fetchTickets();
  }, []);

  const addTicket = async (e) => {
    e.preventDefault();
    await createTicket();
    fetchTickets();
    setName("");
    setProblem("");
    setType("");
  }

  const deleteTicket = async (ticket) => {
    await deleteOneTicket(ticket);
    fetchTickets();
  }
  const sendToSanta = async (ticket) => {
    await deleteAllTickets();
    fetchTickets();
  }
  

  // render results
  return (
    <div className="App">
      <h1>Build Your Christmas Wishlist</h1>
      {error}
      <form onSubmit={addTicket}>
        <div>
          <label>
            Item:&nbsp;
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
          Description:&nbsp;
            <textarea  value={problem} onChange={e=>setProblem(e.target.value)}></textarea>
          </label>
        </div>
        <input  className = "finish" type="submit" value="Add to list" />
      </form>
      
      <h2>Wishlist</h2>
      
      <div class="flex-container">
        {tickets.map( ticket => (
          <div key={ticket.id} className="ticket">
            <div className="problem">
              <p><strong>{ticket.name}</strong></p>
              <p>{ticket.problem}</p>
            </div>
            <button onClick={e => deleteTicket(ticket)}>Remove this item</button>
          </div>
        ))}
      </div>
      <button className = "finish" onClick={e => sendToSanta()}>Send list to Santa</button>
      <div id="space"></div>
    </div>
  );
}

export default App;
