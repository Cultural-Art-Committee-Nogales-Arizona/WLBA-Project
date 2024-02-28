"use client"
import React from "react";
import styles from "./page.module.css";
import Highlight from "@/components/Highlight";

// Images
import Image from "next/image";
import heroImage from "@/public/Images/aboutUs.jpg";
import ImportDirectorInformation from "@utils/ImportDirectorInformation";

import Hero from '@/components/Hero'
import DirectorImage from '@/components/gallery/DirectorImage'

import Donate from '@/components/buttons/Donate'

import ChristmasImg from '@/public/Images/Christmas.jpg'
import DiaDel from '@/public/Images/DiaDel.jpg'

import localFont from 'next/font/local'
const artesaniaFont = localFont({
  src: '../../public/fonts/ARTESANIA.ttf',
  display: 'swap',
})

export default function aboutUs() {
  console.log(ImportDirectorInformation)
  return (
    <div className={styles.aboutUsContainer} >
      <Hero 
        params={{ heroImage }} 
        className={styles.heroImage}
      />
      <div className={`${styles.headText} ${artesaniaFont.className}`}>
        <div>
          <h1>About Us</h1>
        </div>
        <br />
        <br />
        <div className={styles.buttonContainer}>
          <a className={styles.callToAction} href="#readMore">Read more</a>
        </div>
      </div>

      <div className={styles.boardOfDirectors}>
        <h1>Board Of Directors</h1>
        <div className={styles.directorContainer}>
          {ImportDirectorInformation && ImportDirectorInformation.map(director => {
            return <DirectorImage params={{ profileImage: director.image.src, name: director.name, position: director.position }} />
          })}
        </div>
      </div>

      <div className={styles.godfather}>
        <div className={styles.container1}>
          <div className={styles.Imagec1}>
              {/* <Image
                width={220}
                height={290}
                src={AboutUsImagetwo}
                
                alt={"text"}
              /> */}
            </div>

          <div className={styles.child1}>
            <p>
              Esther Melendez-Lopez, seeking re-election to the Nogales City
              Council, emphasizes her commitment to cultural events, tourism,
              affordable housing, and public safety. As a member of the Cultural
              Arts Committee, she has been instrumental in organizing events to
              enrich the community. Melendez-Lopez supports the IME Becas
              scholarship program and defends her focus on cultural events,
              asserting her active engagement in council matters. She advocates
              for affordable housing, backs the city's annexation plan for
              growth, and prioritizes public safety by allocating COVID relief
              funds to pay down the pension debt. Overall, she presents herself
              as a dedicated community leader with a comprehensive approach to
              addressing Nogales' diverse needs.
            </p>
          </div>
          <div className={styles.child2}>
            <p>
              Sandra Kory, Treasurer of the Cultural Arts Committee in Nogales, 
              Arizona, is a dedicated community leader with strong local ties. 
              Recognized with the Ohtli Award in 2015 for her commitment to cultural 
              events, Sandra actively contributes to community richness. She plays 
              a vital role in the success of South32's initiatives in the region, 
              introducing significant cultural celebrations like Cinco De Mayo. Sandra's 
              multifaceted contributions and expertise showcase her passion for 
              preserving and promoting cultural arts in the community.
            </p>
          </div>

          <div className={styles.Imagec2}>
              {/* <Image
                width={220}
                height={290}
                src={AboutUsImagethree}
                
                alt={"text"}
              /> */}
            </div>
        </div>
      </div>
      
      <div className={styles.eventDiv}>
        <h1>Our Events</h1>
        <div className={styles.eventsContainer}>
          <div className={styles.events}>
            <div className={styles.eventsImg}>
              {/* Image */}
            </div>

            <div className={styles.desc}>
              <h4>Feb 13, 2024</h4>
              <h3>Dia Del Amor y La Amistad</h3>
              <h5></h5>
            </div>
          </div>

          <div className={styles.events}>
            <div className={styles.eventsImg}>
              {/* <Image 
              src={DiaDel}
              width={350}
              height={370}
              /> */}
            </div>

            <div className={styles.desc}>
              <h4>May 4, 2024</h4>
              <h3>Fiesta De Las Flores</h3>
              <h5></h5>
            </div>
          </div>

          <div className={styles.events}>
            <div className={styles.eventsImg}>
              <Image
                src={DiaDel}
                width={350}
                height={415}
                className={styles.img}
              />
            </div>

            <div className={styles.desc}>
              <h4>October 26, 2024</h4>
              <h3>Dia De Los Muertos</h3>
              <h5></h5>
            </div>
          </div>

          <div className={styles.events}>
            <div className={styles.eventsImg}>
              <Image
                src={ChristmasImg}
                width={350}
                height={415}
                className={styles.img}
              />
            </div>

            <div className={styles.desc}>
              <h4>November 18, 2024 - January 7, 2025</h4>
              <h3>Christmas Village In Karam Park</h3>
              <h5></h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
