'use strict';

(function() {

  var IMAGE_TIMEOUT = 10000;
  var container = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');
  var template = document.querySelector('#picture-template');
  var filter = filters.filter;
  var activeFilter = filter.value;
  var loadedPictures = [];
  var filteredPictures = [];
  var currentPage = 0;
  var PAGE_SIZE = 12;
  var picturesCoordinates = container.getBoundingClientRect();
  var viewportSize = window.innerHeight;
  var scrollTimeout;

  filters.classList.add('hidden');

  getPictures();

  function renderPictures(picturesToRender, pageNumber, replace) {
    if (replace) {
      container.innerHTML = '';
    }

    var fragment = document.createDocumentFragment();
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pagePictures = picturesToRender.slice(from, to);

    pagePictures.forEach(function(picture) {
      var element = getPicturesFromTemplate(picture);
      fragment.appendChild(element);
    });

    container.appendChild(fragment);
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
      filters.classList.remove('hidden');

      renderPictures(loadedPictures, 0);

      if (picturesCoordinates.bottom <= viewportSize) {
        renderPictures(loadedPictures, ++currentPage);
      }
    };

    xhr.send();
  }

  function setActiveFilter(value) {
    if (activeFilter === value) {
      return;
    }

    filteredPictures = loadedPictures.slice(0);

    switch (value) {
      case 'new':
        var twoWeeksAgo = new Date() - 21 * 24 * 60 * 60 * 1000;
        filteredPictures = filteredPictures.filter(
          function(element) {
            return ((Date.parse(element.date) >= twoWeeksAgo) && (Date.parse(element.date) <= new Date()));
          }
        ).sort(function(a, b) {
          return Date.parse(b.date) - Date.parse(a.date);
        });
        break;
      case 'discussed':
        filteredPictures = filteredPictures.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;
    }

    currentPage = 0;

    renderPictures(filteredPictures, 0, true);

    if (picturesCoordinates.bottom <= viewportSize) {
      renderPictures(filteredPictures, ++currentPage);
    }

    activeFilter = value;
  }

  for (var i = 0; i < filter.length; i++) {
    filter[i].onclick = function(evt) {
      var clickedElementValue = evt.target.value;
      setActiveFilter(clickedElementValue);
    };
  }

  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      if (picturesCoordinates.bottom <= viewportSize) {
        if (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)) {
          renderPictures(filteredPictures, ++currentPage);
        }
      }
    }, 100);
  });

  function getPicturesFromTemplate(data) {
    var templateContent = 'content' in template ? template.content : template;
    var pictureElement = templateContent.querySelector('.picture').cloneNode(true);

    pictureElement.querySelector('.picture-likes').textContent = data.likes;
    pictureElement.querySelector('.picture-comments').textContent = data.comments;

    var image = new Image('182', '182');
    var replaceImg = pictureElement.querySelector('img');
    var imageLoadTimeout;

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
