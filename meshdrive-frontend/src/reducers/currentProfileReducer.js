
let initialUserState = {
    id:null,
    email:null,
    name:null,
    driveAccountsList: {
      googleDriveAccountsList: [],
      dropboxAccountsList: [],
      oneDriveAccountsList: []
    },
    followers:[],
    following:[],
    date_created:null,
    shared_content :[]
  };

  export default function(state = initialUserState, action){
    
    switch (action.type)
    {
        case "GET_SELF_PROFILE" :
        {
          console.log("catched Action")
          console.log(action.payload);
          
          return action.payload;
        }
    }
    return state;
  }
  