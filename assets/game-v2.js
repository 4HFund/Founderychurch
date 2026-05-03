import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = { apiKey: "AIzaSyB1aO-MszyfLTz11uru-IyRw2zIRCEuexU", authDomain: "blessing-basket.firebaseapp.com", projectId: "blessing-basket", storageBucket: "blessing-basket.firebasestorage.app", messagingSenderId: "558241052507", appId: "1:558241052507:web:4ba95c9dc1e6695e364c7e", measurementId: "G-8495PL9SH8" };
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const STORAGE_KEY = "blessingCatcherKingdomArcade_v5_juice_burst_store";
const NOMINATION_URL = "https://thefounderychurch.churchcenter.com/people/forms/1070525";

const LEVELS = [
 {id:"forge",name:"Foundery Forge",icon:"🔥",price:0,theme:"theme-forge",color:"#f5b700",coinMultiplier:1,badChance:.36,speedMod:1,good:[["Prayer","🙏"],["Hope","🌟"],["Grace","✨"],["Kindness","🤝"],["Love","❤️"],["Forgiveness","🕊️"],["Encouragement","💬"]],bad:[["Gossip","🗣️"],["Fear","😨"],["Stress","😖"],["Anger","😡"],["Negativity","🌧️"]],description:"The classic ChurchBuilt blessing run."},
 {id:"kloset",name:"Kenny's Kloset",icon:"👕",price:300,theme:"theme-kloset",color:"#3498db",coinMultiplier:1.12,badChance:.34,speedMod:1.03,good:[["Shirt","👕"],["Shoes","👟"],["Coat","🧥"],["Blanket","🧺"],["Toy","🧸"],["Donation","📦"],["Kindness","🤝"]],bad:[["Clutter","📦"],["Waste","🗑️"],["Broken","💔"],["Neglect","🌧️"]],description:"Catch useful donations and keep the chaos away."},
 {id:"coffee",name:"Coffee & Conversations",icon:"☕",price:500,theme:"theme-coffee",color:"#d68d45",coinMultiplier:1.08,badChance:.35,speedMod:.97,good:[["Coffee","☕"],["Friendship","🤝"],["Conversation","💬"],["Prayer","🙏"],["Invite","📨"],["Listen","👂"]],bad:[["Loneliness","😔"],["Awkward","🙃"],["Rush","⏰"],["Distraction","📱"]],description:"Warm, welcoming, and built around connection."},
 {id:"kids",name:"Adventure Kids",icon:"🖍️",price:750,theme:"theme-kids",color:"#ffd855",coinMultiplier:1.16,badChance:.4,speedMod:1.15,good:[["Joy","😄"],["Wonder","🌈"],["Bible Story","📖"],["Laughter","😂"],["Worship","🎵"],["Adventure","🧭"]],bad:[["Chaos","🌪️"],["Tantrum","😭"],["Spill","🥤"],["Lost Shoe","👟"],["Distraction","📱"]],description:"Fast and wild, but the rewards are bigger."},
 {id:"protect",name:"Forged to Protect",icon:"🚒",price:1000,theme:"theme-protect",color:"#ff5555",coinMultiplier:1.24,badChance:.43,speedMod:1.08,good:[["Courage","🛡️"],["Service","🤝"],["Honor","🎖️"],["Protection","🚒"],["Sacrifice","🇺🇸"],["Community","🏘️"],["Prayer","🙏"]],bad:[["Burnout","😮‍💨"],["Danger","⚠️"],["Stress","😖"],["Fear","😨"],["Exhaustion","💤"]],description:"Harder first-responder level with bigger coins."}
];

