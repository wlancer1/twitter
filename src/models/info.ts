import { useCallback, useState } from "react";

export interface infoDTO{
  content:string,
  timeStamp:number,
  owner:string,
  time:string,
  id:string
}
export default () => {
  const [infoList, setInfoList] = useState<Array<infoDTO>>([{
    id:'0',
    content: 'test',
    time:'2012.3.15',
    timeStamp: 123,
    owner:'admin'
  }
]);
  const Add = (props: infoDTO, callback: Function) => {
        setInfoList([props,...infoList])
        console.log('%c [ infoList ]-21', 'font-size:13px; background:pink; color:#bf2c9f;', infoList)
        callback(true);
  }
  const del = (props: infoDTO, callback: Function) => {
        let resultList=infoList.filter(item=>item.id!==props.id)
        setInfoList(resultList)
        callback(true);
  };
  const update = (props: infoDTO, callback: Function) => {
        infoList.forEach((item,index)=>{
          if(item.id===props.id){
            infoList[index]=props
          }
        })
      setInfoList([...infoList]);
      callback(true)
  }

  return { infoList, Add, del,update };
}