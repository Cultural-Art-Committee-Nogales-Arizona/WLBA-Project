import React from 'react';
import Image from "next/image";
import TitleImg from "@/public/Images/BackgroundImg.jpg";
import Logo from '@/public/whiteLogo';
import styles from './Hero.module.css'

const Hero = () => (
  <div className="hero my-5 text-center" data-testid="hero">
    <div className={styles.mainDiv}>
      <Image
        width={1500}
        height={500}
        src={TitleImg}
        alt={"text"}
        className={styles.Img}
      />
    </div>
  </div>
);

export default Hero;
