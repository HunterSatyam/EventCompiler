import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import DescriptionPage from './components/DescriptionPage'
import Profile from './components/Profile'
import NotificationPage from './components/NotificationPage'
import CreatePost from './components/admin/CreatePost'
import PostJob from './components/admin/PostJob'
import AdminJobs from './components/admin/AdminJobs'
import Companies from './components/admin/Companies'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from './redux/authSlice'
import { USER_API_END_POINT } from './utils/constant'
import axios from 'axios'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/events',
    element: <Jobs />
  },
  {
    path: '/browse',
    element: <Browse />
  },
  {
    path: '/description/:type/:id',
    element: <DescriptionPage />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/notification',
    element: <NotificationPage />
  },
  {
    path: '/admin/create',
    element: <CreatePost />
  },
  {
    path: '/admin/job/post',
    element: <PostJob />
  },
  {
    path: '/admin/posts',
    element: <AdminJobs />
  },
  {
    path: '/admin/companies',
    element: <Companies />
  }
])


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/me`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setUser(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchUser();
  }, [dispatch]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App