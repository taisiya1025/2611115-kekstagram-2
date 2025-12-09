import { renderThumbnails } from './thumbnails.js';
import { debounce } from './util.js';
import { getCurrentPhotos, updateCurrentPhotos} from './photo.js';
const DEBOUNCE_DELAY = 500;
const RANDOM_PHOTOS_COUNT = 10;

const filtersContainer = document.querySelector('.img-filters');

const debouncedApplyFilter = debounce(renderThumbnails, DEBOUNCE_DELAY);

export const initFilters = (pictures) => {
  updateCurrentPhotos([...pictures]);
  filtersContainer.classList.remove('img-filters--inactive');
};

const applyFilter = {
  ['filter-random']: () => [...getCurrentPhotos()].sort(() => Math.random() - 0.5).slice(0, RANDOM_PHOTOS_COUNT),
  ['filter-discussed']: () => [...getCurrentPhotos()].sort((a, b) => b.comments.length - a.comments.length),
  ['filter-default']: () => getCurrentPhotos()
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


