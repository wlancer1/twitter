import { infoDTO } from "@/models/info"
import { userDTO } from "@/models/user"
import { DeleteO, Edit, Exchange, Plus } from "@react-vant/icons"
import moment from "moment"
import { useEffect, useId, useState } from "react"
import { ActionSheet, Flex, Image, FloatingBall, Dialog, Field, List as ListView, Card, Toast, Popover } from "react-vant"
import { ActionSheetAction } from "react-vant/es/action-sheet/PropsType"
import { PopoverAction } from "react-vant/es/popover/PropsType"
import { useModel, history } from "umi"
import './style.less'
const List: React.FC<{}> = props => {
  const [visible, setVisible] = useState(-1)
  const [dialogVisible, setDialogVisible] = useState(false);
  const { user, logout } = useModel('user');
  const [finished, setFinished] = useState<boolean>(false)
  const [dataList, setDataList] = useState<Array<infoDTO>>([])
  const [pageSize, setPageSize] = useState(5)
  const [detail, setDetail] = useState<any>(null)
  const { infoList, Add, del, update } = useModel("info");
  const [value1, setValue1] = useState('')
  const onCancel = () => setVisible(-1)
  const id = useId();
  const onSelect = (action: ActionSheetAction, index: number) => {
    logout();
    history.replace('/')
  }
  useEffect(() => {
    initData();
  }, [infoList])
  const initData = () => {
    if (infoList.length <= pageSize) {
      setFinished(true);
    }else{
      setFinished(false);
    }
    let initInfoList = infoList.slice(0, pageSize);
    setDataList(initInfoList)
  }
  const onLoad = async (isRetry:boolean) => {
    if(dataList.length===0){
      return;
    } 
    let res:any =await new Promise((resolve, reject) => {
      setTimeout(()=>{
        if (dataList.length < infoList.length) {
          dataList.push(infoList[dataList.length - 1])
          resolve(dataList);
        } else {
          setFinished(true)
          reject(true)
        }
      },2000)
    })
    setDataList([...res]);
  }
  const handleSelect =(action: PopoverAction, index: number) =>{
    if(index===0){
      document.body.style.setProperty('--primary-background-color', '#000')
      document.body.style.setProperty('--primary-text-color', '#fff')
    }else{
      document.body.style.setProperty('--primary-text-color', '#000')
      document.body.style.setProperty('--primary-background-color', '#dfe4ee')
    }
   
  }
  const actions = [{ name: '????????????' }]
  const exAction=[{text:'dark' },{text:'white'}]
  return (<div className="container_list">
    <Flex justify="start" align="center" gutter={10}>
      <Flex.Item >
        <Image onClick={() => setVisible(1)} round fit='cover' width='50px' src="https://avatars.githubusercontent.com/u/15881260?v=4" />
      </Flex.Item>
      <Flex.Item className="text_username">{user.username}</Flex.Item>
      <Flex.Item  flex={1}>
        <Flex justify="end" align="end">
        <Popover
            actions={exAction}
            placement='left-start'
            onSelect={handleSelect}
            reference={ <Exchange color="#3f45ff" style={{fontSize:'20px'}}/>}
        />
           
        </Flex>
      </Flex.Item>
    </Flex>
    <ListView onLoad={onLoad} finished={finished} className="list_view" offset={100} key={finished+''}>
      {
      dataList.map((item, index) => {
          return (
            <Card className="card_item" key={index}>
              <Card.Header>{item.owner}</Card.Header>
              <Card.Body>{item.content}</Card.Body>
              <Card.Footer>
                <>
                  <Flex justify="end" align="center">
                    <Flex.Item span={12}>
                      {item.time}
                    </Flex.Item>
                  </Flex>
                  {user.username===item.owner&&<Flex justify="center" >
                    <Flex.Item span={12} className='card_op'>
                      <Edit onClick={() => {
                        setDialogVisible(true);
                        setDetail(item);
                        setValue1(item.content);
                      }} />
                    </Flex.Item>
                    <Flex.Item span={12} className='card_op'>
                      <DeleteO onClick={() => {
                        Dialog.confirm({
                          title: '??????',
                          message: '????????????????????????',
                          onConfirm: () => {
                            del(item, (status: boolean) => {
                              if (status) {
                                Toast.success('????????????')
                              }
                            })
                          }
                        })
                      }} />
                    </Flex.Item>
                  </Flex>}
                </>
              </Card.Footer>
            </Card>
          )
        })
      }

    </ListView>
    <Dialog
      visible={dialogVisible}
      title='??????'
      showCancelButton
      onConfirm={() => {
        if(value1===''){
          return;
        }
        if (detail) {
          let params: infoDTO = {
            ...detail,
            content: value1,
            timeStamp: new Date().getTime(),
            time: moment().format("YYYY-MM-DD HH:mm"),
          }
          update(params, (status: boolean) => {
            if (status) {
              Toast.success('????????????')
              setValue1('')
              setDetail(null)
              setDialogVisible(false);
            }
          })
          return;
        }
        let params: infoDTO = {
          id: new Date().getTime() + '',
          timeStamp: new Date().getTime(),
          time: moment().format("YYYY-MM-DD HH:mm"),
          content: value1,
          owner: user.username
        };

        Add(params, (status: boolean) => {
          if (status) {
            setDialogVisible(false)
            setValue1('')
            Toast.success('????????????')
           
          }
        })

      }}
      onCancel={() => setDialogVisible(false)}
    >
      <Field
        rows={5}
        value={value1}
        onChange={setValue1}
        type="textarea"
        placeholder="???????????????"
      />
    </Dialog>
    <ActionSheet
      visible={visible === 1}
      onCancel={onCancel}
      onSelect={onSelect}
      actions={actions}
      cancelText='??????'
    />
    <FloatingBall
      className="floating-box-bubble"
      offset={{
        right: 20,
        bottom: 20,
      }}
      style={{
        '--rv-floating-box-size': '60px',
      }}
      adsorb={{
        // ??????????????????
        indent: 0.5,
        // ??????????????????
        distance: 20,
      }}
    >
      <Flex align='center' justify='center' className='main-button' onClick={() => {
        setDialogVisible(true)
      }}>
        <Plus />
      </Flex>
    </FloatingBall>

  </div>)
}
export default List