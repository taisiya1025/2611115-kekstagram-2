const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

const clear = () => {
  picturesContainer.querySelectorAll('.picture').forEach((item) => {
    item.remove();
  });
};

const createThumbnail = (photo) => {
  const thumbnail = pictureTemplate.cloneNode(true);

  const image = thumbnail.querySelector('.picture__img');
  image.src = photo.url;
  image.alt = photo.description;
  thumbnail.querySelector('.picture__likes').textContent = photo.likes;
  thumbnail.querySelector('.picture__comments').textContent = photo.comments.length;
  thumbnail.dataset.photoId = photo.id;
  return thumbnail;
};
const renderThumbnails = (photos) => {
  clear();
  const fragment = document.createDocumentFragment();
  photos.forEach((photo) => {
    const thumbnail = createThumbnail(photo);
    fragment.appendChild(thumbnail);
  });
  picturesContainer.appendChild(fragment);
};
export { renderThumbnails };
