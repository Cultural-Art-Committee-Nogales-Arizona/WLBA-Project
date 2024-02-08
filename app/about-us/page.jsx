import React from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import styles from "./page.module.css";
import Highlight from "@/components/Highlight";
import Image from "next/image";
import AboutUsImageone from "@/public/Images/aboutUs.jpg";
import AboutUsImagetwo from "@/public/Images/president.jpg";
import AboutUsImagethree from "@/public/Images/kory.jpg";
export default function aboutUs() {
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
          Established in 2014 as a non-profit organization, the Cultural Arts
          Committee of Nogales, Arizona, has been busy creating events that
          bring the community together. We've hosted all sorts of things, from
          concerts and mariachi festivals to art workshops for kids and nativity
          exhibitions. In collaboration with the City of Nogales and the
          Consulate of Mexico, our programs cover a wide range, including
          scholarship initiatives, talks for Women's Week, and even a binational
          marathon. What makes it all happen? Our dedicated team of volunteers.
          The Board of Directors, made up of community members, including the
          former Consul General of Mexico, and local business leaders, helps
          steer the ship. We're all about supporting and celebrating our
          community.
          </div>
          </div>
        </div>
      </div>
      <div className={styles.godfather}>
        <div className={styles.container1}>
          <fieldset className={styles.fs}>
            <h5>Board of Directors</h5>
            <ul>
              <li className={styles.li}>
                <p>Esther Melendez-Lopez, President</p>
              </li>
              <li className={styles.li}>
                <p>Laura Diaz, Vice-President</p>
              </li>
              <li className={styles.li}>
                <p>Sandra Kory, Treasurer</p>
              </li>
              <li className={styles.li}>
                <p>Jaime Paz y Puente, Secretary</p>
              </li>
              <li className={styles.li}>
                <p>Silvia Acosta</p>
              </li>
              <li className={styles.li}>
                <p>Reyna Armenta</p>
              </li>
              <li className={styles.li}>
                <p>Lucia Bojorquez</p>
              </li>
              <li className={styles.li}>
                <p>Gabriela Campaña</p>
              </li>
              <li className={styles.li}>
                <p>Sandra Moraga</p>
              </li>
              <li className={styles.li}>
                <p>Octavio Moraga</p>
              </li>
              <li className={styles.li}>
                <p>Santos Yescas</p>
              </li>
            </ul>
          </fieldset>
        </div>

        <div className={styles.container2}>
          <div className={styles.child1}>
            <div>
              <Image
                width={370}
                height={300}
                src={AboutUsImagetwo}
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
                className={styles.koryJpg}
                width={370}
                height={307}
                src={AboutUsImagethree}
                alt={"text"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
