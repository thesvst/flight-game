import styled from 'styled-components';
import { createContext } from 'react';

const accessToken = import.meta.env.KMB_IT_MAPBOX_GL_API_KEY;
let MAP_TOKEN: null | string;

if (!accessToken) {
  MAP_TOKEN = prompt(
    `Hey! I couldn't find MapboxGLJS API key in env variables. \nTo proceed please provide API key :) \n\nTo do so you need to register here \nhttps://www.mapbox.com/ \n\nand then claim your API key :)`,
  );
} else {
  MAP_TOKEN = accessToken;
}

interface AccessTokenProviderProps {
  children: React.ReactElement;
}
export const AccessTokenContext = createContext('');

export const AccessTokenProvider = (props: AccessTokenProviderProps) => {
  return MAP_TOKEN && MAP_TOKEN.length ? (
    <AccessTokenContext.Provider value={MAP_TOKEN}>{props.children}</AccessTokenContext.Provider>
  ) : (
    <TokenError>ERROR WHILE GETTING TOKEN</TokenError>
  );
};

const TokenError = styled('div')`
  width: 100vh;
  height: 100vh;
  justify-content: center;
  align-items: center;
  font-size: 120px;
`;
