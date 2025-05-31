import React from 'react';
import NetworkLoggerLib from 'react-native-network-logger';

export const NetworkLogger = () => {
  return (
    <NetworkLoggerLib
      theme={{
        colors: {
          link: '#2261F6',
          card: '#20242B',
          text: '#fff',
          statusGood: '#52C41A',
          statusWarning: '#FAAD14',
          statusBad: '#FF4D4F',
          secondary: '#2c7489',
          onSecondary: '#fff',
          muted: '#969696',
          background: '#12161E'
        }
      }}
    />
  );
};
