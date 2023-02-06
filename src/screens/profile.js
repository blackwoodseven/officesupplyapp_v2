/** @jsxImportSource @emotion/react */
import { useAuth } from 'context/auth-context'
import '../App.css'

function Profile({ userParam }) {
   const user = userParam;
   // const { user } = useAuth();
   return (
      <section className="profile">
         <header className="header">
            <div className="details">
               <img src="images/profile.png" alt={user.Name} className="profile-pic" />
               <h1 className="heading">{user.Name}</h1>
               <h3 className="heading">{user.Email}</h3>
               <div className="location">
                  <p>Maharashtra, India</p>
               </div>
               <div className="stats">
                  <div className="col-4">
                     <h4>20</h4>
                     <p>Reviews</p>
                  </div>
                  <div className="col-4">
                     <h4>10</h4>
                     <p>Communities</p>
                  </div>
                  <div className="col-4">
                     <h4>100</h4>
                     <p>Discussions</p>
                  </div>
               </div>
            </div>
         </header>
      </section>
   )
}

export default Profile
