
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
          return action.payload;
       
        }
        case "GET_SELECTED_PROFILE":
        {
        
          if(action.error){
            return state;
          }
          console.log("Data inside reducer",action);
          return action.payload.data.userProfile
        }
      
    }
    
    return state;
  }
  