function Withdraw(){

    // Setting up some state and context variables
    const [show, setShow]      = React.useState(true);
    const [status, setStatus]  = React.useState('');
    const [email, setEmail]    = React.useState('');
    const currentUser          = React.useContext(UserContext);

    // Get Current Authentication Status
    auth.onAuthStateChanged((userCredential) => {
        if (userCredential) {
            setShow(false);
            console.log("Withdraw Page Current User: ");
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
    })

   // Returning the card for creating the Withdraw page
   return(
    <Card
        bgcolor  = "light"
        txtcolor = "dark"
        header   = {
            <>
            <table className="table table-borderless">
                <thead>
                    <tr>
                    <th><h3>Withdraw</h3></th>
                    <th className="text-right">
                        <div className = "text-dark"> {show ? 
                        <>No Active User</> :
                        <>{email}</>} 
                        </div>
                        </th>
                    </tr>
                </thead>
            </table>
            
            </>}
        status   = {status}
        body     = {show ?
            <WithdrawMsg setShow={setShow} setStatus={setStatus}/> :
            <WithdrawForm  setShow={setShow} setStatus={setStatus}/>}
    />
)
}

function WithdrawMsg(props){
  return(<>
    <h5>Success</h5>
    <button type="submit" 
      className="btn btn-light" 
      onClick={() => {
        props.setShow(true);
        props.setStatus('');
      }}>
        Withdraw again
    </button>
  </>);
}

function WithdrawForm(props){
  // Setting up the needed variables
  const [balance, setBalance]    = React.useState(0);
  const [withdraw, setWithdraw]    = React.useState('');
  const [disabled, setDisabled]  = React.useState(true);
  const currentUser            = React.useContext(UserContext);

 // Getting the date functions for user activity
    Date.prototype.today = function () { 
      return ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"-"+ this.getFullYear();}
    Date.prototype.timeNow = function () {
      return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();}
    var newDate = new Date();

    // Getting the user balance
    const url = `/account/getbalance/${currentUser.user.uid}`;
    (async () => {
      // Sending the data to server and then awaiting the response
      var res   =  await fetch(url);
      var userData  =  await res.json();
      console.log(userData[0].balance);
      setBalance(userData[0].balance);
    })();

    // Determining if withdraw button should be disabled
    if (!withdraw) {
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
          console.log(withdraw);
    } else {
          console.log(`button disabled ${disabled}`);
          console.log(withdraw);
    }
}


  function handle(){
    // Checking the withdraw is a number greater than 0 and that the balance is available
    //console.log(balance);
    //console.log(withdraw);
    if(!isNaN(withdraw) && Number(withdraw) > 0 && Number(balance) >= Number(withdraw)) {
        // Setting up the new balance
        let newBalance = Number(balance) - Number(withdraw);
        console.log(newBalance);
        // Setting the balance
        const url = `/account/updateuserbalance/${currentUser.user.uid}/${newBalance}`;
        (async () => {
            // Sending the data to server and then awaiting the response
            var res   =  await fetch(url);
            var data  =  await res.json();
            console.log(data);
            
            // Sending the updated activity to the server
            var date = `${newDate.today()}`;
            var time = `${newDate.timeNow()}`
            var type = 'Withdraw'
            console.log(date);
            console.log(time);



            
            const activityUrl = `/account/changeactivity/${currentUser.user.uid}/${depositDateTime}/${newBalance}`;
            (async () => {
                // Sending the activity to the server
                var activityRes  = await fetch(activityUrl);
                var activityData = await activityRes.json();
                console.log(activityData);
            })();

            // Setting the balance
            setBalance(newBalance);
        })();
        CustomToastMessage('success', 'top', 'validation', '5000').fire({
            animation: false,
            title: 'You successfully withdrew ' + Number(withdraw).toLocaleString("en-US",{style: "currency", currency: "USD"})
        });
        setWithdraw(''); 
    } else if (Number(withdraw) > Number(balance)) {
        CustomToastMessage('info', 'top', 'validation', '5000').fire({
            animation: false,
            title: 'The withdraw amount is greater than the current available balance which is: ' + Number(balance).toLocaleString("en-US",{style: "currency", currency: "USD"})
        });
        setWithdraw(''); 
    } else if (Number(withdraw) < 0) {
        CustomToastMessage('info', 'top', 'validation', '5000').fire({
            animation: false,
            title: 'The withdraw amount is less then the current balance'
        });
        setWithdraw(''); 
    } else {
        CustomToastMessage('info', 'top', 'validation', '5000').fire({
            animation: false,
            title: 'Invalid input, please try again!'
        });
        setWithdraw(''); 
    }
  }

  
  // Return the success screen
    return(
        <>
        <h3>Current Balance: {Number(balance).toLocaleString("en-US",{style: "currency", currency: "USD"})}</h3><br/>
        <h5>Withdraw Amount:</h5>
        <input 
            type="input" 
            className="form-control" 
            id="withdraw" 
            placeholder="Withdraw Amount" 
            value={withdraw}
            onChange={e => setWithdraw(e.currentTarget.value)}/><br/>
            {disabled ? (
                <><button type="submit" className="btn btn-dark" disabled="disabled" onClick={handle}>Withdraw</button></>
            ):(
                <><button type="submit" className="btn btn-dark" onClick={handle}>Withdraw</button></>
            )}
        </>
    );
}
