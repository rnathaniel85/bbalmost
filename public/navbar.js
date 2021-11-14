function NavBar(){
  const userLocal = JSON.parse(localStorage.getItem('user'));
  const { isLoggedIn, setIsLoggedIn } = React.useContext(AuthContext);
  const { user, updateUser } = React.useContext(UserContext);
  const email = user.user.email
  
  function handleLogout(){
    console.log("Logout")
    return fetch(`/account/logout/${email}`)
    .then(response => response.text())
    .then(text => {
        console.log("logged out"+ email)
        console.log(text);
        setIsLoggedIn(false)
        updateUser(guestUser)                
    });
  }

  return(
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">BadBank</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          { isLoggedIn ? null : 
            <li className="nav-item">
              <a className="nav-link" href="#/CreateAccount/">Create Account</a>
            </li>
          }          
          { isLoggedIn ? null : 
            <li className="nav-item">
              <a className="nav-link" href="#/login/">Login</a>
            </li>
          }
          { !isLoggedIn ? null : 
          <>
          <li className="nav-item">
            <a className="nav-link" href="#/deposit/">Deposit</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#/withdraw/">Withdraw</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#/balance/">Balance</a>
          </li>
          
            <li className="nav-item">
            <a className="nav-link" href="#/alldata/">AllData</a>
            </li>
            <li className="nav-item">
            <a className="nav-link" href="#/" onClick={handleLogout}>Logout</a>            
            
            </li> 
            
            
          </>         
          }
          
        </ul>
      </div>
    </nav>

  );
}
