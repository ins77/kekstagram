function getMessage(a, b) {

  if (typeof a == "boolean") {

    if (a) {
      return "Переданное GIF-изображение анимировано и содержит " + b + " кадров";

    } else {

      return "Переданное GIF-изображение не анимировано";

    }

  } else if (typeof a == "number") {

    return "Переданное SVG-изображение содержит " + a + " объектов и " + b*4 + " аттрибутов";

  } else if (a instanceof Array && b instanceof Array) {

    var square = 0;
    var arrayLength;

    if (a.length >= b.length) {
      arrayLength = b.length;
    } else {
      arrayLength = a.length;
    }

    for (var i = 0; i < arrayLength; i++) {
      square += a[i] * b[i];
    }

    return "Общая площадь артефактов сжатия: " + square + " пикселей";

  } else if (a instanceof Array) {

    var sum = 0;

    for (var i = 0; i < a.length; i++) {
      sum += a[i];
    }

    return "Количество красных точек во всех строчках изображения: " + sum;

  }

};
