export const getCsrfCookies = () => {
  let cookieArr = document.cookie.split(';');
  let cookieObj = {};
  cookieArr.forEach(cookie => {
    let cookiePair = cookie.split('=');
    cookieObj[cookiePair[0].trim()] = cookiePair[1].trim();
  });
  return cookieObj;
};
export const authFetch = (url, options, tries = 2) => {
  const cookies = getCsrfCookies();
  const repeatFetch = () => fetch(url, options);
  return repeatFetch(url, options)
      .then(
          res => {
            if (res.status !== 401) return res;
            else throw Error();
          },
      ).catch(
          () => {
            console.log(tries);
            tries -= 1;
            if (tries >= 0) {
              console.log('in tries');
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
                    if (res.status < 400) return () => repeatFetch(url, options);
                    else throw Error(res['msg']);
                  },
              ).catch(
                  err => {
                    console.log(err);
                  },
              );
            }
          },
      );
};