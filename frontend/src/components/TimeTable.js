import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { toast } from "react-toastify";
import { StatusCodes } from "http-status-codes";

const Timetable = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const fetchCalledRef = useRef(false);

  useEffect(() => {
    if (!fetchCalledRef.current) {
      fetchCalledRef.current = true;
      fetchTimetable();
    }
  }, []);

  const fetchTimetable = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/timetable/");

      switch (response.status) {
        case StatusCodes.OK:
          const data = await response.json();

          const formattedEvents = data.schedule.flatMap((day) =>
            day.courses.map((course) => ({
              title: course.name + (course.rendu ? " 📌" : ""),
              start: parseDateTime(day.date, course.start_time),
              end: parseDateTime(day.date, course.end_time),
              backgroundColor: course.color,
              borderColor: course.color,
            }))
          );

          if (!dataLoaded && formattedEvents.length === 0) {
            toast.warning("Merci de charger un emploi du temps");
          }

          setEvents(formattedEvents);
          setDataLoaded(true);
          break;

        case StatusCodes.NOT_FOUND:
          if (!dataLoaded) toast.warning("Aucun emploi du temps trouvé");
          break;

        default:
          if (!dataLoaded) toast.error("Une erreur est survenue");
          break;
      }
    } catch (error) {
      console.error("❌ Erreur réseau :", error);
      if (!dataLoaded) toast.error("Erreur réseau lors de la récupération de l'emploi du temps");
    } finally {
      setLoading(false);
    }
  };

  const parseDateTime = (date, time) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}T${time}:00`;
  };

  return (
    <div className="edt-class">
      {loading ? (
        <p>Chargement de l'emploi du temps...</p>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          events={events}
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="18:30:00"
          locale="fr"
          firstDay={1}
          weekends={false}
        />
      )}
    </div>
  );
};

export default Timetable;
