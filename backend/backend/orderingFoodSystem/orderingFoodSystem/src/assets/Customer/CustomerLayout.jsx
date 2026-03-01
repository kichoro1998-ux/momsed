import { Outlet } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar.jsx';

export default function CustomerLayout() {
  return (
    <>
      <CustomerNavbar />
      <div style={{
        paddingTop: "80px",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa"
      }}>
        <div className="container-fluid px-2 px-md-3">
          <Outlet />
        </div>
      </div>
    </>
  );
}
