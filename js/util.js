const TIMEOUT = 5000;
const errorTemplate = document.querySelector('#data-error').content.querySelector('.data-error');

export const showErrorMessage = () => {
  const newErrorElement = errorTemplate.cloneNode(true);
  document.body.appendChild(newErrorElement);
  setTimeout(() => {
    newErrorElement.remove();
  }, TIMEOUT);
};

export const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

