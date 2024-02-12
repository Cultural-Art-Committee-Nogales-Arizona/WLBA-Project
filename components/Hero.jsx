import React from 'react';
import Image from "next/image";
import TitleImg from "@/public/Images/BackgroundImg.jpg";
import Logo from '@/public/Logo';
import styles from './Hero.module.css'

const Hero = () => (
  <div className="hero my-5 text-center" data-testid="hero">
    <div className={styles.mainDiv}>
      <Image
        width={1500}
        height={650}
        src={TitleImg}
        alt={"text"}
        className={styles.Img}
      />
      <Logo scale="75" className={styles.logo} />
    </div>
  </div>
);

export default Hero;
