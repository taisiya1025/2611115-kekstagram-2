import { renderThumbnails } from './thumbnails.js';
import { debounce } from './util.js';

const DEBOUNCE_DELAY = 500;
const RANDOM_PHOTOS_COUNT = 10;

const filtersContainer = document.querySelector('.img-filters');

let localPhotos;
const debouncedApplyFilter = debounce(renderThumbnails, DEBOUNCE_DELAY);

export const initFilters = (pictures) => {
  localPhotos = [...pictures];
  filtersContainer.classList.remove('img-filters--inactive');
};

const applyFilter = {
  ['filter-random']: () => [...localPhotos].sort(() => Math.random() - 0.5).slice(0, RANDOM_PHOTOS_COUNT),
  ['filter-discussed']: () => [...localPhotos].sort((a, b) => b.comments.length - a.comments.length),
  ['filter-default']: () => localPhotos
};

const onFilterClick = (evt) => {
  const clickedButton = evt.target;
  if (!clickedButton.classList.contains('img-filters__button')) {
    return;
  }

  if (clickedButton.classList.contains('img-filters__button--active')) {
    return;
  }

  filtersContainer.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');

  clickedButton.classList.add('img-filters__button--active');
  debouncedApplyFilter(applyFilter[clickedButton.id]());
};

filtersContainer.addEventListener('click', onFilterClick);


