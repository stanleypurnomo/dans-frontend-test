import { useState, useEffect } from 'react';
import { GoogleLogin, GoogleOAuthProvider, googleLogout } from '@react-oauth/google';
import { Button } from 'reactstrap';

function HeaderLoginGoogle() {
  const [isLogin, setIsLogin] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  };

  useEffect(() => {
    if(localStorage.getItem('userInfo')){
      setUserInfo(JSON.parse(localStorage.getItem('userInfo')))
    } else {
      setUserInfo([])
    }
  }, [true]);

  return (
    <div className='container-fluid' style={{ background:'#2196f3' }}>
      {
        localStorage.getItem('isLogin') === 'true' || isLogin
        ?
        <div className='row'>
          <div className='col-8 text-start'>
            <img src="/github-jobs.png" style={{ height:80 }}/>
          </div>
          <div className='col-3 text-end m-auto'>
            {
              userInfo.name && userInfo.email
              ?
              <div className='row'>
                <div className='col offset-4'>
                    <img src={userInfo.picture} style={{ maxHeight:50, borderRadius:50 }}/>
                </div>
                <div className='col text-center'>
                  <p className='mx-auto mb-0' style={{ lineHeight:'50px', color:'white' }}>{userInfo.name.length > 9 ? userInfo.name.substring(0,9)+'...' : userInfo.name}</p>
                </div>
              </div>
              :
              null
            }
          </div>
          <div className='col-1 m-auto'>
            <Button color='danger' onClick={()=>{ setIsLogin(!isLogin); localStorage.setItem('isLogin','false'); window.location.reload(); }}>Logout</Button>
          </div>
        </div>
        :
        <div className='row'>
          <div className='col-9 text-start'>
            <img src="/github-jobs.png" style={{ height:80 }}/>
          </div>
          <div className='col-2 text-center m-auto'>
              <GoogleOAuthProvider clientId="408165266973-n50cjnu5237shi0o78mgj89of5kpu799.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={credentialResponse => {
                  console.log(credentialResponse);
                  console.log(parseJwt(credentialResponse.credential));
                  localStorage.setItem('isLogin','true')
                  localStorage.setItem('userInfo',JSON.stringify(parseJwt(credentialResponse.credential)))
                  setIsLogin(!isLogin)
                  setUserInfo(parseJwt(credentialResponse.credential))
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      }
    </div>
  );
}

export default HeaderLoginGoogle;