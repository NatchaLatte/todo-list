"use client"
import { MdAddBox } from "react-icons/md";
import { GrClearOption } from "react-icons/gr";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { CgMoreR } from "react-icons/cg";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';

const Home = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [update, setUpdate] = useState(true);

  useEffect(() => {
    fetch("/api")
    .then(res => res.json())
    .then(data => setData(data))
  }, [update])

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  const handleAdd = () => {
    const informationMessage = message.trim()
    if(informationMessage.length > 0){
      Swal.fire({
        title: "คุณต้องการเพิ่มข้อมูลใหม่ ?",
        showCancelButton: true,
        confirmButtonText: "ใช่",
        cancelButtonText: "ยกเลิก"
      }).then((result) => {
        if(result.isConfirmed){
          fetch("/api", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: informationMessage })
          })
          .then((res) => {
            if(res.status === 200){
              setMessage("");
              setUpdate(!update)
              Toast.fire({
                icon: "success",
                title: "เพิ่มข้อมูลสำเร็จ"
              });
            }
          })
        }
      })
    }else{
      setMessage("");
      Toast.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูล"
      });
    }
  }

  const handleClear = () => {
    setMessage("");
    Toast.fire({
      icon: "success",
      title: "ล้างข้อมูลสำเร็จ"
    });
  }

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "คุณต้องการลบข้อมูล ?",
      showCancelButton: true,
      confirmButtonText: "ใช่",
      cancelButtonText: "ยกเลิก"
    }).then((result) => {
      if(result.isConfirmed){
        fetch("/api", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id })
        })
        .then((res) => {
          if(res.status === 200){
            setUpdate(!update)
            Toast.fire({
              icon: "success",
              title: "ลบข้อมูลสำเร็จ"
            });
          }
        })
      }
    })
  }

  const handleMore = (message: string) => {
    Swal.fire({
      icon: "info",
      text: message,
      confirmButtonText: "ยุบ"
    });
  }

  return (
    <main className="h-screen flex justify-center items-center">
      <div className="flex flex-col">
        <h1 className="text-4xl text-center dark:text-white">TODO<span className="text-red-500">L</span>IST ลิขิตชีวิตเรา</h1>
        <input value={message} onChange={message => setMessage(message.target.value)} type="text" placeholder="สิ่งที่อยากทำ..." className="dark:text-black dark:bg-slate-100 my-4 input input-bordered input-primary w-full self-center" />
        <div className="flex flex-row">
          <button onClick={handleAdd} className="btn flex-1 btn-primary mr-2 dark:text-white"><MdAddBox/> เพิ่ม</button>
          <button onClick={handleClear} className="btn flex-1 btn-neutral ml-2 dark:text-white"><GrClearOption/> ล้าง</button>
        </div>
        <div className={data.length ? "overflow-y-scroll h-auto max-h-56 mt-4" : ""}>
        {data.length ? data.map((data: any) => {
        return (
        <div key={data.id} className="shadow mb-4 dark:bg-white rounded">
          <div className="flex flex-row items-center justify-between p-3">
            <p className="text-lg w-60 truncate dark:text-black">{data.text}</p>
            <button onClick={() => handleMore(data.text)} className="mx-2 btn btn-info text-white"><CgMoreR /> แสดงเพิ่มเติม</button>
            <button onClick={() => { handleDelete(data.id) }} className="btn btn-error text-white"><RiDeleteBin7Fill /> ลบ</button>
          </div>
        </div>
        )
      }) : <progress className="progress progress-primary w-full"></progress>}
        </div>
      </div>
    </main>
  );
};

export default Home;
