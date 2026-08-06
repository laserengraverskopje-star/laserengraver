window.addEventListener('load',()=>document.body.classList.add('loaded'));
document.addEventListener('DOMContentLoaded',()=>{
const b=document.getElementById('contactBtn');
const m=document.getElementById('contactModal');
const c=document.getElementById('closeContact');
if(b){b.onclick=(e)=>{e.preventDefault();m.classList.add('active');};}
if(c){c.onclick=()=>m.classList.remove('active');}
if(m){m.onclick=(e)=>{if(e.target===m)m.classList.remove('active');}}
});
