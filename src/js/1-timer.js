import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

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
    if (userSelectedDate < new Date()) {
      iziToast.error({
        // title: 'Error',
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

    refs.dataSeconds.textContent = addLeadingZero(
      convertMs(difference).seconds
    );
    refs.dataMinutes.textContent = addLeadingZero(
      convertMs(difference).minutes
    );
    refs.dataHours.textContent = addLeadingZero(convertMs(difference).hours);
    refs.dataDays.textContent = addLeadingZero(convertMs(difference).days);
    if (difference < 1000) {
      clearInterval(intervalId);
      refs.dataInput.disabled = false;
    }
  }, 1000);
});
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
