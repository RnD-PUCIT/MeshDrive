export const rootURL = "http://localhost:3000/"; // "http://mohsina.li/showcase/meshdrive/";

const ngrokUrl = localStorage.getItem("ngrok");

export const apiBaseUrl = ngrokUrl
  ? ngrokUrl
  : "http://test-depositoryworks.ngrok.io";

export const apiRoutes = {
  users: {
    // method GET
    /*
      Request : URL/users/
      Method : GET
      To get all users
    */

    /*

        Request : URL/users/( : _id)
        Method : DELETE
        To delete a user
    */
    /*

        Request : URL/users/edit/( : _id)
        body : [ {propName ,value} . . . . ]
        Method : PUT
        To edit a user
    */

    /*
      Request : URL/users/forgotPassword/:email
      Method : GET
      To send forgot password email
    */
    forgotPassword: email => `${apiBaseUrl}/users/forgotPassword/${email}`,

    /*
        Request : URL/applyResetPassword/:_id"
        body : {newPassword :"password"}
        Method : POST
        To edit a user
    */
    resetPassword: id => `${apiBaseUrl}/users/resetPassword/${id}`,

    applyResetPassword: id => `${apiBaseUrl}/users/applyResetPassword/${id}`,

    /*
        Request : URL/users/login
        query : {email,password}
        Method : POST
        To login user
    */
    login: `${apiBaseUrl}/users/login`,

    /*

        Request : URL/users/
        body : {email,password,name}
        Method : POST
        To register and verify a user
    */
    signup: `${apiBaseUrl}/users`,

    authGoogleDrive: `${apiBaseUrl}/GoogleDrive/Authenticate`,

    listDriveAccounts: token =>
      `${apiBaseUrl}/users/ListDriveAccounts/${token}`,
    removeAllGoogleAccounts: `${apiBaseUrl}/GoogleDrive/RemoveAllGoogleAccounts/`,
    removeGoogleAccountByEmail: `${apiBaseUrl}/GoogleDrive/RemoveGoogleAccountByEmail`
  },
  files: {
    listGoogleDriveRootFiles: `${apiBaseUrl}/GoogleDrive/ListDriveRootFiles`,
    listGoogleDriveFiles: `${apiBaseUrl}/GoogleDrive/ListDriveFiles`,
    listDriveFilesById: `${apiBaseUrl}/GoogleDrive/ListDriveFilesById`,
    downloadFile: (downloadFileAccount, fileId, token) =>
      `${apiBaseUrl}/GoogleDrive/DownloadFile/${downloadFileAccount}/${fileId}/${token}`,
    uploadFile: (fileName, mimeType, uploadFileEmail, token) =>
      `${apiBaseUrl}/GoogleDrive/UploadFile/${fileName}/${mimeType}/${uploadFileEmail}/${token}`
  }
};