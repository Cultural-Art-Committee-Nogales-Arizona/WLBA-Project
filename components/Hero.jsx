import React from 'react';
import Image from 'next/image'

import styles from './Hero.module.css'

const Hero = ({ params }) => {
  const { heroImage } = params

  return (
    <div className={styles.hero}>
      <Image
        width={1519}
        height={650}
        src={heroImage}
        alt={"text"}
        className={styles.Img}
      />
    </div>
  )
}

export default Hero;
