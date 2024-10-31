import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Tablero } from './components/Tablero';
import { Configuracion } from './components/Configuracion';
import { Layout } from './components/Layout';

function App() {
  return (
    <Provider store={store}>
      <Layout>
        <Configuracion />
        <Tablero />
      </Layout>
    </Provider>
  );
}

export default App;