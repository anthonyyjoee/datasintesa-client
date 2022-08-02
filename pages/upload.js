import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function Home() {
  const router = useRouter()
  const [file, setFile] = useState()

  const uploadFile = async (file) => {
    console.log(file);
    let formData = new FormData();
    formData.append('compressed', file, file.name);

    try {
      const res = await axios({
        method: "post",
        url: "http://localhost:3000/raw-datas",
        data: { formData }
      })

      console.log(res);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className='w-screen h-screen'>
      <div className='w-screen h-24 bg-white px-12 flex items-center space-x-3 z-10 fixed shadow-sm'>
        <div className='w-24 h-12 rounded-md items-center justify-center flex px-10 hover:bg-[#f5f5f5] hover:cursor-pointer' onClick={() => router.push('/')}>Graph</div>
        <div className='w-24 h-12 rounded-md items-center justify-center flex px-10 hover:bg-[#f5f5f5] hover:cursor-pointer' onClick={() => router.push('/upload')}>Upload</div>
      </div>

      <div className='w-full h-full bg-gray-200 px-2 flex justify-center pt-32'>
        <div className='w-1/2 h-1/2 bg-white shadow-md p-5'>
          <input name='file' id='file' type="file" className='w-full h-12 border rounded-lg px-2 hidden' onChange={(e) => {
            document.getElementById("button").append(e.target.files[0].name)
            setFile(e.target.files[0])
          }}/>
          <button id='button' onClick={() => {
            document.getElementById('file').click()
          }} className="w-full h-24 border border-dashed">
            Click to select file
          </button>
          <button onClick={() => uploadFile(file)}>submit</button>
        </div>
      </div>
    </div>
  )
}
