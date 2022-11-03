import cookie from 'js-cookie';

export const setACookie = (key, value) => {
  cookie.set(key, value, {
    expires: 1,
    secure: true,
    sameSite: 'Strict',
    path: '/'
  });
};

export const removeACookie = (key) => {
  cookie.remove(key);
};
