const COMMENTS_PER_PORTION = 5;

const body = document.body;
const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const socialCaption = bigPicture.querySelector('.social__caption');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCommentCount = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const cancelButton = bigPicture.querySelector('.big-picture__cancel');
const picturesContainer = document.querySelector('.pictures');
const commentTemplate = document.querySelector('#comment-template').content.querySelector('.social__comment');
const socialCommentShownCount = bigPicture.querySelector('.social__comment-shown-count');
const socialCommentTotalCount = bigPicture.querySelector('.social__comment-total-count');

let currentComments = [];
let commentsShown = 0;

const createComment = (comment) => {
  const commentElement = commentTemplate.cloneNode(true);
  const commentImage = commentElement.querySelector('.social__picture');
  const commentText = commentElement.querySelector('.social__text');
  commentImage.src = comment.avatar;
  commentImage.alt = comment.name;
  commentText.textContent = comment.message;
  return commentElement;
};

const renderComments = () => {
  socialComments.innerHTML = '';
  const fragment = document.createDocumentFragment();
  const commentsToShow = currentComments.slice(0, commentsShown);
  commentsToShow.forEach((comment) => {
    const commentElement = createComment(comment);
    fragment.appendChild(commentElement);
  });
  socialComments.appendChild(fragment);

  socialCommentShownCount.textContent = commentsShown;
  socialCommentTotalCount.textContent = currentComments.length;
  if (commentsShown >= currentComments.length || currentComments.length <= COMMENTS_PER_PORTION) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
  socialCommentCount.classList.remove('hidden');
};

const onCommentsLoaderClick = () => {
  commentsShown += COMMENTS_PER_PORTION;

  if (commentsShown > currentComments.length) {
    commentsShown = currentComments.length;
  }

  renderComments();
};

const openBigPicture = (pictureData) => {
  bigPictureImg.src = pictureData.url;
  bigPictureImg.alt = pictureData.description;
  likesCount.textContent = pictureData.likes;
  socialCaption.textContent = pictureData.description;

  currentComments = pictureData.comments;
  commentsShown = Math.min(COMMENTS_PER_PORTION, currentComments.length);
  renderComments();
  socialCommentCount.classList.remove('hidden');
  if (currentComments.length <= COMMENTS_PER_PORTION) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
  cancelButton.addEventListener('click', onCancelButtonClick);
  bigPicture.addEventListener('click', onOverlayClick);
  commentsLoader.addEventListener('click', onCommentsLoaderClick);
};

const onPictureClick = (evt, picturesData) => {
  const pictureElement = evt.target.closest('.picture');
  if (pictureElement) {
    evt.preventDefault();
    const pictureId = parseInt(pictureElement.dataset.photoId, 10);
    const pictureData = picturesData.find((item) => item.id === pictureId);
    if (pictureData) {
      openBigPicture(pictureData);
    }
  }
};

const initPictureHandlers = (picturesData) => {
  picturesContainer.addEventListener('click', (evt) => {
    onPictureClick(evt, picturesData);
  });
};

const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  cancelButton.removeEventListener('click', onCancelButtonClick);
  bigPicture.removeEventListener('click', onOverlayClick);
  commentsLoader.removeEventListener('click', onCommentsLoaderClick);

  currentComments = [];
  commentsShown = 0;
};

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeBigPicture();
  }
}

function onOverlayClick(evt) {
  if (evt.target === bigPicture) {
    closeBigPicture();
  }
}

function onCancelButtonClick() {
  closeBigPicture();
}

export { openBigPicture, initPictureHandlers };
