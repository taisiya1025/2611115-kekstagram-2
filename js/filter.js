
const BASE_URL = 'https://31.javascript.htmlacademy.pro/kekstagram';

const Route = {
  GET_DATA: '/data',
  SEND_DATA: '/',
};

const Method = {
  GET: 'GET',
  POST: 'POST',
};

const ErrorText = {
  [Method.GET]: 'Не удалось загрузить данные. Попробуйте обновить страницу',
  [Method.POST]: 'Не удалось отправить форму. Попробуйте ещё раз',
};

const load = async (route, method = Method.GET, body = null) => {
  const response = await fetch(`${BASE_URL}${route}`, {
    method,
    body,
  });

  if (!response.ok) {
    throw new Error(ErrorText[method]);
  }

  return response.json();
};

const getData = async () => load(Route.GET_DATA);

const sendData = async (body) => load(Route.SEND_DATA, Method.POST, body);

let photosData = [];

const renderPhotos = (photos) => {
  const picturesContainer = document.querySelector('.pictures');
  const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

  const existingPictures = picturesContainer.querySelectorAll('.picture');
  existingPictures.forEach((picture) => picture.remove());

  const picturesFragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const pictureElement = pictureTemplate.cloneNode(true);

    const img = pictureElement.querySelector('.picture__img');
    img.src = photo.url;
    img.alt = photo.description;

    const likes = pictureElement.querySelector('.picture__likes');
    likes.textContent = photo.likes;

    const comments = pictureElement.querySelector('.picture__comments');
    comments.textContent = photo.comments.length;

    pictureElement.dataset.photoId = photo.id;

    picturesFragment.appendChild(pictureElement);
  });

  picturesContainer.appendChild(picturesFragment);
};

const initBigPictureHandlers = (photos) => {
  const picturesContainer = document.querySelector('.pictures');
  const bigPicture = document.querySelector('.big-picture');
  const closeButton = bigPicture.querySelector('.big-picture__cancel');
  const socialComments = bigPicture.querySelector('.social__comments');
  const commentsCount = bigPicture.querySelector('.social__comment-count');
  const commentsLoader = bigPicture.querySelector('.comments-loader');

  let currentPhoto = null;
  let shownComments = 0;
  const COMMENTS_PER_LOAD = 5;

  const createCommentElement = (comment) => {
    const commentTemplate = document.querySelector('#social-comment').content.querySelector('.social__comment');
    const commentElement = commentTemplate.cloneNode(true);

    const avatar = commentElement.querySelector('.social__picture');
    avatar.src = comment.avatar;
    avatar.alt = comment.name;

    const text = commentElement.querySelector('.social__text');
    text.textContent = comment.message;

    return commentElement;
  };


  const loadMoreComments = () => {
    const commentsToShow = currentPhoto.comments.slice(shownComments, shownComments + COMMENTS_PER_LOAD);
    commentsToShow.forEach((comment) => {
      socialComments.appendChild(createCommentElement(comment));
    });
    shownComments += commentsToShow.length;

    commentsCount.innerHTML = `${shownComments} из <span class="comments-count">${currentPhoto.comments.length}</span> комментариев`;

    if (shownComments >= currentPhoto.comments.length) {
      commentsLoader.classList.add('hidden');
    } else {
      commentsLoader.classList.remove('hidden');
    }
  };

  const openBigPicture = (photo) => {
    currentPhoto = photo;
    shownComments = 0;

    bigPicture.querySelector('.big-picture__img img').src = photo.url;
    bigPicture.querySelector('.big-picture__img img').alt = photo.description;
    bigPicture.querySelector('.likes-count').textContent = photo.likes;
    bigPicture.querySelector('.social__caption').textContent = photo.description;
    bigPicture.querySelector('.comments-count').textContent = photo.comments.length;
    bigPicture.classList.remove('hidden');
    document.body.classList.add('modal-open');
  };

  const onPictureClick = (evt) => {
    const pictureElement = evt.target.closest('.picture');
    if (pictureElement) {
      const photoId = parseInt(pictureElement.dataset.photoId, 10);
      const photo = photos.find((p) => p.id === photoId);
      if (photo) {
        openBigPicture(photo);
      }
    }
  };

  const closeBigPicture = () => {
    bigPicture.classList.add('hidden');
    document.body.classList.remove('modal-open');
    currentPhoto = null;
  };

  const onEscKeydown = (evt) => {
    if (evt.key === 'Escape' && !bigPicture.classList.contains('hidden')) {
      closeBigPicture();
    }
  };

  const onCommentsLoaderClick = () => {
    loadMoreComments();
  };

  const onOverlayClick = (evt) => {
    if (evt.target === bigPicture) {
      closeBigPicture();
    }
  };

  picturesContainer.addEventListener('click', onPictureClick);
  closeButton.addEventListener('click', closeBigPicture);
  commentsLoader.addEventListener('click', onCommentsLoaderClick);
  document.addEventListener('keydown', onEscKeydown);
  bigPicture.addEventListener('click', onOverlayClick);
};

const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

const initFilters = () => {
  const filtersContainer = document.querySelector('.img-filters');
  const filterButtons = filtersContainer.querySelectorAll('.img-filters__button');
  filtersContainer.classList.remove('img-filters--inactive');

  const filterDefault = () => [...photosData];

  const filterRandom = () => {
    const shuffled = [...photosData].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  };

  const filterDiscussed = () => [...photosData].sort((a, b) => b.comments.length - a.comments.length);

  const applyFilter = (filterType) => {
    let filteredPhotos;
    switch (filterType) {
      case 'filter-random':
        filteredPhotos = filterRandom();
        break;
      case 'filter-discussed':
        filteredPhotos = filterDiscussed();
        break;
      default:
        filteredPhotos = filterDefault();
    } renderPhotos(filteredPhotos);
    initBigPictureHandlers(filteredPhotos);
  };

  const debouncedApplyFilter = debounce(applyFilter, 500);

  const onFilterClick = (evt) => {
    if (!evt.target.classList.contains('img-filters__button')) {
      return;
    }

    const clickedButton = evt.target;
    if (clickedButton.classList.contains('img-filters__button--active')) {
      return;
    }

    filterButtons.forEach((button) => {
      button.classList.remove('img-filters__button--active');
    });

    clickedButton.classList.add('img-filters__button--active');
    debouncedApplyFilter(clickedButton.id);
  };

  filtersContainer.addEventListener('click', onFilterClick);
};

const initPhotosModule = async () => {
  try {
    photosData = await getData();
    renderPhotos(photosData);
    initBigPictureHandlers(photosData);
    initFilters();
  } catch (error) {
    const errorTemplate = document.querySelector('#data-error').content.querySelector('.data-error');
    const errorElement = errorTemplate.cloneNode(true);
    document.body.appendChild(errorElement);

    setTimeout(() => {
      errorElement.remove();
    }, 5000);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initPhotosModule();
});

export { getData, sendData, initPhotosModule };
