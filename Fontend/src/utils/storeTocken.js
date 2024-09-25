const handleRefreshToken = async (data) => {
    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };
  
  export default handleRefreshToken;
  