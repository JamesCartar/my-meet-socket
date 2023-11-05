import firebase from 'firebase/compat/app';


// Function for accessing room data from Firebase
export const getRoomsData = (roomID) => {
    return new Promise((resolve, reject) => {
      try {
        const roomDatabaseRef = firebase.database().ref('/rooms');
        const roomRef = roomDatabaseRef.child(roomID);
  
        roomRef.on('value', (snapshot) => {
          if (snapshot.exists()) { 
            const retrievedData = snapshot.val();
            resolve(retrievedData); // Resolve the promise with the data
          } else {
            resolve(null); // Resolve with null if data doesn't exist
          }
        });
      } catch (error) {
        reject(error); // Reject the promise on error
      }
    });
  };
  
// Function for accessing user data from Firebase
export const getUsersData = async (userID) => {
    return new Promise((resolve, reject) => {
        try {
            const userDatabaseRef = firebase.database().ref('/users');
            const userRef = userDatabaseRef.child(userID);
    
            userRef.on('value', (snapshot) => {
                if(snapshot.exists()) {
                    const userRetrievedData = snapshot.val();
    
                    if(userRetrievedData) {
                        resolve(userRetrievedData);
                    };
                }
            })
        } catch (error) {
            reject(error); // Handle or propagate the error as needed
        }
    })
    
};