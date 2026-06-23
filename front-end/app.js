const API='https://tcftelecom-atendimentos-production.up.railway.app';
async function entrar(){
 const login=document.getElementById('login').value;
 const senha=document.getElementById('senha').value;
 const r=await fetch(API+'/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({login,senha})});
 if(!r.ok){alert('Login inválido');return;}
 document.getElementById('login-screen').style.display='none';
 document.getElementById('app').style.display='block';
}