import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  startBtn: document.querySelector('[data-start]'),
  dataInput: document.querySelector('#datetime-picker'),
  dataDays: document.querySelector('[data-days]'),
  dataHours: document.querySelector('[data-hours]'),
  dataMinutes: document.querySelector('[data-minutes]'),
  dataSeconds: document.querySelector('[data-seconds]'),
};

refs.startBtn.disabled = true;

let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate <= new Date()) {
      iziToast.error({
        message: 'Please choose a date in the future',
      });
      refs.startBtn.disabled = true;
      return;
    }
    refs.startBtn.disabled = false;
  },
};
flatpickr(refs.dataInput, options);

refs.startBtn.addEventListener('click', () => {
  refs.startBtn.disabled = true;
  refs.dataInput.disabled = true;
  const intervalId = setInterval(() => {
    const difference = userSelectedDate.getTime() - Date.now();

    if (difference <= 0) {
      clearInterval(intervalId);
      updateTimer({ seconds: 0, minutes: 0, hours: 0, days: 0 });
      refs.dataInput.disabled = false;
      return;
    }
    const time = convertMs(difference);
    updateTimer(time);
  }, 1000);
});
function updateTimer({ seconds, minutes, hours, days }) {
  refs.dataSeconds.textContent = addLeadingZero(seconds);
  refs.dataMinutes.textContent = addLeadingZero(minutes);
  refs.dataHours.textContent = addLeadingZero(hours);
  refs.dataDays.textContent = addLeadingZero(days);
}
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
