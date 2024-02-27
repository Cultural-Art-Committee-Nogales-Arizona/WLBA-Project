import Image from 'next/image'
import styles from './DirectorImage.module.css'



export default function DirectorImage({ params }) {
  const { profileImage, name, position } = params

  return (
    <div className={styles.directorImage}>
      <Image 
        src={profileImage}
        width={300}
        height={400}
        alt='Director Member headshot'
      />
      <div className={styles.information}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.position}>{position}</p>
      </div>
    </div>
  )
} 