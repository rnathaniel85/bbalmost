function AllData() {
  const [show, setShow]      = React.useState(true);
  const [data, setData] = React.useState("");
  const [status, setStatus]  = React.useState('');
  const [email, setEmail]    = React.useState('');
  const currentUser          = React.useContext(UserContext);


  auth.onAuthStateChanged((userCredential) => {
    if (userCredential) {
        setShow(false);
        // If the user is logged in...
        console.log("Login Page Current User: ");
        console.log(userCredential);
        currentUser.user = userCredential;
        console.log(`Current Email: ${currentUser.user.email}`)
        console.log(`Current UID: ${currentUser.user.uid}`);
        console.log("End Initializing");
    } else {
        // If the user is logged out...
        setShow(true);
        console.log("No User Logged In");
        currentUser.user = {};
    }
  });
  

  return (
    <Card
      bgcolor="light"
      txtcolor="dark"
      header={
        <>
          <h3>
            <table className="table table-borderless">
              <thead>
                <tr>
                  <th>Account History</th>
                  <th className="text-right">
                    <div className="badge bg-light text-dark">
                      {" "}
                      {show ? <>No Active User</> : <>{email}</>}
                    </div>
                  </th>
                </tr>
              </thead>
            </table>
          </h3>
        </>
      }
      status={status}
      body= {
        show ?
        <LoginMsg setShow={show} setStatus={status}  /> :
        <AccountHistory  setShow={setShow} setStatus={setStatus}/>
        }
      
    />
  );
}


// Display the account history upon login
function AccountHistory(props){

  const [name, setName]                      = React.useState('');
  const [balanceTime, setBalanceTime]        = React.useState('');
  const [balance, setBalance]                = React.useState(0);
  const [accountHistory, setAccountHistory]  =  React.useState('');
  const currentUser                          = React.useContext(UserContext);

  if(!accountHistory){
    // make a database call and fetch user history
    const url = `/account/getbalance/${currentUser.user.uid}`;
    (async () => {
     
      var elements = [];

      // Sending the data to server and then awaiting the response
      var res   =  await fetch(url);
      var data  =  await res.json();
      console.log(data);
      console.log(data[0].balance);
      setBalance(data[0].balance);
      setName(data[0].name);

      // Create account history - userId, amount, balance ,activityDateTime, ActivityType
      for (const {activityDateTime, activityType, amount, balance} of data.activity) {
        elements.unshift(
          <tr>
              <td className="text-justify">{activityDateTime}</td>
              <td className="text-justify">{activityType}</td>
              <td className="text-right">{Number(amount).toLocaleString("en-US",{style: "currency", currency: "USD"})}</td>
              <td className="text-right">{Number(balance).toLocaleString("en-US",{style: "currency", currency: "USD"})}</td>
          </tr>);
      }

      // Getting the account creation time
      //setBalanceTime(currentUser.user.metadata.creationTime);

      // Setting the table html
      setAccountHistory(elements);
      // Printing the results
      console.log(elements);
      })(); 
  }
   

  return(
    <>
    <h3>User Info:</h3>
    <table className="table">
        <thead>
            <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Current Balance</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{name}</td>
                <td>{currentUser.user.email}</td>
                <td>{Number(balance).toLocaleString("en-US",{style: "currency", currency: "USD"})}</td>
            </tr>
        </tbody>
    </table>
    <h3>User Activity:</h3>
    <table className="table">
        <thead>
            <tr>
            <th scope="col" className="text-justify">Activity Date Time</th>
            <th scope="col" className="text-justify">Activity Type</th>
            <th scope="col" className="text-right">Amount</th>
            <th scope="col" className="text-right">Balance</th>
            </tr>
        </thead>
        <tbody>{accountHistory}</tbody>
    </table>
    </>
  );
}
function LoginMsg(props){
  // Return the success screen
  return(
      <>
      There is currently no user logged in. Please log in and return to this page.<br/><br/>
      <a href='#/login/' className="btn btn-dark" data-toggle="tooltip" title="Login with your existing account credentials">Login</a>
              &nbsp;
              or 
              &nbsp;
      <a href="#/createaccount/" className="btn btn-dark" data-toggle="tooltip" title="Create a new account to start using this banking site">Create Account</a>
      </>
  );
}



