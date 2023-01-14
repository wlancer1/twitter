import { userDTO } from "@/models/user";
import { useState } from "react";
import { Flex, Toast } from "react-vant";
import { useModel,history } from "umi";
import Login from "../login";
import Register from '../register'
import './style.less';
const Root: React.FC<{}> = props => {
  const [isLogin, setIsLogin] = useState<Boolean>(true)
  const { user,register,login } = useModel('user');
  return (

    <div  className="root_container">
      <Flex direction='row' justify='center' style={{ marginTop: 5 }}>
        <Flex.Item  >
          <img src={require("../../assets/logo.png")} width="100px" ></img>
        </Flex.Item>
      </Flex>
      {isLogin ? <Login  handleLogin={(values:userDTO)=>{
        
          login(values,(status:boolean)=>{
              if(status){
                setTimeout(()=>{
                  Toast.success('登录成功')
                  history.replace('/list')
                },500)
              }else{
                Toast.fail('登录失败，用户名或密码错误')
              }
          })
          
      }} /> : <Register handleRegister={(values:userDTO)=>{
            register(values,(status:boolean)=>{
              if(status){
                Toast.success('注册成功')
                setIsLogin(true)
              }else{
                Toast.fail('注册失败有重复的用户')
              }
            });
          
      }}/>}
      <Flex direction='row' justify='end' style={{ marginTop: 5 }}>
        <Flex.Item onClick={async () => {
          await setIsLogin(!isLogin)
        }}>
          <span className="root_msg">{isLogin ? '点击注册' : '去登陆'}</span>
        </Flex.Item>
      </Flex>
    </div>
  )
}
export default Root;