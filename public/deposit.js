function Deposit(){

  const [show, setShow]      = React.useState(false);
    const [status, setStatus]  = React.useState('');
    const [email, setEmail]    = React.useState('');
    const currentUser          = React.useContext(UserContext);

    // Get Current Authentication Status
    auth.onAuthStateChanged((userCredential) => {
      if (userCredential) {
          // If the user is logged in...
          console.log("Deposit Page Current User: ");
          console.log(userCredential);
          currentUser.user = userCredential;
          console.log(`Current Email: ${currentUser.user.email}`);
          console.log(`Current UID: ${currentUser.user.uid}`);
          setEmail(currentUser.user.email);
      } else {
          // If the user is logged out...
          setShow(true);
          console.log("No User Logged In");
          currentUser.user = {};
      }
  });

  return (
    <Card
      bgcolor = "light"
      txtcolor = "dark"
      header= {
        <>
           <table className="table table-borderless">
                    <thead>
                        <tr>
                        <th><h3>Deposit</h3></th>
                        <th className="text-right">
                            <div className = "text-dark"> {show ? 
                            <>No Active User</> :
                            <>{email}</>} 
                            </div>
                            </th>
                        </tr>
                    </thead>
                </table>
        </>
      }
      status={status}
      body  = {<DepositForm  setShow={setShow} setStatus={setStatus}/>}
    />
  )
}

function DepositMsg(props){
  return (<>
    <h5>Success</h5>
    <button type="submit" 
      className="btn btn-light" 
      onClick={() => {
          props.setShow(true);
          props.setStatus('');
      }}>
        Deposit again
    </button>
  </>);
} 




function DepositForm(props){

  const [balance, setBalance]    = React.useState(0);
  const [deposit, setDeposit]    = React.useState('');
  const [disabled, setDisabled]  = React.useState(true);
  const currentUser            = React.useContext(UserContext);


   // Get the user balance before deposit
   const url = `/account/getbalance/${currentUser.user.uid}`;
  (async () => {
      // Sending the data to server and then awaiting the response
      var res   =  await fetch(url);
      var data  =  await res.json();
      console.log(data[0].balance);
      setBalance(data[0].balance);
  })();


   // Determining if deposit button should be disabled
   if (!deposit) {
		//Check if button should be enabled
		if (disabled) {
			console.log(disabled);
			console.log(`button disabled ${disabled}`);
		} else {
			setDisabled(true);
			console.log(`button disabled ${disabled}`);
		}
	} else {
		if (disabled) {
			setDisabled(false);
            console.log(`button disabled ${disabled}`);
            console.log(deposit);
		} else {
            console.log(`button disabled ${disabled}`);
            console.log(deposit);
		}
  }

  // function to deposit money
  function handle(){

    if((deposit !== "") && Number(deposit) > 0)
     {
       // Setting up the new balance
       let newBalance  = Number(balance) + Number(deposit); // get the current balance + desposit = new balance
       console.log(newBalance);

       // make a database call
       var url = `/account/updateuserbalance/${currentUser.user.uid}/${newBalance }`;
      (async () => {
          // Sending the data to server and then awaiting the response
          var res   =  await fetch(url);
          var data  =  await res.json();
          console.log(data);
            
          //'/account/changeactivity/:userID/:activityDate/:activityType/:activityAmount/:newBalance'
          // // Sending the updated activity to the server
          // var date = moment(new Date()).format('MM-DD-YYYY');
          // var time =moment(new Date()).format('HH:mm A');
          var depositDateTime = moment(new Date()).format('MM/DD/YYYY HH:mm A');
          ///account/changeactivity/:userID/:activityDateTime/:activityType/:activityAmount/:activityBalance
          const activityUrl = `/account/changeactivity/${currentUser.user.uid}/${depositDateTime}/${newBalance}`;
          (async () => {
              // Sending the activity to the server
              var activityRes  = await fetch(activityUrl);
              var activityData = await activityRes.json();
              //console.log(activityData);
          })();

          // Setting the balance
          setBalance(newBalance);
          setDeposit('');

          // show success message
          CustomToastMessage('success', 'top', 'validation', '5000').fire({
            animation: false,
            title: 'You successfully deposit ' + Number(deposit).toLocaleString("en-US",{style: "currency", currency: "USD"})
          });
         
      })();
     }
  }

  return(
    <>
    <h3>Current Balance: {Number(balance).toLocaleString("en-US",{style: "currency", currency: "USD"})}</h3><br/>
    <h5>Deposit Amount:</h5>
    <input 
        type="input" 
        className="form-control" 
        id="deposit" 
        placeholder="Deposit Amount" 
        value={deposit}
        onkeypress={e => validate(e.currentTarget.value)} 
        onChange={e => setDeposit(e.currentTarget.value)}/><br/>
        {disabled ? (
            <><button type="submit" className="btn btn-dark" disabled="disabled" onClick={handle}>Deposit</button></>
        ):(
            <><button type="submit" className="btn btn-dark" onClick={handle}>Deposit</button></>
        )}
    </>
  );
}