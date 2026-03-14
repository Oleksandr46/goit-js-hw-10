import iziToast from 'izitoast';

const refs = {
  form: document.querySelector('.form'),
};
refs.form.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const delay = Number(formData.get('delay'));
  const state = formData.get('state');

  function createPromise(delay, state) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (state === 'fulfilled') {
          resolve(delay);
        } else {
          reject(delay);
        }
      }, delay);
    });
  }
  createPromise(delay, state)
    .then(delay => {
      iziToast.success({
        position: 'topRight',
        message: `✅ Fulfilled promise in ${delay}ms`,
      });
    })
    .catch(delay => {
      iziToast.error({
        position: 'topRight',
        message: `❌ Rejected promise in ${delay}ms`,
      });
    });
});
