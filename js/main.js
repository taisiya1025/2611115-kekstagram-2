import { initPictureHandlers } from './big-picture.js';
import { renderThumbnails } from './thumbnails.js';
import { getData } from './fetch.js';
import { showErrorMessage } from './util.js';
import { initFormHandlers } from './form.js';
import { initFilters } from './filter.js';

getData((photos) => {
  initFilters(photos);
});

const loadPhotos = async () => {
  try {
    const photos = await getData();
    renderThumbnails(photos);
    initPictureHandlers(photos);
    initFilters(photos);
  } catch (error) {
    showErrorMessage();
  }
};

loadPhotos();
initFormHandlers();


