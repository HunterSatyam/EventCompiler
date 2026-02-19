import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Heart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import useGetNotifications from '@/hooks/useGetNotifications'

const Navbar = () => {
    useGetNotifications();
    const { user } = useSelector(store => store.auth);
    const { allNotifications } = useSelector(store => store.notification);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    return (
        <div className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-12'>
                <div>
                    <Link to="/">
                        <h1 className='text-2xl font-black tracking-tight'>Career<span className='text-[#F83002]'>Compass</span></h1>
                    </Link>
                </div>
                <div className='flex items-center gap-12'>
                    <ul className='flex font-black text-sm uppercase tracking-widest items-center gap-6 text-gray-600'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li className='hover:text-purple-600 transition-colors'><Link to="/">Home</Link></li>
                                    <li className='hover:text-purple-600 transition-colors'><Link to="/admin/companies">Organisation</Link></li>
                                    <li className='hover:text-purple-600 transition-colors'><Link to="/admin/posts">Posts</Link></li>
                                    <li className='hover:text-purple-600 transition-colors'><Link to="/admin/create">Create Post</Link></li>
                                </>
                            ) : (
                                <>
                                    <li className='hover:text-purple-600 transition-colors'><Link to="/">Home</Link></li>
                                    <li className='hover:text-purple-600 transition-colors'><Link to="/events">Events</Link></li>
                                    <li className='hover:text-purple-600 transition-colors relative'>
                                        <Link to="/notification">Notification</Link>
                                        {allNotifications.filter(n => !n.isRead).length > 0 && (
                                            <span className='absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white font-bold ring-2 ring-white animate-pulse'>
                                                {allNotifications.filter(n => !n.isRead).length}
                                            </span>
                                        )}
                                    </li>
                                    <li className='hover:text-purple-600 transition-colors'><Link to="/browse">Browse</Link></li>
                                    <li className='hover:text-purple-600 transition-colors'><Link to="/resume/builder">Resume Builder</Link></li>
                                    <li className='hover:text-purple-600 transition-colors'><Link to="/resume/ats">ATS Scanner</Link></li>
                                    <li className='hover:text-purple-600 transition-colors'>
                                        <Link to="/saved-events" className='flex items-center gap-2'>
                                            <Heart size={20} />
                                            <span className='hidden md:inline'>Saved</span>
                                        </Link>
                                    </li>

                                </>
                            )
                        }



                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login">
                                    <Button variant="outline" className="border-gray-300 hover:bg-gray-100 transition-colors duration-300">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-gradient-to-r from-[#6A38C2] to-[#8a46a3] hover:from-[#5b30a6] hover:to-[#783e8f] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                                        Signup
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                        <AvatarFallback>{user?.fullname?.charAt(0)?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className=''>
                                        <div className='flex gap-2 space-y-2'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>{user?.fullname}</h4>
                                                <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col my-2 text-gray-600'>
                                            {
                                                <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                    <User2 />
                                                    <Button variant="link"> <Link to="/profile">View Profile</Link></Button>
                                                </div>
                                            }

                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <LogOut />
                                                <Button onClick={logoutHandler} variant="link">Logout</Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }

                </div>
            </div>

        </div>
    )
}

export default Navbar