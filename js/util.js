const TIMEOUT = 5000;
const errorTemplate = document.querySelector('#data-error').content.querySelector('.data-error');

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

export const showErrorMessage = () => {
  const newErrorElement = errorTemplate.cloneNode(true);
  document.body.appendChild(newErrorElement);
  setTimeout(() => {
    newErrorElement.remove();
  }, TIMEOUT);
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

export const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

export { getRandomInteger, getRandomArrayElement};


