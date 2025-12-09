import { resetScale } from './scale.js';
import { resetEffects } from './effects.js';
import { sendData } from './fetch.js';
import { isValid, resetValidation } from './validation.js';

const form = document.querySelector('.img-upload__form');
const cancelButton = document.querySelector('.img-upload__cancel');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const fileInput = form.querySelector('.img-upload__input');
const overlay = document.querySelector('.img-upload__overlay');
const submitButton = form.querySelector('.img-upload__submit');
const imagePreview = document.querySelector('.img-upload__preview img');
const miniPreviews = document.querySelectorAll('.effects__preview');

const showMessage = (templateId) => {
  const template = document.querySelector(`#${templateId}`).content.querySelector(`.${templateId}`);
  const messageElement = template.cloneNode(true);
  document.body.appendChild(messageElement);

  messageElement.addEventListener('click', ({ target }) => {
    if (target.classList.contains(templateId) || target.classList.contains(`${templateId}__button`)) {
      messageElement.remove();
    }
  });
  document.addEventListener('keydown', onDocumentKeydown);
};

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    const success = document.querySelector('.success');
    const error = document.querySelector('.error');
    if (success) {
      success.remove();
    } else {
      error.remove();
    }
    document.removeEventListener('keydown', onDocumentKeydown);
  }
}

const openForm = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const resetForm = () => {
  form.reset();
  resetValidation();
  resetScale();
  resetEffects();
};

const closeForm = () => {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  resetForm();
};

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Отправляю...';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

const renderPreview = () => {
  const file = fileInput.files[0];
  const fileUrl = URL.createObjectURL(file);
  imagePreview.src = fileUrl;
  miniPreviews.forEach((span) => {
    span.style.backgroundImage = `url(${fileUrl})`;
  });
};

const onFileInputChange = () => {
  openForm();
  renderPreview();
};

const onCloseButtonClick = () => {
  closeForm();
};

function onFormKeydown(evt) {
  if (evt.key === 'Escape') {
    if (document.activeElement !== hashtagInput
      && document.activeElement !== commentInput
      && !document.querySelector('.error')
    ) {
      closeForm();
    }
  }
}

const onFormSubmit = async (evt) => {
  evt.preventDefault();

  if (!isValid()) {
    return;
  }

  const formData = new FormData(form);

  try {
    blockSubmitButton();
    await sendData(formData);
    closeForm();
    showMessage('success');
  } catch (error) {
    showMessage('error');
  } finally {
    unblockSubmitButton();
  }
};

const initFormHandlers = () => {
  fileInput.addEventListener('change', onFileInputChange);
  document.addEventListener('keydown', onFormKeydown);

};

cancelButton.addEventListener('click', onCloseButtonClick);
form.addEventListener('submit', onFormSubmit);

export { initFormHandlers };

