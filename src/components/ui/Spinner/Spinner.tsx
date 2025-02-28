'use client';

import styles from './Spinner.module.css';
import { useLoadingStore } from '@/store/loadingStore';

const Spinner = () => {
  const loading = useLoadingStore((state) => state.loading);

  if (!loading) return null;

  return (
    <div className="w-screen h-screen fixed flex flex-col flex-grow justify-center items-center gap-3 z-50 bg-black bg-opacity-50">
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
      <span className="text-white">Cargando...</span>
    </div>
  );
};

export default Spinner;
