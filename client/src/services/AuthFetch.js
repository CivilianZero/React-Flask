export const authFetch = (url, options, tries = 2) => {
  const repeatFetch = () => fetch(url, options);
  return repeatFetch(url, options)
      .then(
          res => {
            if (res.status !== 401) return res;
            else throw Error();
          },
      ).catch(
          () => {
            console.log('first catch');
            console.log(tries);
            tries -= 1;
            if (tries >= 0) {
              console.log('in tries');
              fetch('/refresh', {
                method: 'POST',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-TOKEN-REFRESH': 'csrf_refresh_token',
                },
              }).then(res => res.json()).then(
                  res => {
                    console.log(res);
                    console.log(res.message);
                    if (res.status < 400) return () => repeatFetch(url, options);
                    else throw Error(res.message);
                  },
              ).catch(
                  err => {
                    console.log(err);
                    return err;
                  },
              );
            }
          },
      );
};