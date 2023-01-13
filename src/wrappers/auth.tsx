import { Navigate, Outlet, useModel } from 'umi'
 
export default () => {
  const { user } = useModel('user');
  console.log('%c [ user.isLogin ]-6', 'font-size:13px; background:pink; color:#bf2c9f;', user.isLogin)

  if (user.isLogin) {
    return <Outlet />;
  } else{
    return <Navigate to="/" />;
  }
}