import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/login/register-page';
import ProfilePage from '../pages/login/profile-page';
import ForgotPasswordPage from '../pages/login/forgot-pass-page';
import DetailPage from '../pages/detail/detail-page';
import NotFoundPage from '../pages/not-found/not-found-page';
import SavedPage from '../pages/saved/saved-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/profile': new ProfilePage(),
  '/forgot-password': new ForgotPasswordPage(),
  '/register': new RegisterPage(),
  '/add-story': new AddStoryPage(),
  '/detail/:id': new DetailPage(),
  '/not-found': new NotFoundPage(),
  '/saved': new SavedPage(),
   404: new NotFoundPage(),
};

export default routes;
