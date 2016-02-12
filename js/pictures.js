'use strict';

(function() {

  var container = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');
  var loadedPictures = [];

  filters.classList.add('hidden');

  getPictures();

  function renderPictures(pictures) {
    container.innerHTML = '';

    var newPictureFragment = document.createDocumentFragment();

    pictures.forEach(function(picture) {
      var element = getPicturesFromTemplate(picture);
      newPictureFragment.appendChild(element);
    });

    container.appendChild(newPictureFragment);
  }

  function getPictures() {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    xhr.open('GET', '//o0.github.io/assets/json/pictures.json');

    xhr.onloadstart = function() {
      container.classList.add('pictures-loading');
    };

    xhr.onerror = function() {
      container.classList.add('pictures-failure');
    };

    xhr.ontimeout = function() {
      container.classList.add('pictures-failure');
    };

    xhr.onload = function(evt) {
      var rawData = evt.target.response;
      loadedPictures = JSON.parse(rawData);

      container.classList.remove('pictures-loading');

      renderPictures(loadedPictures);
    };

    xhr.send();
  }

  filters.classList.remove('hidden');

  function setActiveFilter(id) {
    if (activeFilter === id) {
      return;
    }

    var filteredPictures = loadedPictures.slice(0);

    switch (id) {
      case 'filter-popular':
        break;
      case 'filter-new':
        var twoWeeksAgo = new Date() - 21 * 24 * 60 * 60 * 1000;
        filteredPictures = filteredPictures.filter(
          function(element) {
            return ((Date.parse(element.date) >= twoWeeksAgo) && (Date.parse(element.date) <= new Date()));
          }
        ).sort(function(a, b) {
          return Date.parse(b.date) - Date.parse(a.date);
        });
        break;
      case 'filter-discussed':
        filteredPictures = filteredPictures.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;
    }

    renderPictures(filteredPictures);

    activeFilter = id;
  }

  var filter = filters.filter;
  var activeFilter = 'filter-popular';

  for (var i = 0; i < filter.length; i++) {
    filter[i].onclick = function(evt) {
      var clickedElementID = evt.target.id;
      setActiveFilter(clickedElementID);
    };
  }

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
