/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  let xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  let url = options.url;
  let formData = new FormData();

  if (options.data) {
    if (options.method === 'GET') {
      url += `?${Object.entries(options.data)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join('&')}`;
    } else {
      Object.entries(options.data).forEach((keyValue) =>
        formData.append(...keyValue)
      );
    }
  }

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      let err = null;
      let response = null;

      if (xhr.status === 200) {
        if (xhr.response && xhr.response.success) {
          response = xhr.response;
        } else {
          err = xhr.response;
        }
      } else {
        err = new Error('Что-то пошло не так');
      }

      options.callback(err, response);
    }
  };

  xhr.open(options.method, url);
  xhr.send(formData);
};
