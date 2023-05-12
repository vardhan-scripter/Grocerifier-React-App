import Header from "./Header";
import { Outlet } from 'react-router-dom';

export default function Layout(props){
    return (
        <div className="App">
          <Header authourized={props.isUserAuthenticated} handleLogout={props.handleLogout} username={props.username} />
          <Outlet />
          <footer className="fixed-bottom py-4 bg-dark text-white-50">
            <div className="container text-center">
              <small>Copyright &copy; 2023, Grocerifier</small>
            </div>
          </footer>
        </div>
      );
}