const STORE_ITEMS = [
 {id:"outfit_gold",type:"outfit",slot:"outfit",name:"Foundery Gold Shirt",icon:"🟡",price:0,rarity:"common",value:"#f5b700",description:"Classic starter look.",bonusText:"No bonus.",bonus:{}},
 {id:"outfit_hoodie",type:"outfit",slot:"outfit",name:"Forge Hoodie",icon:"🔥",price:350,rarity:"rare",value:"#d96c06",description:"Made for the grind.",bonusText:"+10% match coins.",bonus:{coinMultiplier:1.1}},
 {id:"outfit_vest",type:"outfit",slot:"outfit",name:"Helper Vest",icon:"🦺",price:500,rarity:"rare",value:"#2ecc71",description:"Mission-focused gear.",bonusText:"+1 life at start.",bonus:{extraLife:1}},
 {id:"acc_none",type:"accessory",slot:"accessory",name:"No Accessory",icon:"🙂",price:0,rarity:"common",value:"none",description:"Simple and clean.",bonusText:"No bonus.",bonus:{}},
 {id:"acc_cap",type:"accessory",slot:"accessory",name:"Forge Cap",icon:"🧢",price:200,rarity:"uncommon",value:"cap",description:"A little extra grind.",bonusText:"+5% speed.",bonus:{speed:1.05}},
 {id:"acc_halo",type:"accessory",slot:"accessory",name:"Golden Halo",icon:"😇",price:800,rarity:"legendary",value:"halo",description:"Turns close calls into miracles.",bonusText:"Bad items fall 10% slower.",bonus:{badSlow:.9}},
 {id:"tool_tray",type:"tool",slot:"tool",name:"Serving Tray",icon:"🍽️",price:0,rarity:"common",value:"tray",description:"Original catcher.",bonusText:"No bonus.",bonus:{}},
 {id:"tool_basket",type:"tool",slot:"tool",name:"Golden Basket",icon:"🧺",price:650,rarity:"epic",value:"basket",description:"Bigger catch zone.",bonusText:"Catch zone +12%.",bonus:{width:1.12}},
 {id:"tool_magnet",type:"tool",slot:"tool",name:"Blessing Magnet",icon:"🧲",price:700,rarity:"epic",value:"magnet",description:"Pulls blessings closer.",bonusText:"Magnet radius +35.",bonus:{magnet:35}},
 {id:"tool_hands",type:"tool",slot:"tool",name:"Helping Hands",icon:"🙌",price:500,rarity:"rare",value:"hands",description:"Catch blessings bare-handed.",bonusText:"Burst fills 15% faster.",bonus:{burstGain:1.15}}
];

const UPGRADE_STORE = [
 {id:"speed",name:"Speed Boost",icon:"⚡",base:150,desc:"Basket follows your thumb faster every run."},
 {id:"magnet",name:"Magnet Radius",icon:"🧲",base:175,desc:"Good blessings start sliding toward you from farther away."},
 {id:"burst",name:"Burst Charger",icon:"✨",base:200,desc:"Good catches fill Blessing Burst faster."},
 {id:"coins",name:"Coin Multiplier",icon:"🪙",base:225,desc:"Earn more coins from every match."}
];

const ACHIEVEMENTS = [
 {id:"first",icon:"✨",name:"First Blessing",desc:"Catch your first blessing.",reward:25,check:d=>d.stats.goodCaught>=1},
 {id:"burst",icon:"💥",name:"Burst Believer",desc:"Use Blessing Burst 3 times.",reward:100,check:d=>d.stats.bursts>=3},
 {id:"streak",icon:"🔥",name:"Hot Streak",desc:"Reach a 20 catch streak.",reward:150,check:d=>d.stats.bestStreak>=20},
 {id:"buyer",icon:"🛒",name:"Store Supporter",desc:"Buy any item or upgrade.",reward:75,check:d=>d.stats.itemsPurchased>=1},
 {id:"worlds",icon:"🗺️",name:"World Walker",desc:"Unlock 3 levels.",reward:200,check:d=>d.unlockedLevels.length>=3},
 {id:"score",icon:"🏆",name:"Score Chaser",desc:"Score 2,500 in one match.",reward:250,check:d=>d.stats.bestScore>=2500}
];

const CHALLENGES = [
 "Nominate someone for a surprise blessing this week.",
 "Text someone you have not checked on in a while.",
 "Pray for a first responder, veteran, teacher, or neighbor today.",
 "Bring someone a coffee, snack, or small encouragement.",
 "Donate something useful to Kenny's Kloset.",
 "Ask someone, 'How can I pray for you?' and follow up."
];

const $ = id => document.getElementById(id);
const pick = a => a[Math.floor(Math.random()*a.length)];
const clamp = (v,min,max) => Math.max(min, Math.min(max, v));
const money = n => `🪙 ${Math.floor(n).toLocaleString()}`;
const clean = v => String(v || "").replace(/[<>]/g, "");
const levelById = id => LEVELS.find(l => l.id === id) || LEVELS[0];
const itemById = id => STORE_ITEMS.find(i => i.id === id) || STORE_ITEMS[0];
const todayKey = () => new Date().toISOString().slice(0,10);

function defaultData(){
 return {coins:0,ownedItems:["outfit_gold","acc_none","tool_tray"],unlockedLevels:["forge"],equipped:{level:"forge",outfit:"outfit_gold",accessory:"acc_none",tool:"tool_tray"},upgrades:{speed:0,magnet:0,burst:0,coins:0},achievements:[],lastDaily:null,stats:{matches:0,totalScore:0,bestScore:0,totalCoins:0,goodCaught:0,badCaught:0,badAvoided:0,bestStreak:0,itemsPurchased:0,bursts:0}};
}
function loadData(){try{return {...defaultData(),...(JSON.parse(localStorage.getItem(STORAGE_KEY))||{})};}catch{return defaultData();}}
function saveData(d){localStorage.setItem(STORAGE_KEY, JSON.stringify(d));}

