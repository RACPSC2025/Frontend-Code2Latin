import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './TaskCalender.css'; // Estilos modernos para el calendario

export default function TaskCalender({
  events = [],
  handleDateClick = () => {},
  handleEventClick = () => {},
  initialDate = '',
  language = ''
}) {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const { t } = useTranslation();
  const calendarRef = useRef(null);

  const changeFullCalendarAndSelectDate = (action) => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    if (action === 'prev') {
      calendarApi.prev();
    } else if (action === 'next') {
      calendarApi.next();
    }
  };

  const fullCalendarHeaderToolbar = {
    start: 'prevCustomButton', // Botón de anterior a la izquierda
    center: 'todayCustomButton', // Botón de hoy en el centro
    end: 'nextCustomButton' // Botón de siguiente a la derecha
  };

  const fullCalendarCustomButtons = {
    prevCustomButton: {
      text: '◀', // Flecha izquierda Unicode
      click: () => changeFullCalendarAndSelectDate('prev')
    },
    nextCustomButton: {
      text: '▶', // Flecha derecha Unicode
      click: () => changeFullCalendarAndSelectDate('next')
    },
    todayCustomButton: {
      text: t('Today'),
      click: () => {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.today();
      }
    }
  };

  useEffect(() => {
    if (language && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.setOption('locale', language);
    }
  }, [language, calendarRef]);


  useEffect(() => {
    console.log('Events:', events); // Verifica el contenido de events
    if (events && events.length > 0) {
      const formatted = events.map((event) => ({
        id: event.id,
        //id: event.id_event,
        title: event.description,
        //title: event.message_es || event.message_en || 'Evento sin título',description
        start: event.date, // formato 'YYYY-MM-DD' ya está bien
        //start: event.date_of_reminder, // formato 'YYYY-MM-DD' ya está bien
        allDay: true,
        extendedProps: {
          ...event // puedes acceder a todo el objeto en eventClick si lo necesitas
        }
      }));
      console.log('Formatted Events:', formatted); // Verifica el formato de los eventos
      setCalendarEvents(formatted);
    }
    else {
      console.log('No events found or events is not an array.'); // Mensaje de depuración
    }
  }, [events]);

  return (
    <FullCalendar
      ref={calendarRef}
      headerToolbar={fullCalendarHeaderToolbar}
      customButtons={fullCalendarCustomButtons}
      plugins={[dayGridPlugin, interactionPlugin]}
      fixedWeekCount={false}
      events={calendarEvents}
      dateClick={handleDateClick}
      eventClick={handleEventClick}
      initialDate={initialDate}
      selectable={true}
      dayMaxEventRows={true}
      views={{ dayGridMonth: { dayMaxEventRows: 3 } }}
      initialView="dayGridMonth"
      moreLinkClassNames="message-center-fc-more-link"
    />
  );
}