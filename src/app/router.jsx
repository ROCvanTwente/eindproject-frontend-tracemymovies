import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { MyListsPage } from './pages/MyListsPage';
import { ListDetailPage } from './pages/ListDetailPage';
import { TheQueuePage } from './pages/TheQueuePage';
import { ProfilePage } from './pages/ProfilePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { MessagesPage } from './pages/MessagesPage';
import { AdminPage } from './pages/AdminPage';
import { WeeklyFavoritesPage } from './pages/WeeklyFavoritesPage';
import { GlobalMovieDNAPage } from './pages/GlobalMovieDNAPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ServerErrorPage } from './pages/ServerErrorPage';
export const router = createBrowserRouter([
    {
        path: '/',
        element: _jsx(Layout, {}),
        children: [
            {
                index: true,
                element: _jsx(HomePage, {}),
            },
            {
                path: 'search',
                element: _jsx(SearchPage, {}),
            },
            {
                path: 'movies',
                element: _jsx(SearchPage, {}),
            },
            {
                path: 'movie/:id',
                element: _jsx(MovieDetailPage, {}),
            },
            {
                path: 'my-lists',
                element: _jsx(MyListsPage, {}),
            },
            {
                path: 'list/:id',
                element: _jsx(ListDetailPage, {}),
            },
            {
                path: 'the-queue',
                element: _jsx(TheQueuePage, {}),
            },
            {
                path: 'profile',
                element: _jsx(ProfilePage, {}),
            },
            {
                path: 'user/:id',
                element: _jsx(UserProfilePage, {}),
            },
            {
                path: 'analytics',
                element: _jsx(AnalyticsPage, {}),
            },
            {
                path: 'messages',
                element: _jsx(MessagesPage, {}),
            },
            {
                path: 'weekly-favorites',
                element: _jsx(WeeklyFavoritesPage, {}),
            },
            {
                path: 'global-dna',
                element: _jsx(GlobalMovieDNAPage, {}),
            },
            {
                path: 'admin',
                element: _jsx(AdminPage, {}),
            },
            {
                path: 'register',
                element: _jsx(RegisterPage, {}),
            },
            {
                path: 'login',
                element: _jsx(LoginPage, {}),
            },
            {
                path: 'forgot-password',
                element: _jsx(ForgotPasswordPage, {}),
            },
            {
                path: '500',
                element: _jsx(ServerErrorPage, {}),
            },
            {
                path: '*',
                element: _jsx(NotFoundPage, {}),
            },
        ],
    },
]);
