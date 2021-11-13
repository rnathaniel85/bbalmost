function Login(){
  const [show, setShow]      = React.useState(true);
  const [status, setStatus]  = React.useState('');
  const [email, setEmail]    = React.useState('');
  const currentUser          = React.useContext(UserContext);


 // Get Current Authentication Status
 auth.onAuthStateChanged((userCredential) => {
  if (userCredential) {
      setShow(false);
      console.log("Login Page Current User: ");
      console.log(userCredential);
      currentUser.user = userCredential;
      console.log(`Current Email: ${currentUser.user.email}`);
      console.log(`Current UID: ${currentUser.user.uid}`);
      console.log("End Initializing");
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
      bgcolor="light"
      txtcolor = "dark"
      header={
        <>
        <table className="table table-borderless">
            <thead>
                <tr>
                <th><h3>Login</h3></th>
                <th className="text-right">
                    <div className="text-dark"> {show ?
                       <> No active User </> : <>{email}</>
                      }
                    </div>
                    </th>
                </tr>
            </thead>
        </table>
        </>
      }
      status = {status}
      body   = {show ? 
        <LoginForm        setShow={setShow} setStatus={setStatus}/> :
        <OnLoginLogOutMsg setShow={setShow} setStatus={setStatus}/>}
    />
  ) 
}

function OnLoginLogOutMsg(props){

   // Current User Context
   const currentUser = React.useContext(UserContext);

  // Logout function
  function LogOut(){
      // Using firebase api auth
      firebase.auth().signOut()
      .then(() =>{
        CustomToastMessage('success', 'top', 'validation', '10000').fire({
          animation: false,
          title: 'You have signed out successfully'
        });
        props.setShow(true);
        setTimeout(() => props.setStatus(''), 4000);  
      
      })
      .catch((error) =>{
        props.setStatus(false);
        setTimeout(() => props.setStatus(''), 4000);  
      });
  }



  // upon login show the user the following
  return(
  <>



  <p className="lead">Make a selection</p>
  <ul className="list-unstyled list-unstyled-py-2">
  <li><a href='#/alldata/' data-toggle="tooltip" title="Transaction History">Transaction History</a></li>
  <li><a href='#/deposit/' data-toggle="tooltip" title="Make a Deposit">Make a Deposit</a></li>
  <li><a href='#/withdraw/' data-toggle="tooltip" title="Make a Withdrawal">Make a Withdrawal</a></li>
</ul>
  
    <button 
     type       =  "submit" 
     className  = "btn btn-dark" 
     onClick    = {LogOut} >
       Log Out
    </button>
  </>);
}

function LoginForm(props){
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');
  const [disabled, setDisabled] = React.useState(true);
  const currentUser             = React.useContext(UserContext);


  // Determine if to set the button disabled or not
	if (!password || !email) {
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
		} else {
			console.log(`button disabled ${disabled}`);
		}
	}

  

  function HandleLogin(props){

  
 // Login with firebase , returns a promise
 auth.signInWithEmailAndPassword(email,password)
    .then((userAuth) =>
    {
      console.log('Signed in successfully');
      console.log('User Credentails: ' + JSON.stringify(userAuth));
      
      // assign the currect user
      currentUser.user = userAuth;
      
      // display a toast message
      CustomToastMessage('success', 'top', 'validation', '10000').fire({
        animation: false,
        title: 'Signed in successfully!'
      });

      props.setStatus("Signed in successfully!");
      setTimeout(() => props.setStatus(''), 4000);
      setEmail('');
      setPassword(''); 
      
      

    })
    .catch((error) =>
    {
      // clear the input for re-authentication
      setEmail('');
      setPassword('');
      // Setting the status message
      props.setStatus(`Error Message: ${error.message}`);
      setTimeout(() => props.setStatus(''), 4000);  

      CustomToastMessage('error', 'top', 'validation', '10000').fire({
        animation: false,
        title: `Error Message: ${error.message}`
      });
    });

  }

  function LoginUsingGoogle(){

    console.log("Google clicked");
    var provider = new firebase.auth.GoogleAuthProvider();

    // var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then((authUser) => {
      //loggedInStatus.innerText = `You are logged in using the following email: ${result.user.email}`;

    })
    .catch(function (error) {
      console.log(error.code);
      console.log(error.message);
    });
  }

  return (<>
    <div className ="mb-4">
       <h5>Please Login with your infortion below:</h5>
    </div>


    Email Address<br/>
    <input type   = "input" 
      className   = "form-control" 
      placeholder = "Enter email" 
      value       = {email} 
      onChange    = {e => setEmail(e.currentTarget.value)}/><br/>

    Password<br/>
    <input type    = "password" 
      className    = "form-control" 
      placeholder  = "Enter password" 
      value        = {password} 
      onChange     = {e => setPassword(e.currentTarget.value)}/><br/>
    {
      disabled 
      ?
      (
        <button
        type       = "submit"
        className  = "btn btn-dark"
        disabled   = "disabled"
        onClick    = {HandleLogin}>
        Login
        </button>
      )
      :
      (
        <button
        type       = "submit"
        className  = "btn btn-dark"
        onClick    = {HandleLogin}>
        Login
        </button>
      )
    }
    &nbsp; or &nbsp;
    <a href='#/CreateAccount/' data-toggle="tooltip" className="btn btn-dark" title="Create an Account">Create Account</a>
  </>);
}

function CustomToastMessage(icon, position, title, timer) {
  return Swal.mixin({
      toast: true,
      icon: icon,
      title: title,
      animation: false,
      position: position,
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: true,
      didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
  });
}

function CustomMessage(message, icon, title) {
  Swal.fire({
      title: title,
      icon: icon,
      html: message,
      confirmButtonText: 'OK',
      buttonsStyling: false,
      customClass: {
          confirmButton: 'btn btn-primary btn-md',
          cancelButton: 'btn btn-danger btn-md',
          loader: 'custom-loader'
      },
      footer: "<a href='mailto:avihaihai737@gmail.com'>Need Help? Submit a ticket</a>"
  });
  return false;
}