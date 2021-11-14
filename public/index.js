function Spa() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const value = { isLoggedIn, setIsLoggedIn };
  const [user, updateUser] = React.useState(guestUser);
  const value2 = {user, updateUser}

  return (
    <HashRouter>
      <div>        
      <AuthContext.Provider value={value}>
        <UserContext.Provider value={value2}>
          <NavBar/>
          <div className="container" style={{padding: "20px"}}>
            <Route path="/" exact component={Home} />
            <Route path="/CreateAccount/" component={CreateAccount} />
            <Route path="/login/" component={Login} />
            <Route path="/deposit/" component={Deposit} />
            <Route path="/withdraw/" component={Withdraw} />
            {/* <Route path="/transactions/" component={Transactions} /> */}
            <Route path="/balance/" component={Balance} />
            <Route path="/alldata/" component={AllData} />
            {/* <Route path="/logout/" component={Logout} /> */}
          </div>
        </UserContext.Provider>
        </AuthContext.Provider>
      </div>
    </HashRouter>
  );
}

ReactDOM.render(
  <Spa/>,
  document.getElementById('root')
);