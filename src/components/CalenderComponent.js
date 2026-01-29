import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function CalenderComponent({
  events = [],
  initialDate = '',
  language = '',
  handleDateClick = () => {},
  handleEventClick = () => {}
}) {
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
    start: 'title', // will normally be on the left. if RTL, will be on the right
    center: '',
    end: 'todayCustomButton prevCustomButton,nextCustomButton' // will normally be on the right. if RTL, will be on the left
  };

  const fullCalendarCustomButtons = {
    prevCustomButton: {
      text: t('Previous'),
      click: () => changeFullCalendarAndSelectDate('prev')
    },
    nextCustomButton: {
      text: t('Next'),
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

  return (
    <FullCalendar
      ref={calendarRef}
      headerToolbar={fullCalendarHeaderToolbar}
      customButtons={fullCalendarCustomButtons}
      plugins={[dayGridPlugin, interactionPlugin]}
      fixedWeekCount={false}
      events={events}
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
