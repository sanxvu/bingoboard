import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:4000/events");
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <>
      <div>
        <h1>CityQuest Events</h1>
        <ul>
          {events.map((e: any) => (
            <li key={e.id}>
              {e.title} = {new Date(e.start_time).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
