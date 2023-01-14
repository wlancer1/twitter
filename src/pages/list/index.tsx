import { infoDTO } from "@/models/info"
import { userDTO } from "@/models/user"
import { DeleteO, Edit, Plus } from "@react-vant/icons"
import moment from "moment"
import { useEffect, useId, useState } from "react"
import { ActionSheet, Flex, Image, FloatingBall, Dialog, Field, List as ListView, Card, Toast } from "react-vant"
import { ActionSheetAction } from "react-vant/es/action-sheet/PropsType"
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
  }, [])
  const initData = () => {
    if (infoList.length <= pageSize) {
      setFinished(true);
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
  const actions = [{ name: '退出登录' }]
  return (<div className="container_list">
    <Flex justify="start" align="center" gutter={10}>
      <Flex.Item >
        <Image onClick={() => setVisible(1)} round fit='cover' width='50px' src="https://avatars.githubusercontent.com/u/15881260?v=4" />
      </Flex.Item>
      <Flex.Item >{user.username}</Flex.Item>

    </Flex>
    <ListView onLoad={onLoad} finished={finished} className="list_view" offset={100}>
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
                  <Flex justify="center" >
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
                          title: '提示',
                          message: '确认删除该条么？',
                          onConfirm: () => {
                            del(item, (status: boolean) => {
                              if (status) {
                                Toast.success('删除成功')
                              }
                            })
                          }
                        })
                      }} />
                    </Flex.Item>
                  </Flex>
                </>
              </Card.Footer>
            </Card>
          )
        })
      }

    </ListView>
    <Dialog
      visible={dialogVisible}
      title='推文'
      showCancelButton
      onConfirm={() => {
        if (detail) {
          let params: infoDTO = {
            ...detail,
            content: value1,
            timeStamp: new Date().getTime(),
            time: moment().format("YYYY-MM-DD HH:mm"),
          }
          update(params, (status: boolean) => {
            if (status) {
              Toast.success('修改成功')
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
            Toast.success('添加成功')
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
        placeholder="请输入内容"
      />
    </Dialog>
    <ActionSheet
      visible={visible === 1}
      onCancel={onCancel}
      onSelect={onSelect}
      actions={actions}
      cancelText='取消'
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
        // 滚动缩进比例
        indent: 0.5,
        // 近边停靠距离
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