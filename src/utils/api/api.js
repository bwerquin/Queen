import { KEYCLOAK, ANONYMOUS, JSON_UTF8_HEADER, QUEEN_USER_KEY } from 'utils/constants';
import { refreshToken, kc, keycloakAuthentication } from 'utils/keycloak';
import { getSecureHeader } from './utils';

export const authentication = mode => {
  switch (mode) {
    case KEYCLOAK:
      if (window.localStorage.getItem(QUEEN_USER_KEY) === undefined) {
        return keycloakAuthentication({ onLoad: 'login-required' });
      }
      return refreshToken();
    case ANONYMOUS:
      return new Promise(resolve => resolve());
    default:
      return new Promise((resolve, reject) =>
        reject(new Error(`App doesn't support "${mode}" for authentication`))
      );
  }
};

export const getHeader = mode => {
  switch (mode) {
    case KEYCLOAK:
      if (!navigator.onLine) {
        return {
          Accept: JSON_UTF8_HEADER,
        };
      }
      return {
        ...getSecureHeader(kc.token),
        Accept: JSON_UTF8_HEADER,
      };
    default:
      return {
        Accept: JSON_UTF8_HEADER,
      };
  }
};