class Particles{
 constructor(){this.bits=[];this.texts=[];}
 burst(x,y,color,count=18,power=1){for(let i=0;i<count;i++)this.bits.push({x,y,vx:(Math.random()-.5)*420*power,vy:(Math.random()-.8)*420*power,life:1,size:Math.random()*5+3,color});}
 text(x,y,txt,color,size=20){this.texts.push({x,y,txt,color,size,life:1.25,vy:-70});}
 update(dt){this.bits=this.bits.filter(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=650*dt;p.life-=dt*1.7;return p.life>0;});this.texts=this.texts.filter(t=>{t.y+=t.vy*dt;t.life-=dt;return t.life>0;});}
 draw(ctx){ctx.save();for(const p of this.bits){ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();}for(const t of this.texts){ctx.globalAlpha=Math.max(0,Math.min(1,t.life*2));ctx.font=`900 ${t.size}px Montserrat`;ctx.textAlign="center";ctx.shadowColor="#000";ctx.shadowBlur=10;ctx.fillStyle=t.color;ctx.fillText(t.txt,t.x,t.y);}ctx.restore();ctx.globalAlpha=1;}
}

class AudioFX{
 constructor(){this.ctx=null;this.ready=false;}
 init(){if(this.ready)return;const C=window.AudioContext||window.webkitAudioContext;if(!C)return;this.ctx=new C();this.ready=true;}
 tone(f,d=.12,type="sine",vol=.18){if(!this.ctx)return;const o=this.ctx.createOscillator(), g=this.ctx.createGain();o.type=type;o.frequency.value=f;g.gain.value=vol;g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+d);o.connect(g);g.connect(this.ctx.destination);o.start();o.stop(this.ctx.currentTime+d);}
 good(){this.tone(660);setTimeout(()=>this.tone(880,.12),55);} bad(){this.tone(130,.25,"sawtooth",.25);} coin(){this.tone(1050,.08,"triangle",.16);} burst(){[330,440,660,880,1320].forEach((f,i)=>setTimeout(()=>this.tone(f,.15,"square",.14),i*55));}
}

