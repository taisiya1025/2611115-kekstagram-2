import { renderThumbnails } from './thumbnails.js';
import { initFilters } from './filter.js';

const uploadForm = document.querySelector('.img-upload__form');
const fileInput = uploadForm.querySelector('.img-upload__input');
const previewImg = uploadForm.querySelector('.img-upload__preview-img');

let localPhotos = [];

const onFileInputChange = (evt) => {
  const file = evt.target.files[0];
  if (!file || !file.type.startsWith('image/')) {
    return;
  }

  const reader = new FileReader();

  reader.onload = (readerEvent) => {
    previewImg.src = readerEvent.target.result;

    const uploadedPhotoData = {
      id: Date.now(),
      url: readerEvent.target.result,
      description: 'Загруженное фото',
      likes: 0,
      comments: []
    };

    const updatedPhotos = [uploadedPhotoData, ...localPhotos];
    localPhotos = updatedPhotos;

    renderThumbnails(updatedPhotos);
    initFilters(updatedPhotos);
  };

  reader.readAsDataURL(file);
};

export const initUploadPhoto = (defaultPhotos) => {
  localPhotos = [...defaultPhotos];
  fileInput.addEventListener('change', onFileInputChange);
};

export const getCurrentPhotos = () => localPhotos;

export const updateCurrentPhotos = (newPhotos) => {
  localPhotos = [...newPhotos];
};
