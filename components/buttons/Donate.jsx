import styles from './Donate.module.css'
export default function Donate() {
    const handleButtonClick = () => {
        window.open("https://buy.stripe.com/eVa6ptaH472hgkE000", "_blank");
    };

    return (
        <button onClick={handleButtonClick} target="_blank" className={styles.button}>
            Donate
        </button>
    )
}