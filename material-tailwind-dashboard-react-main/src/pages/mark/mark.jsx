import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
  Button,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { db } from "@/context/Firebase/firebase.config";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc, query, where } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { AuthContext } from "@/context/AuthProvider/AuthProvider";
import * as XLSX from 'xlsx';

export function Mark() {
  const { createUser } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [subject, setSubject] = useState([]);
  const [mark, setMark] = useState([]);
  const [editM, setEditM] = useState({ id: null, mark: null, subject: null, uid: null });
  const [classes, setClass] = useState([]);
  const [choseClass, setChose] = useState();

  function handleDelete(id) {
    const deleteVal = doc(db, "user", id)
    deleteDoc(deleteVal).then(res => {
      alert("Xoá thành công!");
    })
  }


  const value = collection(db, 'student');
  const sub = collection(db, 'subject');
  const ma = collection(db, 'mark');
  const cl = collection(db, 'class')
  const getData = async (className) => {

    let res = localStorage.getItem('role') === 'parent' ? await getDocs(query(value, where('email','==', localStorage.getItem('email')))) : 
    await getDocs(query(value, where('class', '==', className)))
    return res;
  }
  function getDataTable(className) {
    getData(className).then(res => {
      setData(res.docs.map(doc => {
        let val = doc.data();
        let id = doc.id
        return { name: val.name, id: id }
      }));
      getDocs(sub).then(res => {
        let subj = res.docs.map(doc => {
          let val = doc.data();
          let id = doc.id

          return { name: val.name, id: id }
        })
        setSubject(localStorage.getItem('role') === 'parent' || localStorage.getItem('role') === 'homeroom' ? subj 
        : subj.filter(val => val.name === localStorage.getItem('subject')))
      })
      getDocs(ma).then(res => {
        setMark(res.docs.map(doc => {
          let val = doc.data();
          let id = doc.id
          return { id: id, uid: val.uid, mark: val.mark, subject: val.subject }
        }))
      })
    })
  }
  useEffect(() => {
    
    getDocs(cl).then(res => {
      let classe = res.docs.map(doc => {
        let val = doc.data();
        let id = doc.id

        return { name: val.name, id: id }
      })
      setClass(classe);
      setChose(classe[0].name)
      getData(classe[0].name).then(res => {
        setData(res.docs.map(doc => {
          let val = doc.data();
          let id = doc.id
  
          return { name: val.name, id: id }
        }))
        getDocs(sub).then(res => {
          setSubject(res.docs.map(doc => {
            let val = doc.data();
            let id = doc.id
  
            return { name: val.name, id: id }
          }))
        })
        getDocs(ma).then(res => {
  
          setMark(res.docs.map(doc => {
            let val = doc.data();
            let id = doc.id
            return { id: id, uid: val.uid, mark: val.mark, subject: val.subject }
          }))
        })
      })
    })
  }, []);


  function addTeacher(e) {
    e.preventDefault()
    if (editM.id)
      updateDoc(doc(db, 'mark', editM.id), { mark: editM.mark, subject: editM.subject, uid: editM.uid }).then(res => {
        getDataTable(choseClass)
        alert("Done!");
        setShow(false)
      })

    else {
      addDoc(ma, { mark: editM.mark, subject: editM.subject, uid: editM.uid }).then(r => {
        getDataTable(choseClass)
        alert("Thêm thành công")
      })
    }
    setEditM({ id: null, mark: null, subject: null, uid: null })
  }
  function getMark(sub, uid) {
    return mark.filter(m => m.uid === uid && m.subject === sub)[0]
  }
  const headers = ["STT", "Tên"];
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex justify-between">
            <Typography variant="h6" color="white">
              Bảng điểm
            </Typography>

          </div>
        </CardHeader>
        <div className="flex space-x-3 px-4">
          {localStorage.getItem('role') !== 'parent' && classes.map((cl,i) => <span key={i} className="px-2 py-2 border rounded-lg border-black cursor-pointer text-center" 
          style={choseClass === cl.name ? {backgroundColor: "#323232", color: 'white'} : {}}
          onClick={()=>{setChose(cl.name); getDataTable(cl.name)}}
          >
            { cl.name}
          </span>) }
          
        </div>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[...headers].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
                {
                  subject.map(el => <th
                    key={el.id}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el.name}
                    </Typography>
                  </th>)
                }
              </tr>
            </thead>
            <tbody>
              {data.map(
                ({ id, name }, key) => {
                  const className = `py-3 px-5 ${key === data.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                    }`;

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {key + 1}
                            </Typography>

                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {name}
                            </Typography>

                          </div>
                        </div>
                      </td>
                      { subject.filter(val => val.name === localStorage.getItem('subject')).map(sub => <td className={className}>
                        <div className="flex items-center gap-4 hidden-item cursor-pointer">
                          {editM.uid === id && editM.subject === sub.id && localStorage.getItem('role') !== 'parent' ? <input className="w-[25px] text-center" autoFocus
                            onChange={(e) => { setEditM({ ...editM, mark: Number(e.target.value) <= 10 ? Number(e.target.value) : 10 }) }}
                            value={editM.mark}
                            onKeyDown={(e) => {
                              let charCode = (e.which) ? e.which : e.keyCode;
                              if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
                                e.preventDefault()
                              }
                            }}
                          /> : <div onDoubleClick={() => { let a = getMark(sub.id, id); setEditM({ id: a?.id, uid: id, subject: sub.id, mark: a?.mark }) }}>

                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {getMark(sub.id, id)?.mark ?? 'N/A'}
                            </Typography>

                          </div>}
                          {editM.uid === id && editM.subject === sub.id && <Typography
                            onClick={addTeacher}
                            as="button"
                            className="text-xs font-semibold text-blue-gray-600 cursor-pointer"
                          >
                            Lưu
                          </Typography>}
                        </div>
                      </td>)}
                      
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Mark;
