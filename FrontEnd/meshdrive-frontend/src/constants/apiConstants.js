export const apiBaseUrl = "https://7a30b549.ngrok.io";
export const apiRoutes = {
  forgotPassword: email => `${apiBaseUrl}/users/forgotPassword/${email}`,
  resetPassword: id => `${apiBaseUrl}/users/resetPassword/${id}`
};
