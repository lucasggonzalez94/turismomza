import styles from './Spinner.module.css';

const Spinner = () => {
  return (
    <div className="w-full flex flex-col flex-grow justify-center items-center gap-3">
      <div className={styles['sk-cube-grid']}>
        <div className={`${styles['sk-cube']} ${styles['sk-cube1']}`}></div>
        <div className={`${styles['sk-cube']} ${styles['sk-cube2']}`}></div>
        <div className={`${styles['sk-cube']} ${styles['sk-cube3']}`}></div>
        <div className={`${styles['sk-cube']} ${styles['sk-cube4']}`}></div>
        <div className={`${styles['sk-cube']} ${styles['sk-cube5']}`}></div>
        <div className={`${styles['sk-cube']} ${styles['sk-cube6']}`}></div>
        <div className={`${styles['sk-cube']} ${styles['sk-cube7']}`}></div>
        <div className={`${styles['sk-cube']} ${styles['sk-cube8']}`}></div>
        <div className={`${styles['sk-cube']} ${styles['sk-cube9']}`}></div>
      </div>
      <span>Cargando...</span>
    </div>
  );
};

export default Spinner;
