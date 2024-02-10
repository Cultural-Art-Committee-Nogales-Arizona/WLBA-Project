"use client"
import React from "react";
import styles from "./page.module.css";
import Highlight from "@/components/Highlight";
import Image from "next/image";
import AboutUsImageone from "@/public/Images/aboutUs.jpg";
import AboutUsImagetwo from "@/public/Images/president.jpg";
import AboutUsImagethree from "@/public/Images/kory.jpg";
import { useTranslation } from 'react-i18next';


export default function aboutUs() {
  const { t } = useTranslation();

  return (
    <div>
      <div className={styles.container}>
      <Image
        className={`${styles.bannerImage} ${styles.transparent}`} 
        src={AboutUsImageone}
        alt={"Banner"}
        
      />
        <div className={styles.header}>
          <div className={styles.header2}>
            <div className={styles.header3}>
          <div className={styles.auc}>About us</div>
          {t('aboutUs.missionStatement')}
          </div>
          </div>
        </div>
      </div>
      <div className={styles.godfather}>
        <div className={styles.container1}>
          <fieldset className={styles.fs}>
            <h4>Board of Directors</h4>
            
              <h3 className={styles.h3}>
                <p>Esther Melendez-Lopez, President</p>
              </h3>
              <h3 className={styles.h3}>
                <p>Laura Diaz, Vice-President</p>
              </h3>
              <h3 className={styles.h3}>
                <p>Sandra Kory, Treasurer</p>
              </h3>
              <h3 className={styles.h3}>
                <p>Jaime Paz y Puente, Secretary</p>
              </h3>
              <h3 className={styles.h3}>
                <p>Silvia Acosta</p>
              </h3>
              <h3 className={styles.h3}>
                <p>Reyna Armenta</p>
              </h3>
              <h3 className={styles.h3}>
                <p>Lucia Bojorquez</p>
              </h3>
              <h3 className={styles.h3}>
                <p>Gabriela Campaña</p>
              </h3>
              <h3 className={styles.h3}>
                <p>Sandra Moraga</p>
              </h3>
              <h3 className={styles.h3}>
                <p>Octavio Moraga</p>
              </h3>
              <h3 className={styles.h3}>
                <p>Santos Yescas</p>
              </h3>
            
          </fieldset>
        </div>

        <div className={styles.container2}>
          <div className={styles.child1}>
            <div>
              <Image
                width={220}
                height={290}
                src={AboutUsImagetwo}
                className={styles.Imagec1}
                alt={"text"}
              />
            </div>

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
            Sandra Kory, Treasurer of the Cultural Arts Committee in Nogales, Arizona, is a dedicated community leader with strong local ties. Recognized with the Ohtli Award in 2015 for her commitment to cultural events, Sandra actively contributes to community richness. She plays a vital role in the success of South32's initiatives in the region, introducing significant cultural celebrations like Cinco De Mayo. Sandra's multifaceted contributions and expertise showcase her passion for preserving and promoting cultural arts in the community.
            </p>

            <div>
              <Image
                width={220}
                height={290}
                src={AboutUsImagethree}
                className={styles.Imagec2}
                alt={"text"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
