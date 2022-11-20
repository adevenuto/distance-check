import React, { useState, useEffect } from 'react'
import Loader from './components/loader';
import './app.css';

export default function App() {
      const [cords1, setCords1] = useState({lat: 0, lng: 0})
      const [cords2, setCords2] = useState({lat: 0, lng: 0})
      const [result, setResult] = useState(0)
      const [loading, setLoading] = useState(false)

      const setCordsHandler = async (cordFor) => {
            if (cordFor===1) {
                  setLoading(true)
                  let position = await getLongAndLat();
                  setCords1({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                  })
                  setLoading(false)
                  console.log(position)
            }
            if (cordFor===2) {
                  setLoading(true)
                  let position = await getLongAndLat();
                  setCords2({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                  })
                  setLoading(false)
                  console.log(position)
            }
      }

      const getLongAndLat = () => {
            return new Promise((resolve, reject) =>
                  navigator.geolocation.getCurrentPosition(resolve, reject)
            );
      }

      const calcDistance = () => {
            const R = 6371e3; // metres
            const φ1 = cords1.lat * Math.PI/180; // φ, λ in radians
            const φ2 = cords2.lat * Math.PI/180;
            const Δφ = (cords2.lat-cords1.lat) * Math.PI/180;
            const Δλ = (cords2.lng-cords1.lng) * Math.PI/180;

            const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

            const d = R * c; 

            const meter = 1.0936132983 // yds
            const cvrt = Math.round( (d * meter) * 10)/10
            console.log(cvrt +'YDS' )
            setResult(cvrt)
      }

      useEffect(() => {
            if (cords1.lat!==0&&cords1.lng!==0 && cords2.lat!==0&&cords2.lng!==0) calcDistance()
      }, [cords1, cords2])

      
      return (
            <div className="flex flex-col border-2 h-screen sm:w-72 mx-auto relative">
                  {loading && <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center "><Loader></Loader></div>}
                  <div onClick={() => setCordsHandler(1)} className="flex-1 flex justify-center items-center border cursor-pointer bg-slate-50">
                        Set cord 1
                  </div>
                  <div onClick={() => setCordsHandler(2)} className="flex-1 flex justify-center items-center border cursor-pointer bg-slate-50">
                        Set cord 2
                  </div>
                  <div className="flex-1 flex justify-center items-center border">
                       { `${result}Yds`}
                  </div>
            </div>
      )
}