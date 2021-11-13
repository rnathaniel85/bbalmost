function CreateAccount() {
  // Set State and User Context
  const [show, setShow] = React.useState(true); // setShow is to decide whether we show the createForm / CreateMsg
  const [status, setStatus] = React.useState(""); // setStatus to keep track of the message that we are setting within our user component
  const [email, setEmail] = React.useState("");
  const currentUser = React.useContext(UserContext);


 // Get Current Authentication Status
 auth.onAuthStateChanged((userCredential) => {
  if (userCredential) {
      setShow(false);
      // If the user is logged in...
      console.log("Login Page Current User: ");
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


  // return of new account
  return (
    <Card
      bgcolor  = "light"
      txtcolor = "dark"
      header   = {
      <>
      <table className="table table-borderless">
        <thead>
          <tr>
            <th><h3>Create Account</h3></th>
          </tr>
        </thead>
      </table>
      </>
      }
      status = {status}
      body   = { show ? 
      (<CreateForm setShow={setShow} setStatus={setStatus} />): 
      (<CreateMsg setShow={setShow}  setStatus={setStatus}/>)}
    />
  );
}




// Component - create message (when we submit a new user that is created, we will show the create message)
// Show a message and display a button to create another user account.
// if the user click on the create a new account we setShow=true, means that we'll load the create form component.
function CreateMsg(props) {
  // Get the current user context
  const currentUser = React.useContext(UserContext);

  // Logout function
  function LogOut(){
    // Using firebase api auth
    firebase.auth().signOut()
    .then(() =>{
      CustomToastMessage('success', 'top', 'validation', '10000').fire({
        animation: false,
        title: 'You have signed out successfully.'
      });
      props.setShow(true);
      setTimeout(() => props.setStatus(''), 4000);  
    
    })
    .catch((error) =>{
      props.setStatus(false);
      setTimeout(() => props.setStatus(''), 4000);  
    });
   }

 

  return (
    <>
      <h5>You are currently logged in as {currentUser.user.email}!</h5>
      <p className="lead">Make a selection</p>
      <ul className="list-unstyled list-unstyled-py-2">
        <li><a href='#/alldata/' data-toggle="tooltip" title="Transaction History">Transaction History</a></li>
        <li><a href='#/deposit/' data-toggle="tooltip" title="Make a Deposit">Make a Deposit</a></li>
        <li><a href='#/withdraw/' data-toggle="tooltip" title="Make a Withdrawal">Make a Withdrawal</a></li>
      </ul>
      <button
        type      =  "submit"
        className =  "btn btn-dark"
        onClick={LogOut}>
        Log Out
      </button>
    </>
  );
}



// Component - create form
function CreateForm(props) {
  const [name, setName]         = React.useState("");
  const [email, setEmail]       = React.useState("");
  const [password, setPassword] = React.useState("");
  const [disabled, setDisabled] = React.useState(true);
  const currentUser             = React.useContext(UserContext);


  // validation if the fields are filled up , otherwise keep the create account button disabled.
  if (!name || !password || !email) {
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

 
  // push a new user into the context.
  function handle() {
    console.log(name, email, password);

   // Creating the new user
   auth.createUserWithEmailAndPassword(email,password)
   .then((userAuth) => {

    const url = `/account/create/${name}/${email}/${password}/${userAuth.user.uid}`;
    (async () => {
        // Sending the data to server and then awaiting the response
        var res   =  await fetch(url);
        var data  =  await res.json();
        console.log(data);
    })();

    CustomToastMessage('success', 'top', 'validation', '10000').fire({
      animation: false,
      title: 'Account has successfully been created for: ' + email
    });
     setShow(true);
   })
    .catch((error) => {    
      // error while signing in
      var errorMessage = `Error Message: ${error.message}`;
      console.log(errorMessage);
      props.setStatus(errorMessage);
      setTimeout(() => props.setStatus(''), 4000);    
      // Clear the user inputs
      setEmail('');
      setPassword('');
   })
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

  // return the create account form
  return (
    <>
    <div className ="mb-4">
       <h5>Please provide the following information:</h5>
    </div>
    Name<br />
    <input
      type        = "input"
      className   = "form-control"
      placeholder = "Enter Name"
      value       = {name}
      onChange    = {(e) => setName(e.currentTarget.value)}
    />
    <br/>
   Email address <br />
    <input
       type        = "input"
       className   = "form-control"
       placeholder = "Enter Email"
       value       = {email}
       onChange    = {(e) => setEmail(e.currentTarget.value)}
    /> <br/>
    Password <br />
    <input
       type        = "password"
       className   = "form-control"
       placeholder = "Enter Password"
       value       = {password}
       onChange    = {(e) => setPassword(e.currentTarget.value)}
    />
     <br/>
    <br />
    { 
     disabled ?
      (
     <button 
        type           = "submit"
        disabled       = "disabled"
        className      = "btn btn-dark" 
        onClick        = {handle}>
        Create Account
     </button>
     ) : (
      <button 
        type           = "submit" 
        className      = "btn btn-dark" 
        onClick        = {handle}>
         Create Account
      </button>
     )
    }  
    &nbsp; or &nbsp; 
    <a
        type           = "submit"
        className      = "btn btn-dark" href="#/Login">
       Login
    </a>
   
  </>
  )
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
      footer: "<a href='mailto:itsupport@caseglobal.com'>Need Help? Submit a ticket</a>"
  });
  return false;
}