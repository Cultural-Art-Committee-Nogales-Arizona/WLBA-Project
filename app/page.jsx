'use client'
import { useEffect, useState } from 'react'
import Hero from '@/components/Hero'
import Loading from '@/components/overlays/Loading'
import styles from './page.module.css'
import Image from "next/image";
import TitleImg from "@/public/Images/BackgroundImg.jpg";
import Logo from '@/public/Logo';
import Dod from '@/public/Images/HomeImageDOD.jpg'
import headImg from '@/public/Images/NogalesTitle.jpg'

export default function Index() {
  const [nextEvent, setNextEvent] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    async function fetchData() {
      try {
        const eventCall = await fetch('./api/events/festivals?nextEvent=true', { signal, method: "GET" })
        const fetchedData = await eventCall.json()

        const startDate = new Date(fetchedData.data.start)
        const endDate = new Date(fetchedData.data.end)

        const returnedEvent = {
          ...fetchedData.data,
          // You can change these Date methods to whatever format you want
          start: startDate.toLocaleDateString(),
          end: endDate.toLocaleDateString()
        }

        setNextEvent(returnedEvent)
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted')
        } else {
          console.error('Error fetching data:', error)
        }
      }
    }

    fetchData()

    return () => controller.abort()
  }, [])

  return (
    <div>
      <div className={styles.mainDiv}>
        <Image
          width={1519}
          height={650}
          src={TitleImg}
          alt={"text"}
          className={styles.Img}
        />
        <Logo scale="75" className={styles.logo} />
      </div>

      <div className={styles.contentDiv}>
        <div className={styles.child}>
          <div className={styles.p}>
            <p>
              The Cultural Arts Committee in Nogales, Arizona, is a non-profit organization dedicated to
              preserving and sharing the rich heritage of historical and Mexican cultural traditions.
              Through the conservation of folkloric and artistic expressions, we collaborate with educators,
              historians, and artists to offer resources. Together, we organize community festivals in partnership
              with local entities, aiming to benefit the community by fostering cultural appreciation.
            </p>
          </div>

          <Image
            src={headImg}
            className={styles.Img2}
            width={550}
            height={300}
            alt={"Header Image"}
          />
        </div>

        <div className={styles.child}>
          <Image
            src={Dod}
            width={570}
            height={350}
            className={styles.Img2}
            alt={"Home image of dancers"}
          />

          <div className={styles.p}>
            <p>
              The Day of the Dead, or "Día de los Muertos," is a Mexican celebration on November 1st and 2nd
              honoring departed loved ones. Families create altars with photos, candles, and favorite items,
              believing that the spirits return to enjoy the offerings. It's a vibrant blend of Aztec traditions
              and Catholicism, celebrating life and familial bonds beyond death. Recognized by UNESCO, it has cultural
              significance beyond Mexico.
            </p>
          </div>
        </div>
      </div>






      {/* <h1>Next Event</h1>
        { nextEvent ? 
          <div>
            <h4>Start Date:</h4><p> The next event starts on {nextEvent.start}</p>
            <h4>End Date:</h4><p> The next event ends on {nextEvent.end}</p>
            <h4>Title:</h4><p> {nextEvent.title}</p>
            <h4>Description:</h4><p> {nextEvent.description}</p>
            <h4>Banner:</h4><p> {nextEvent.banner}</p>
            <h4>Location:</h4><p> {nextEvent.location}</p>
          </div> 
          : 
          <Loading scale={200} />
        } */}
    </div>
  )
}