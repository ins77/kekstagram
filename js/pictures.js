'use strict';

/* global pictures : true */
(function() {

  var container = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');

  filters.classList.add('hidden');

  pictures.forEach(function(picture) {
    var elem = getPicturesFromTemplate(picture);
    container.appendChild(elem);
  });

  filters.classList.remove('hidden');

  function getPicturesFromTemplate(data) {
    var template = document.querySelector('#picture-template');
    var templateContent = 'content' in template ? template.content : template;
    var pictureElement = templateContent.querySelector('.picture').cloneNode(true);

    pictureElement.querySelector('.picture-likes').textContent = data.likes;
    pictureElement.querySelector('.picture-comments').textContent = data.comments;

    var image = new Image('182', '182');
    var replaceImg = pictureElement.querySelector('img');
    var imageLoadTimeout;
    var IMAGE_TIMEOUT = 10000;

    image.onload = function() {
      clearTimeout(imageLoadTimeout);
      pictureElement.replaceChild(image, replaceImg);
    };

    image.onerror = function() {
      pictureElement.classList.add('picture-load-failure');
    };

    image.src = data.url;

    imageLoadTimeout = setTimeout(function() {
      image.src = '';
      pictureElement.classList.add('picture-load-failure');
    }, IMAGE_TIMEOUT);

    return pictureElement;
  }

})();
