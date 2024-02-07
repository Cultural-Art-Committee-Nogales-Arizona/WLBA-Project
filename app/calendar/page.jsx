'use client';
import React from 'react';
import styles from './page.module.css'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Calendar from '@/components/Calendar'

export default withPageAuthRequired(function CSRPage() {
	return (
		<>
			<div className={styles.container} data-testid="csr">
				<Calendar />
			</div>
		</>
	);
});