class Game{
 constructor(){
  this.canvas=$("gameCanvas");this.ctx=this.canvas.getContext("2d");this.wrap=$("game-wrapper");this.video=$("levelVideoBg");
  this.data=loadData();this.fx=new Particles();this.audio=new AudioFX();this.state="MENU";this.items=[];this.keys={};this.touchX=null;this.pointerDown=false;this.last=0;this.storeTab="outfit";this.burstTimer=0;this.shake=0;this.flashTimer=0;
  this.bind();this.resize();window.addEventListener("resize",()=>this.resize());this.renderAll();this.show("startScreen");requestAnimationFrame(t=>this.loop(t));
 }
 bind(){
  const on=(id,fn)=>$(id)&&(($(id).onclick=fn));
  on("startBtn",()=>this.countdown());on("playAgainBtn",()=>this.countdown());on("homeBtn",()=>this.home());on("pauseBtn",()=>this.pause());on("resumeBtn",()=>this.resume());on("quitBtn",()=>this.end());
  on("storeBtn",()=>this.openStore());on("storeBackBtn",()=>this.home());on("levelsBtn",()=>this.openLevels());on("levelsBackBtn",()=>this.home());on("achievementsBtn",()=>this.openBadges());on("achievementsBackBtn",()=>this.home());on("statsBtn",()=>this.openStats());on("statsBackBtn",()=>this.home());
  on("dailyBtn",()=>this.claimDaily());on("burstBtn",()=>this.activateBurst());on("leaderboardBtn",()=>this.openLeaderboard("startScreen"));on("leaderboardEndBtn",()=>this.openLeaderboard("endScreen"));on("leaderboardBackBtn",()=>this.show(this.previousBoard||"startScreen"));on("submitScoreBtn",()=>this.submitScore());
  on("resetBtn",()=>{if(confirm("Reset all progress on this device?")){localStorage.removeItem(STORAGE_KEY);this.data=defaultData();saveData(this.data);this.renderAll();this.home();}});
  ["selLevel","selOutfit","selAccessory","selTool"].forEach(id=>{const el=$(id);if(el)el.onchange=e=>{id==="selLevel"?this.equipLevel(e.target.value):this.equipItem(e.target.value);};});
  window.addEventListener("keydown",e=>{this.keys[e.key]=true;if(e.key===" "){e.preventDefault();this.activateBurst();}if(e.key==="Escape")this.state==="PLAYING"?this.pause():this.resume();});
  window.addEventListener("keyup",e=>this.keys[e.key]=false);
  const setTouch=e=>{const p=e.touches?e.touches[0]:e;const r=this.canvas.getBoundingClientRect();this.touchX=clamp(p.clientX-r.left,0,this.w);};
  ["touchstart","touchmove"].forEach(ev=>this.canvas.addEventListener(ev,e=>{e.preventDefault();this.audio.init();setTouch(e);},{passive:false}));
  this.canvas.addEventListener("touchend",()=>this.touchX=null);
  this.canvas.addEventListener("pointerdown",e=>{this.pointerDown=true;this.audio.init();setTouch(e);});
  this.canvas.addEventListener("pointermove",e=>{if(this.pointerDown)setTouch(e);});
  window.addEventListener("pointerup",()=>{this.pointerDown=false;});
 }
 resize(){const r=window.devicePixelRatio||1;this.w=this.canvas.clientWidth;this.h=this.canvas.clientHeight;this.canvas.width=this.w*r;this.canvas.height=this.h*r;this.ctx.setTransform(r,0,0,r,0,0);}
 show(id){document.querySelectorAll(".screen").forEach(s=>s.style.display="none");if($("hud"))$("hud").style.display=id==="hud"?"flex":"none";if(id!=="hud"&&$(id))$(id).style.display="flex";}
 home(){this.state="MENU";this.applyTheme();this.renderAll();this.show("startScreen");}
 currentLevel(){return levelById(this.data.equipped.level);} equipped(){return {outfit:itemById(this.data.equipped.outfit),accessory:itemById(this.data.equipped.accessory),tool:itemById(this.data.equipped.tool)};}
 bonus(){const b={coinMultiplier:1,speed:1,width:1,badSlow:1,magnet:0,burstGain:1,extraLife:0};Object.values(this.equipped()).forEach(it=>Object.entries(it.bonus||{}).forEach(([k,v])=>{if(k in b)b[k]=typeof v==="number"?(k.includes("Multiplier")||k==="speed"||k==="width"||k==="badSlow"||k==="burstGain"?b[k]*v:b[k]+v):v;}));b.speed*=1+this.data.upgrades.speed*.08;b.magnet+=this.data.upgrades.magnet*28;b.burstGain*=1+this.data.upgrades.burst*.12;b.coinMultiplier*=1+this.data.upgrades.coins*.1;return b;}
 applyTheme(){const l=this.currentLevel();this.wrap.className=l.theme;if(this.video){this.video.style.display="none";}}
 renderAll(){this.renderCoins();this.renderDaily();this.renderSelects();this.checkBadges(false);}
 renderCoins(){["coinDisplay","storeCoins","hudCoins"].forEach(id=>{if($(id))$(id).innerText=id==="coinDisplay"?`${money(this.data.coins)} Coins`:money(this.data.coins);});}
 renderDaily(){const claimed=this.data.lastDaily===todayKey();if($("dailyText"))$("dailyText").innerText=claimed?"Daily blessing claimed. Come back tomorrow.":"Claim today's 75 coin blessing bonus.";if($("dailyBtn")){ $("dailyBtn").innerText=claimed?"Claimed":"Claim"; $("dailyBtn").disabled=claimed;}}
 claimDaily(){if(this.data.lastDaily===todayKey())return;this.data.lastDaily=todayKey();this.data.coins+=75;this.data.stats.totalCoins+=75;saveData(this.data);this.audio.coin();this.toast("Daily Blessing claimed! +75 coins");this.renderAll();}
 renderSelects(){
  const fill=(id,arr,value)=>{const el=$(id);if(!el)return;el.innerHTML=arr.map(o=>`<option value="${o.id}" ${o.id===value?"selected":""}>${o.icon||""} ${o.name}</option>`).join("");};
  fill("selLevel", LEVELS.filter(l=>this.data.unlockedLevels.includes(l.id)), this.data.equipped.level);
  fill("selOutfit", STORE_ITEMS.filter(i=>i.type==="outfit"&&this.data.ownedItems.includes(i.id)), this.data.equipped.outfit);
  fill("selAccessory", STORE_ITEMS.filter(i=>i.type==="accessory"&&this.data.ownedItems.includes(i.id)), this.data.equipped.accessory);
  fill("selTool", STORE_ITEMS.filter(i=>i.type==="tool"&&this.data.ownedItems.includes(i.id)), this.data.equipped.tool);
 }
 equipItem(id){const it=itemById(id);if(!this.data.ownedItems.includes(id))return;this.data.equipped[it.slot]=id;saveData(this.data);this.renderSelects();}
 equipLevel(id){if(!this.data.unlockedLevels.includes(id))return;this.data.equipped.level=id;saveData(this.data);this.applyTheme();}
 toast(msg){const t=$("toast");if(!t)return;t.innerHTML=msg;t.classList.add("show");clearTimeout(this.toastTO);this.toastTO=setTimeout(()=>t.classList.remove("show"),2200);}
 openStore(){this.state="MENU";this.renderStore();this.show("storeScreen");}
 renderStore(){
  const tabs=["outfit","accessory","tool","upgrade"];$("storeTabs").innerHTML=tabs.map(t=>`<button class="tab ${this.storeTab===t?"active":""}" data-tab="${t}">${t==="upgrade"?"Upgrades":t}</button>`).join("");
  document.querySelectorAll("#storeTabs .tab").forEach(b=>b.onclick=()=>{this.storeTab=b.dataset.tab;this.renderStore();});
  const list=$("storeList");
  if(this.storeTab==="upgrade"){
   list.innerHTML=UPGRADE_STORE.map(u=>{const lv=this.data.upgrades[u.id]||0,cost=u.base*(lv+1);return `<div class="item-card"><div class="item-top"><div class="item-info"><div class="item-icon">${u.icon}</div><div><div class="item-title">${u.name}</div><div class="item-meta">LEVEL ${lv}</div></div></div><span class="pill gold-pill">${money(cost)}</span></div><div class="item-desc">${u.desc}</div><button class="btn btn-small" data-upgrade="${u.id}">Upgrade</button></div>`;}).join("");
   list.querySelectorAll("[data-upgrade]").forEach(b=>b.onclick=()=>this.buyUpgrade(b.dataset.upgrade));return;
  }
  const items=STORE_ITEMS.filter(i=>i.type===this.storeTab);
  list.innerHTML=items.map(i=>{const owned=this.data.ownedItems.includes(i.id),equipped=this.data.equipped[i.slot]===i.id;return `<div class="item-card ${equipped?"equipped":owned?"owned":""}"><div class="item-top"><div class="item-info"><div class="item-icon">${i.icon}</div><div><div class="item-title">${i.name}</div><div class="item-meta">${i.rarity.toUpperCase()}</div></div></div><span class="pill gold-pill">${owned?"OWNED":money(i.price)}</span></div><div class="item-desc">${i.description}</div><div class="item-bonus">${i.bonusText}</div><button class="btn btn-small" data-item="${i.id}">${equipped?"Equipped":owned?"Equip":"Buy"}</button></div>`;}).join("");
  list.querySelectorAll("[data-item]").forEach(b=>b.onclick=()=>this.buyOrEquip(b.dataset.item));
 }
 buyOrEquip(id){const it=itemById(id);if(this.data.ownedItems.includes(id)){this.data.equipped[it.slot]=id;}else{if(this.data.coins<it.price){this.toast("Not enough coins yet.");return;}this.data.coins-=it.price;this.data.ownedItems.push(id);this.data.stats.itemsPurchased++;this.data.equipped[it.slot]=id;this.audio.coin();}saveData(this.data);this.renderAll();this.renderStore();}
 buyUpgrade(id){const u=UPGRADE_STORE.find(x=>x.id===id);const lv=this.data.upgrades[id]||0;const cost=u.base*(lv+1);if(this.data.coins<cost){this.toast("Not enough coins yet.");return;}this.data.coins-=cost;this.data.upgrades[id]=lv+1;this.data.stats.itemsPurchased++;saveData(this.data);this.audio.coin();this.toast(`${u.name} upgraded to Level ${lv+1}!`);this.renderAll();this.renderStore();}
 openLevels(){const list=$("levelsList");list.innerHTML=LEVELS.map(l=>{const unlocked=this.data.unlockedLevels.includes(l.id),equipped=this.data.equipped.level===l.id;return `<div class="item-card ${equipped?"equipped":unlocked?"owned":""}"><div class="item-top"><div class="item-info"><div class="item-icon">${l.icon}</div><div><div class="item-title">${l.name}</div><div class="item-meta">${unlocked?"UNLOCKED":money(l.price)}</div></div></div></div><div class="item-desc">${l.description}</div><button class="btn btn-small" data-level="${l.id}">${equipped?"Equipped":unlocked?"Equip":"Unlock"}</button></div>`;}).join("");list.querySelectorAll("[data-level]").forEach(b=>b.onclick=()=>this.unlockOrEquipLevel(b.dataset.level));this.show("levelsScreen");}
 unlockOrEquipLevel(id){const l=levelById(id);if(this.data.unlockedLevels.includes(id)){this.data.equipped.level=id;}else{if(this.data.coins<l.price){this.toast("Not enough coins yet.");return;}this.data.coins-=l.price;this.data.unlockedLevels.push(id);this.data.equipped.level=id;this.audio.coin();}saveData(this.data);this.renderAll();this.openLevels();}
 openBadges(){const list=$("achievementsList");list.innerHTML=ACHIEVEMENTS.map(a=>`<div class="item-card ${this.data.achievements.includes(a.id)?"owned":""}"><div class="item-top"><div class="item-info"><div class="item-icon">${a.icon}</div><div><div class="item-title">${a.name}</div><div class="item-meta">${this.data.achievements.includes(a.id)?"CLAIMED":"REWARD " + money(a.reward)}</div></div></div></div><div class="item-desc">${a.desc}</div></div>`).join("");this.show("achievementsScreen");}
 openStats(){const s=this.data.stats;$("statsList").innerHTML=[["Best Score",s.bestScore],["Matches",s.matches],["Total Coins",s.totalCoins],["Good Catches",s.goodCaught],["Bad Catches",s.badCaught],["Best Streak",s.bestStreak],["Bursts Used",s.bursts]].map(([k,v])=>`<div class="item-card"><div class="item-title">${k}</div><div class="item-bonus">${v}</div></div>`).join("");this.show("statsScreen");}
 checkBadges(show=true){let got=[];for(const a of ACHIEVEMENTS){if(!this.data.achievements.includes(a.id)&&a.check(this.data)){this.data.achievements.push(a.id);this.data.coins+=a.reward;this.data.stats.totalCoins+=a.reward;got.push(a);}}if(got.length){saveData(this.data);if(show)this.toast(`Badge unlocked: ${got[0].name} +${got[0].reward} coins`);}}
 countdown(){this.audio.init();this.state="COUNTDOWN";this.applyTheme();this.show(null);let n=3;const c=$("countdown");const tick=()=>{c.innerText=n>0?n:"GO";c.classList.remove("count-pop");void c.offsetWidth;c.classList.add("count-pop");if(n-->=0)setTimeout(tick,760);else this.start();};tick();}
 start(){const l=this.currentLevel(), b=this.bonus();this.state="PLAYING";this.items=[];this.score=0;this.runCoins=0;this.lives=3+b.extraLife;this.streak=0;this.bestStreak=0;this.meter=0;this.time=0;this.spawn=0;this.burstTimer=0;this.player={x:this.w/2,y:this.h-95,w:112*b.width,h:24,color:this.equipped().outfit.value,b};this.show("hud");this.updateHUD();}
 pause(){if(this.state!=="PLAYING")return;this.state="PAUSED";this.show("pauseScreen");}
 resume(){if(this.state!=="PAUSED")return;this.state="PLAYING";this.show("hud");}
 spawnItem(){const l=this.currentLevel(), b=this.bonus();let type=Math.random()<l.badChance?"bad":"good";if(Math.random()<.075)type="power";const src=type==="bad"?pick(l.bad):type==="power"?pick([["Shield","🛡️"],["Slow Time","⏳"],["Double Coins","✝️"]]):pick(l.good);const speed=(170+this.time*8+Math.random()*130)*l.speedMod*(type==="bad"?b.badSlow:1);this.items.push({x:35+Math.random()*(this.w-70),y:-30,r:type==="power"?24:22,type,name:src[0],emoji:src[1],speed,vx:(Math.random()-.5)*30,converted:false,life:1});}
 update(dt){if(this.state!=="PLAYING")return;this.time+=dt;this.spawn-=dt;if(this.spawn<=0){this.spawnItem();this.spawn=Math.max(.32,.9-this.time*.012);}if(this.burstTimer>0){this.burstTimer-=dt;if(this.burstTimer<=0){this.wrap.classList.remove("burst-active");this.applyTheme();}}
  const b=this.bonus(), px=this.player.x+this.player.w/2, py=this.player.y;let axis=(this.keys.ArrowRight||this.keys.d?1:0)-(this.keys.ArrowLeft||this.keys.a?1:0);if(this.touchX!==null){this.player.x += (this.touchX-this.player.w/2-this.player.x)*(22*b.speed)*dt;}else{this.player.x += axis*720*b.speed*dt;}this.player.x=clamp(this.player.x,0,this.w-this.player.w);
  const magnetRadius=65+b.magnet+(this.burstTimer>0?260:0);
  for(let i=this.items.length-1;i>=0;i--){const it=this.items[i];const goodish=it.type==="good"||it.converted||it.type==="power";const dx=px-it.x, dy=py-it.y, dist=Math.hypot(dx,dy);if(goodish&&dist<magnetRadius){it.x+=dx*dt*(this.burstTimer>0?7:3.2);it.y+=dy*dt*(this.burstTimer>0?7:3.2);}it.x+=it.vx*dt;it.y+=it.speed*dt;if(this.hit(it)){this.catchItem(it);this.items.splice(i,1);continue;}if(it.y>this.h+60){if(it.type==="bad")this.data.stats.badAvoided++;this.items.splice(i,1);}}
  if(this.flashTimer>0)this.flashTimer-=dt;if(this.shake>0)this.shake-=dt;this.fx.update(dt);this.updateHUD();}
 hit(it){return it.y+it.r>this.player.y-5&&it.y-it.r<this.player.y+this.player.h+20&&it.x>this.player.x-20&&it.x<this.player.x+this.player.w+20;}
 catchItem(it){const good=it.type==="good"||it.converted;const b=this.bonus(), l=this.currentLevel();if(it.type==="power"){this.activatePower(it);return;}if(good){let pts=10+this.streak*2+(this.burstTimer>0?15:0);this.score+=pts;this.streak++;this.bestStreak=Math.max(this.bestStreak,this.streak);this.runCoins+=Math.ceil((1+(this.streak>=10?1:0))*l.coinMultiplier*b.coinMultiplier);this.meter=clamp(this.meter+10*b.burstGain,0,100);this.data.stats.goodCaught++;this.fx.text(it.x,it.y,`+${pts}`,"#00ff88",22);this.fx.burst(it.x,it.y,"#00ff88",16,1);this.audio.good();}else{this.lives--;this.streak=0;this.data.stats.badCaught++;this.shake=.35;this.flashTimer=.12;this.fx.text(it.x,it.y,"OUCH! -1 ❤️","#ff4444",24);this.fx.burst(it.x,it.y,"#ff4444",28,1.35);this.audio.bad();if(this.lives<=0)this.end();}this.updateHUD();}
 activatePower(it){this.meter=clamp(this.meter+18,0,100);this.runCoins+=3;this.fx.text(it.x,it.y,it.name,"#00e5ff",21);this.fx.burst(it.x,it.y,"#00e5ff",20,1.2);this.audio.coin();}
 activateBurst(){if(this.state!=="PLAYING"||this.meter<100)return;this.meter=0;this.burstTimer=3;this.data.stats.bursts++;this.wrap.className=`${this.currentLevel().theme} burst-active`;this.fx.text(this.w/2,this.h*.35,"BLESSING BURST!","#00ff88",34);this.fx.burst(this.w/2,this.h*.35,"#00ff88",80,2.2);for(const it of this.items){if(it.type==="bad"){it.converted=true;it.type="good";it.name="Blessing";it.emoji="✨";it.speed*=.75;}}this.audio.burst();this.shake=.25;}
 end(){if(this.state==="ENDED")return;this.state="ENDED";this.wrap.classList.remove("burst-active");this.data.coins+=this.runCoins;this.data.stats.matches++;this.data.stats.totalScore+=this.score;this.data.stats.totalCoins+=this.runCoins;this.data.stats.bestScore=Math.max(this.data.stats.bestScore,this.score);this.data.stats.bestStreak=Math.max(this.data.stats.bestStreak,this.bestStreak);saveData(this.data);this.checkBadges(true);$("finalScore").innerText=this.score;$("bestScoreText").innerText=this.data.stats.bestScore;$("coinsEarned").innerText=this.runCoins;$("totalCoins").innerText=this.data.coins;$("missionsDone").innerText=this.data.stats.bursts;$("runBestStreak").innerText=this.bestStreak;$("challengeText").innerText=pick(CHALLENGES);this.ensureNominateButton();this.renderAll();this.show("endScreen");}
 ensureNominateButton(){if(document.getElementById("nominateBlessingBtn"))return;const card=document.querySelector("#endScreen .challenge-card");if(!card)return;const a=document.createElement("a");a.id="nominateBlessingBtn";a.href=NOMINATION_URL;a.target="_blank";a.rel="noopener";a.className="btn";a.style.marginTop="14px";a.textContent="Nominate Someone for a Blessing";card.appendChild(a);}
 updateHUD(){if($("scoreVal"))$("scoreVal").innerText=this.score;if($("livesVal"))$("livesVal").innerText="❤️".repeat(Math.max(0,this.lives));if($("streakVal")){$("streakVal").innerText=`Streak: ${this.streak}`;$("streakVal").classList.toggle("high",this.streak>=10);}if($("hudCoins"))$("hudCoins").innerText=money(this.runCoins||0);if($("levelVal"))$("levelVal").innerText=`${this.currentLevel().icon} ${this.currentLevel().name}`;if($("xpFill"))$("xpFill").style.width=`${this.meter}%`;const off=188.49-(188.49*(this.meter/100));if($("meterFill"))$("meterFill").style.strokeDashoffset=off;if($("burstBtn"))$("burstBtn").classList.toggle("full",this.meter>=100);if($("missionDesc"))$("missionDesc").innerText=this.burstTimer>0?"Burst active. Bad becomes blessing!":"Fill the meter, then tap Burst.";if($("missionProgress"))$("missionProgress").innerText=`${Math.floor(this.meter)} / 100`;}
 draw(){const ctx=this.ctx;ctx.save();ctx.clearRect(0,0,this.w,this.h);if(this.shake>0)ctx.translate((Math.random()-.5)*16,(Math.random()-.5)*16);this.drawBackground(ctx);for(const it of this.items)this.drawItem(ctx,it);if(this.player)this.drawPlayer(ctx);this.fx.draw(ctx);if(this.flashTimer>0){ctx.fillStyle=`rgba(255,68,68,${this.flashTimer*2.5})`;ctx.fillRect(0,0,this.w,this.h);}ctx.restore();}
 drawBackground(ctx){const g=ctx.createLinearGradient(0,0,0,this.h);g.addColorStop(0,"rgba(255,255,255,.06)");g.addColorStop(1,"rgba(0,0,0,.2)");ctx.fillStyle=g;ctx.fillRect(0,0,this.w,this.h);if(this.burstTimer>0){ctx.fillStyle="rgba(0,255,136,.12)";ctx.fillRect(0,0,this.w,this.h);}}
 drawItem(ctx,it){ctx.save();ctx.globalAlpha=it.life;ctx.font=`900 ${it.r*1.35}px Montserrat`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.shadowBlur=it.converted||it.type==="good"?18:it.type==="bad"?12:16;ctx.shadowColor=it.converted||it.type==="good"?"#00ff88":it.type==="bad"?"#ff4444":"#00e5ff";ctx.fillText(it.emoji,it.x,it.y);ctx.font="800 10px Montserrat";ctx.fillStyle="#fff";ctx.shadowBlur=6;ctx.fillText(it.name,it.x,it.y+28);ctx.restore();}
 drawPlayer(ctx){const p=this.player, cx=p.x+p.w/2;ctx.save();ctx.shadowColor=this.burstTimer>0?"#00ff88":"#f5b700";ctx.shadowBlur=22;ctx.fillStyle=p.color;ctx.beginPath();ctx.roundRect(p.x,p.y,p.w,p.h,10);ctx.fill();ctx.fillStyle="#f1c27d";ctx.beginPath();ctx.arc(cx,p.y-28,22,0,Math.PI*2);ctx.fill();ctx.fillStyle="#111";ctx.beginPath();ctx.arc(cx-7,p.y-30,3,0,Math.PI*2);ctx.arc(cx+7,p.y-30,3,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#111";ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,p.y-25,10,0,Math.PI);ctx.stroke();ctx.fillStyle="rgba(255,255,255,.9)";ctx.font="900 24px Montserrat";ctx.textAlign="center";ctx.fillText(this.equipped().tool.icon,cx,p.y+17);if(this.burstTimer>0){ctx.strokeStyle="#00ff88";ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,p.y,180,0,Math.PI*2);ctx.stroke();}ctx.restore();}
 loop(t){const dt=Math.min(.033,(t-this.last)/1000||0);this.last=t;this.update(dt);this.draw();requestAnimationFrame(x=>this.loop(x));}
 async submitScore(){const name=clean($("playerNameInput")?.value||"Anonymous").slice(0,15)||"Anonymous";try{await addDoc(collection(db,"scores"),{name,score:this.score,coins:this.runCoins,createdAt:serverTimestamp()});this.toast("Score submitted!");}catch{this.toast("Could not submit score right now.");}}
 async openLeaderboard(prev="startScreen"){this.previousBoard=prev;this.show("leaderboardScreen");const list=$("leaderboardList");list.innerHTML='<div class="item-card"><div class="item-desc">Loading leaderboard...</div></div>';try{const q=query(collection(db,"scores"),orderBy("score","desc"),limit(20));const snap=await getDocs(q);let i=1;list.innerHTML=snap.empty?'<div class="item-card"><div class="item-desc">No scores yet. Be the first.</div></div>':snap.docs.map(d=>{const s=d.data();return `<div class="item-card"><div class="item-top"><div class="item-title">#${i++} ${clean(s.name)}</div><span class="pill gold-pill">${s.score||0}</span></div></div>`;}).join("");}catch{list.innerHTML='<div class="item-card"><div class="item-desc">Leaderboard unavailable right now.</div></div>';}}
}

window.addEventListener("DOMContentLoaded",()=>new Game());
