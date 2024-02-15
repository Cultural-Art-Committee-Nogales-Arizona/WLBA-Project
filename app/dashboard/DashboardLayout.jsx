import styles from './DashboardLayout.css'
import Sidebar from '@/components/Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      Hello world!
      {children}
    </div>
  );
};

export default DashboardLayout;
