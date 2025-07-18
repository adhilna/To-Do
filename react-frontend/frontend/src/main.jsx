import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NotificationProvider } from './context/NotificationProvider';

createRoot(document.getElementById('root')).render(
    <NotificationProvider>
      <App />
    </NotificationProvider>
);