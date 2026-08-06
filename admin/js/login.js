const USERNAME="sharkylive";
const PASSWORD="SharkyLive@50";
if(location.pathname.endsWith("dashboard.html")){
 if(sessionStorage.getItem("adminLogged")!=="true"){
   location.href="login.html";
 }
}
function login(){
 const u=document.getElementById("username").value.trim();
 const p=document.getElementById("password").value;
 const e=document.getElementById("error");
 if(u===USERNAME && p===PASSWORD){
   sessionStorage.setItem("adminLogged","true");
   location.href="dashboard.html";
 } else {
   e.textContent="Погрешно корисничко име или лозинка.";
 }
}
function logout(){
 sessionStorage.removeItem("adminLogged");
 location.href="login.html";
}
