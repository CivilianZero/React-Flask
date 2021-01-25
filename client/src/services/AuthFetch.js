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
let cookies = getCsrfCookies();

export const authFetch = (url, {
  method = 'GET',
  credentials = 'include',
  headers = {
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN-REFRESH': cookies['csrf_refresh_token'],
    'X-CSRF-TOKEN-ACCESS': cookies['csrf_access_token'],
  },
}, tries = 2) => {
  const repeatFetch = () => fetch(url, {
    method: method,
    credentials: credentials,
    headers: headers,
  });
  return repeatFetch()
      .then(
          res => {
            if (res.status !== 401) return res;
            else throw Error();
          },
      ).catch(
          () => {
            tries -= 1;
            if (tries >= 0) {
              fetch('/refresh', {
                method: 'POST',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-TOKEN-REFRESH': cookies['csrf_refresh_token'],
                  'X-CSRF-TOKEN-ACCESS': cookies['csrf_access_token'],
                },
              }).then(res => res.json()).then(
                  res => {
                    cookies = getCsrfCookies();
                    if (res.status < 400) return () => repeatFetch();
                    else throw Error(res['msg']);
                  },
              ).catch(
                  err => console.log(err),
              );
            }
          },
      );
};