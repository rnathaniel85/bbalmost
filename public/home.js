function Home() {
  // Set State and User Context
  const [show, useShow] = React.useState(true);
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
  });
  


  return (
    <Card
      bgcolor="light"
      txtcolor="dark"
      header={
        <>
          <table className="table table-borderless">
          <thead>
            <tr>
              <th>
                <h3>
                  <i className="fas fa-university fa-2x"></i> Welcome to Bad Bank
                </h3>
              </th>
            </tr>
            </thead>
          </table>
        </>
      }
      title=" Welcome to our bank, we appreciate you doing business with us.
      Please deposit money by login / create a new account."

      // txtcolor="black"
      // header="BadBank Landing Module"
      // title="Welcome to the bank"
      // text="You can move around using the navigation bar."
      // body={<img src="bank.png" className="img-fluid" alt="Responsive image" />}
    />
  );
}
