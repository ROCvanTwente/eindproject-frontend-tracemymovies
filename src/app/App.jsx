import { jsx as _jsx } from "react/jsx-runtime";
import { RouterProvider } from 'react-router';
import { router } from './router';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { RefreshProvider } from './context/RefreshContext';
export default function App() {
    return (_jsx(AuthProvider, { children: _jsx(NotificationProvider, { children: _jsx(RefreshProvider, { children: _jsx(RouterProvider, { router: router }) }) }) }));
}
