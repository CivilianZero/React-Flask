const getCsrfCookies = () => {
  let cookieArr = document.cookie.split(';');
  let cookieObj = {};
  if (cookieArr.length > 1) {
    cookieArr.forEach(cookie => {
      let cookiePair = cookie.split('=');
      cookieObj[cookiePair[0].trim()] = cookiePair[1].trim();
    });
  }
  return cookieObj;
};

export const fetchRetry = async (url, {
  method = 'GET',
  credentials = 'include',
  body = null,
}, tries = 2) => {
  let cookies = getCsrfCookies();
  const headers = {
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN-ACCESS': cookies['csrf_access_token'],
  };
  let error;
  for (let i = 0; i < tries; i++) {
    const response = await fetch(url, {method, credentials, headers, body});
    if (!response.ok && response.status === 401) {
      error = response;
      await fetch('/auth', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN-REFRESH': cookies['csrf_refresh_token'],
        },
      });
    } else return response;
  }
  return Error(error);
};