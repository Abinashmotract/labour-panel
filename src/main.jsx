import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './Router';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AuthProvider } from './utils/context/AuthContext';
import { Provider } from 'react-redux';
import store from './store';
import './i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Suspense fallback={<div>Loading translations...</div>}>
            <Provider store={store}>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </Provider>
        </Suspense>
    </React.StrictMode>
);