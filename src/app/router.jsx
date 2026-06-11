import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { MoviesPage } from './pages/MoviesPage';
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
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { EmergencyResetPage } from './pages/EmergencyResetPage';
import { ConfirmEmailChangePage } from './pages/ConfirmEmailChangePage';
import { ConfirmDeletePage } from './pages/ConfirmDeletePage';
import { UserProfilePage } from './pages/UserProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ServerErrorPage } from './pages/ServerErrorPage';
import FriendPage from './pages/FriendPage';
import LikedMoviesPage from './pages/LikedMoviesPage';
import { AllActivityPage } from './pages/AllActivityPage';
import { ActivityDetailPage } from './pages/ActivityDetailPage';
import { WatchedPage } from './pages/WatchedPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { BadgesPage } from './pages/BadgesPage';
import { ActorPage } from './pages/ActorPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { DiaryPage } from './pages/DiaryPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        element: _jsx(Layout, {}),
        children: [
            {
                index: true,
                element: _jsx(HomePage, {}),
            },
            // ── PUBLIC ROUTES ──
            {
                path: 'search',
                element: _jsx(SearchPage, {}),
            },
            {
                path: 'movies',
                element: _jsx(MoviesPage, {}),
            },
            {
                path: 'movie/:id',
                element: _jsx(MovieDetailPage, {}),
            },
            {
                path: 'actor/:id',
                element: _jsx(ActorPage, {}),
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
                path: 'reset-password',
                element: _jsx(ResetPasswordPage, {}),
            },
            {
                path: 'verify-email',
                element: _jsx(VerifyEmailPage, {}),
            },
            {
                path: 'emergency-reset',
                element: _jsx(EmergencyResetPage, {}),
            },
            {
                path: 'confirm-email-change',
                element: _jsx(ConfirmEmailChangePage, {}),
            },
            {
                path: 'confirm-delete',
                element: _jsx(ConfirmDeletePage, {}),
            },

            // ── PROTECTED ROUTES ──
            {
                path: 'LikedMoviesPage',
                element: _jsx(ProtectedRoute, { children: _jsx(LikedMoviesPage, {}) }),
            },
            {
                path: 'FriendPage',
                element: _jsx(ProtectedRoute, { children: _jsx(FriendPage, {}) }),
            },
            {
                path: 'my-lists',
                element: _jsx(ProtectedRoute, { children: _jsx(MyListsPage, {}) }),
            },
            {
                path: 'list/:id',
                element: _jsx(ProtectedRoute, { children: _jsx(ListDetailPage, {}) }),
            },
            {
                path: 'the-queue',
                element: _jsx(ProtectedRoute, { children: _jsx(TheQueuePage, {}) }),
            },
            {
                path: 'my-profile',
                element: _jsx(ProtectedRoute, { children: _jsx(UserProfilePage, {}) }),
            },
            {
                path: 'profile',
                element: _jsx(ProtectedRoute, { children: _jsx(ProfilePage, {}) }),
            },
            {
                path: 'user/:id',
                element: _jsx(ProtectedRoute, { children: _jsx(UserProfilePage, {}) }),
            },
            {
                path: 'user/:userId/watched',
                element: _jsx(ProtectedRoute, { children: _jsx(WatchedPage, {}) }),
            },
            {
                path: 'user/:userId/liked',
                element: _jsx(ProtectedRoute, { children: _jsx(LikedMoviesPage, {}) }),
            },
            {
                path: 'analytics',
                element: _jsx(ProtectedRoute, { children: _jsx(AnalyticsPage, {}) }),
            },
            {
                path: 'messages',
                element: _jsx(ProtectedRoute, { children: _jsx(MessagesPage, {}) }),
            },
            {
                path: 'admin',
                element: _jsx(ProtectedRoute, { children: _jsx(AdminPage, {}) }),
            },
            {
                path: 'activity',
                element: _jsx(ProtectedRoute, { children: _jsx(AllActivityPage, {}) }),
            },
            {
                path: 'log/:id',
                element: _jsx(ProtectedRoute, { children: _jsx(ActivityDetailPage, {}) }),
            },
            {
                path: 'watched',
                element: _jsx(ProtectedRoute, { children: _jsx(WatchedPage, {}) }),
            },
            {
                path: 'watchlist',
                element: _jsx(ProtectedRoute, { children: _jsx(WatchlistPage, {}) }),
            },
            {
                path: 'reviews',
                element: _jsx(ProtectedRoute, { children: _jsx(ReviewsPage, {}) }),
            },
            {
                path: 'user/:userId/reviews',
                element: _jsx(ProtectedRoute, { children: _jsx(ReviewsPage, {}) }),
            },
            {
                path: 'badges',
                element: _jsx(ProtectedRoute, { children: _jsx(BadgesPage, {}) }),
            },
            {
                path: 'user/:id/badges',
                element: _jsx(ProtectedRoute, { children: _jsx(BadgesPage, {}) }),
            },
            {
                path: 'user/:userId/watchlist',
                element: _jsx(ProtectedRoute, { children: _jsx(WatchlistPage, {}) }),
            },
            {
                path: 'diary',
                element: _jsx(ProtectedRoute, { children: _jsx(DiaryPage, {}) }),
            },
            {
                path: 'user/:userId/diary',
                element: _jsx(ProtectedRoute, { children: _jsx(DiaryPage, {}) }),
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