'use client';
import React from 'react';
import styles from './page.module.css'
import Calendar from '@/components/Calendar'

export default function CSRPage() {
	return (
		<>
			<div className={styles.container} data-testid="csr">
				<Calendar />
			</div>
		</>
	);
}
