import React from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import styles from "./page.module.css";
import Highlight from "@/components/Highlight";
import Image from 'next/image'
import AboutUsImage from '@/public/Images/aboutUs.jpg'

export default function aboutUs() {
  return (
    <div>
      <Image
        className={styles.bannerImage} 
        src={AboutUsImage}
        alt={"Banner"}
        width={1690}
        height={300}
      />
      <div className={styles.header} >
        <div className={styles.auc}>About us</div>
        Established in 2014 as a non-profit organization, the Cultural Arts
        Committee of Nogales, Arizona, has been busy creating events that bring
        the community together. We've hosted all sorts of things, from concerts
        and mariachi festivals to art workshops for kids and nativity
        exhibitions. In collaboration with the City of Nogales and the Consulate
        of Mexico, our programs cover a wide range, including scholarship
        initiatives, talks for Women’s Week, and even a binational marathon.
        What makes it all happen? Our dedicated team of volunteers. The Board of
        Directors, made up of community members, including the former Consul
        General of Mexico, and local business leaders, helps steer the ship.
        We're all about supporting and celebrating our community.
      </div>

      <div className={styles.bod}>
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
    </div>
  );
}
