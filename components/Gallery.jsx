import React from 'react';
import Image from "next/image";
import TitleImg from "@/public/Images/BackgroundImg.jpg";
import Logo from '@/public/whiteLogo';
import styles from './Hero.module.css'

export default function Gallery() {
  /* --------------- This is just a placeholder for the gallery --------------- */
  <div className="hero my-5 text-center" data-testid="hero">
    <Logo scale="340" testId="hero-logo" />
    <Image
      width={1000}
      height={500}
      src={TitleImg}
      alt={"text"}
      className={styles.Img}
    />
  </div>
}
