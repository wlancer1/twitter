import { useCallback, useState } from "react";
export interface userDTO {
  username: string;
  password: string;
  isLogin: boolean;
}
export default () => {
  const [user, setUser] = useState({
    username: 'umi',
    password: '',
    isLogin: false
  });

  const login = useCallback((props: userDTO, callback: Function) => {
    if (verity(props)) {
      setUser({ ...props, isLogin: true });
      callback(true)
    } else {
      callback(false)
    }
  }, []);

  const register = useCallback((props: userDTO,callback: Function) => {
    if(verityRepeat(props)){
      callback(false);
      return
    }
    let userInfo = window.localStorage.getItem('userInfo')
    if (userInfo) {
      let obj = JSON.parse(userInfo);
      let userList = [props, ...obj]
      window.localStorage.setItem('userInfo', JSON.stringify(userList))
    } else {
      window.localStorage.setItem('userInfo', JSON.stringify([props]))
    }
    setUser(props);
    callback(true)
  }, []);
  const verity = (props: userDTO) => {
    let userInfo = window.localStorage.getItem('userInfo')
    if (userInfo) {
      let userList = JSON.parse(userInfo);
      return (userList.some((element: userDTO) => {
        if (element.password === props.password && element.username === props.username) {
          return true;
        }
      }));
    }
    return false
  }
    const verityRepeat = (props: userDTO) => {
    let userInfo = window.localStorage.getItem('userInfo')
    if (userInfo) {
      let userList = JSON.parse(userInfo);
      return (userList.some((element: userDTO) => {
        if (element.username === props.username) {
          return true;
        }
      }));
    }
    return false
  }
  return { user, login, register };
};