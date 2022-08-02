import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Bar, Line } from 'react-chartjs-2'
import { useEffect, useState } from 'react'
import { Chart as ChartJS } from 'chart.js/auto'
import axios from 'axios'

export default function Home() {
  const router = useRouter()
  const [graph, setGraph] = useState()
  const [chartData, setChartData] = useState()
  const [filter, setFilter] = useState({})

  const onChangeHandler = (e) => {
    const obj = filter

    obj[e.target.name] = e.target.value
    setFilter(obj)
  }

  const fetchGraph = async () => {
    try {
      const temp = []

      for (const key in filter) {
        if (filter[key] && temp.length > 0) {
          temp.push(`&${key}=${filter[key]}`)
        }
        if (filter[key] && temp.length == 0) {
          temp.push(`?${key}=${filter[key]}`)
        }
      }

      const query = temp.join().replaceAll(',','')
      console.log(query);

      const { data } = await axios.get(`http://localhost:3000/raw-datas${query}`)
      setGraph(data)
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (graph) {
      setChartData({
        labels: graph.map(el => {
          const d = new Date(el.resultTime);
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return `${d.getFullYear()}-${months[d.getMonth()]}-${d.getDate()}`;
        }),
        datasets: [{
          label: "available",
          data: graph.map(el => el.availDur),
        }]
      })
    }
  }, [graph])

  return (
    <div className='w-screen h-screen bg-slate-50'>
      <div className='w-screen h-24 bg-white px-12 flex items-center space-x-3 z-10 fixed shadow-sm'>
        <div className='w-24 h-12 rounded-md items-center justify-center flex px-10 hover:bg-[#f5f5f5] hover:cursor-pointer' onClick={() => router.push('/')}>Graph</div>
        <div className='w-24 h-12 rounded-md items-center justify-center flex px-10 hover:bg-[#f5f5f5] hover:cursor-pointer' onClick={() => router.push('/upload')}>Upload</div>
      </div>

      <div className='w-full h-screen fixed flex'>
        <div className='w-1/4 h-full pt-32 '>
          <div className='w-3/4 space-y-2 bg-white shadow-xl rounded-md px-3 py-5 ml-24'>
            <div>
              <p className='ml-1'>Start Date</p>
              <input name='startDate' type="date" className='w-full h-12 border rounded-lg px-2' onChange={onChangeHandler} />
            </div>

            <div>
              <p className='ml-1'>End Date</p>
              <input name='endDate' type="date" className='w-full h-12 border rounded-lg px-2' onChange={onChangeHandler} />
            </div>

            <div>
              <p className='ml-1'>Enodeb Id</p>
              <input name='enodebId' type="text" className='w-full h-12 border rounded-lg px-2' onChange={onChangeHandler} />
            </div>

            <div>
              <p className='ml-1'>Cell Id</p>
              <input name='cellId' type="text" className='w-full h-12 border rounded-lg px-2' onChange={onChangeHandler} />
            </div>

            <div className='w-full h-12 border rounded-lg px-2 bg-[#6128ff] flex justify-center items-center text-white hover:cursor-pointer' onClick={fetchGraph}>
              Filter
            </div>
          </div>
        </div>

        <div className='w-3/4 h-screen  px-12 space-x-3 pt-32'>
          <div className=' bg-white p-10 shadow-xl rounded-md'>
          <div className='bg-white w-full h-auto pb-'>
            {chartData && <Bar data={chartData} />}
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
