import { jsx as _jsx } from "react/jsx-runtime";
import { RouterProvider } from 'react-router';
import { router } from './router';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
export default function App() {
    return (_jsx(AuthProvider, { children: _jsx(NotificationProvider, { children: _jsx(RouterProvider, { router: router }) }) }));
}
