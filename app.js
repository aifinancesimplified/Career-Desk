/* Finance Simplified Career Desk: all page logic. Pure rule functions sit between PURE-START and PURE-END. */
/*PURE-START*/
var WA_NUMBER='919878240950';
var SITTING_MONTHS=[0,4,8];
var FINAL_MONTHS=[4,10];
var MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
var NOTE="Based on ICAI's FAQ on the New Scheme (updated 27 Sep 2024). Confirm on icai.org before you register or pay a fee.";
function fmt(d){return d.getDate()+' '+MON[d.getMonth()].slice(0,3)+' '+d.getFullYear();}
function ymLabel(d){return MON[d.getMonth()].slice(0,3)+' '+d.getFullYear();}
function addMonths(d,n){return new Date(d.getFullYear(),d.getMonth()+n,1);}
function parseYM(s){var p=s.split('-');return new Date(Number(p[0]),Number(p[1])-1,1);}
function toYM(d){return d.getFullYear()+'-'+(d.getMonth()<9?'0':'')+(d.getMonth()+1);}
function monthsBetween(a,b){return (b.getFullYear()-a.getFullYear())*12+(b.getMonth()-a.getMonth());}
function span(m){var y=Math.floor(m/12),r=m%12,o=[];if(y)o.push(y+(y===1?' year':' years'));if(r)o.push(r+(r===1?' month':' months'));return o.join(' ')||'0 months';}
function nextSittings(today,lead,minExam,count){
  var out=[];
  for(var y=today.getFullYear();y<=today.getFullYear()+4&&out.length<count;y++){
    for(var i=0;i<SITTING_MONTHS.length&&out.length<count;i++){
      var exam=new Date(y,SITTING_MONTHS[i],1);
      if(minExam&&exam<minExam)continue;
      var cutoff=addMonths(exam,-lead);
      if(cutoff>=today)out.push({exam:exam,cutoff:cutoff});
    }
  }
  return out;
}
function boardsMinExam(today){
  var y=today.getMonth()<=3?today.getFullYear():today.getFullYear()+1;
  return new Date(y,4,1);
}
function finalSitting(min){
  for(var y=min.getFullYear();y<=min.getFullYear()+2;y++){
    for(var i=0;i<FINAL_MONTHS.length;i++){var e=new Date(y,FINAL_MONTHS[i],1);if(e>=min)return e;}
  }
  return null;
}
function need(stream){return stream==='commerce'?55:60;}

function compute(s,today){
  function dated(title,lead,min){
    var rows=nextSittings(today,lead,min,3).map(function(x){return [MON[x.exam.getMonth()]+' '+x.exam.getFullYear(),fmt(x.cutoff)];});
    return rows.length?{title:title,head:['Sitting','Register by'],rows:rows,note:'ICAI asks for at least '+lead+' months between registration and the exam month.'}:null;
  }
  var RULE={title:'Last date to register for each Foundation sitting',head:['Sitting','Register by'],rows:[['January','1 September of the year before'],['May','1 January of the same year'],['September','1 May of the same year']],note:'These dates repeat every year.'};
  var passRule='Score 40% in each paper and 50% overall, in one sitting.';
  var n=need(s.stream), kind=s.stream==='commerce'?'commerce':'non-commerce';
  var F4='Foundation sittings you can still register for', I8='Intermediate sittings you can still register for';
  switch(s.stage){
    case 'c10':
      return {status:'soon',title:'Foundation route, starting after Class 10',
        summary:'You can register for CA Foundation once you pass Class 10. The first attempt comes after you appear in the Class 12 exam, so Classes 11 and 12 are your preparation time.',
        steps:['Pass Class 10. Foundation registration opens after that.','Register for Foundation on ICAI’s online portal. You do not need to wait for Class 12.','Appear in the Class 12 exam. Your first Foundation attempt opens after it.','Choose a sitting and register at least four months before its exam month.',passRule],
        table:RULE};
    case 'c11':
      return {status:'go',title:'Register for Foundation now',
        summary:'Registration is open to students who have passed Class 10. Your first attempt opens after you appear in the Class 12 exam.',
        steps:['Register for CA Foundation on ICAI’s online portal.','Prepare alongside Class 11 and Class 12.','Appear in the Class 12 exam. The first Foundation attempt opens after it.','Register at least four months before the exam month you choose.',passRule],
        table:RULE};
    case 'c12a':
      return {status:'go',title:'Foundation first, with the first attempt after your boards',
        summary:'Register for Foundation now so that a sitting is open as soon as your Class 12 exams end.',
        steps:['Register for Foundation now if you have not already.','Pick a sitting from the table and register before its last date.',passRule,'Then register for Intermediate, at least eight months before its exam month, once Class 12 is passed.'],
        table:dated(F4,4,boardsMinExam(today))};
    case 'c12p':
      return {status:'go',title:'The Foundation route',
        summary:'Class 12 is done, so every sitting below is open to you if you register before its last date.',
        steps:['Register for CA Foundation on ICAI’s online portal.','Choose a sitting below and register at least four months before its exam month.',passRule,'Register for Intermediate at least eight months before its exam month.'],
        table:dated(F4,4,null)};
    case 'found':
      return {status:'go',title:'Next, CA Intermediate',
        summary:'With Foundation passed and Class 12 done, you can register for Intermediate. ICAI asks for eight months of study before the exam.',
        steps:['Check that Class 12 is passed. The Foundation route to Intermediate needs both.','Register for Intermediate at least eight months before the exam month.','Sit one group or both. Each group needs 40% in every paper and 50% overall.','After both groups, complete ICITSS and begin practical training.'],
        table:dated(I8,8,null)};
    case 'ugfinal':
      if(s.marks===null) return {status:'info',title:'Direct Entry to Intermediate, if your marks qualify',
        summary:'Graduates enter Intermediate directly with at least '+n+'% in a '+kind+' degree. Enter your percentage to check.',
        steps:[],table:dated(I8,8,null)};
      if(s.marks>=n) return {status:'go',title:'Direct Entry to Intermediate, with provisional registration',
        summary:'Your '+s.marks+'% meets the '+n+'% needed for a '+kind+' degree. You can register provisionally while you finish the degree.',
        steps:['Register provisionally for Intermediate under Direct Entry.','Finish the degree with at least '+n+'%.','Complete eight months of study from your registration.','Appear in the first sitting after both are done.'],
        table:dated(I8,8,null)};
      return {status:'no',title:'Direct Entry needs '+n+'%. The Foundation route is open.',
        summary:'Your '+s.marks+'% is below the '+n+'% needed for a '+kind+' degree. If your final result stays below it, Foundation is the way in, and Class 12 is already done.',
        steps:['Register for CA Foundation now.','Choose a sitting below and register at least four months before it.','Pass Foundation, then register for Intermediate.'],
        table:dated(F4,4,null)};
    case 'grad':
      if(s.marks===null) return {status:'info',title:'Direct Entry to Intermediate, if your marks qualify',
        summary:'Graduates and postgraduates enter Intermediate directly with at least '+n+'% in a '+kind+' degree. Enter your percentage to check.',
        steps:[],table:dated(I8,8,null)};
      if(s.marks>=n) return {status:'go',title:'Direct Entry to Intermediate',
        summary:'Your '+s.marks+'% meets the '+n+'% needed for a '+kind+' degree, so you can skip Foundation.',
        steps:['Register for Intermediate under Direct Entry with your degree marksheet.','Register at least eight months before the exam month.','Sit one group or both. Each group needs 40% in every paper and 50% overall.','After both groups, complete ICITSS and begin practical training.'],
        table:dated(I8,8,null)};
      return {status:'no',title:'Direct Entry needs '+n+'%. The Foundation route is open.',
        summary:'Your '+s.marks+'% is below the '+n+'% needed for a '+kind+' degree. Class 12 is done, so you can start with Foundation.',
        steps:['Register for CA Foundation on ICAI’s online portal.','Choose a sitting below and register at least four months before it.','Pass Foundation, then register for Intermediate.'],
        table:dated(F4,4,null)};
    default:
      return {status:'go',title:'Next, ICITSS and two years of practical training',
        summary:'Both Intermediate groups are cleared, so training can begin once ICITSS is done. You can register for the Final course at any time.',
        steps:['Complete ICITSS, a four-week course that comes before practical training.','Begin two years of practical training under a practising Chartered Accountant. Nine to twelve months of industrial training can sit inside those two years.','Register for the Final course at any time. The four self-paced online modules are registered along with it.','When training ends, complete Advanced ICITSS and qualify all four modules.','Sit Final in May or November. ICAI’s FAQ asks for training to be finished six months before the exam month, so count on at least two years and six months from the day training starts.'],
        table:null};
  }
}

function planSittings(start,today){
  function mapEx(list){return list.map(function(x){return {value:toYM(x.exam),label:ymLabel(x.exam)+' (register by '+fmt(x.cutoff)+')'};});}
  if(start==='f12a')return mapEx(nextSittings(today,4,boardsMinExam(today),4));
  if(start==='f12p')return mapEx(nextSittings(today,4,null,4));
  if(start==='inter')return mapEx(nextSittings(today,8,null,4));
  var out=[],t0=new Date(today.getFullYear(),today.getMonth(),1);
  for(var i=1;i<=12;i++){var d=addMonths(t0,i);out.push({value:toYM(d),label:ymLabel(d)});}
  return out;
}
function buildPlan(o,today){
  var t0=new Date(today.getFullYear(),today.getMonth(),1);
  var retry=!!o.retry, steps=[], phases=[];
  function add(date,kind,label,detail){steps.push({date:date,kind:kind,label:label,detail:detail||'',i:steps.length});}
  var fRes=null,iRes=null,tStart,tEnd,fin,fa2;
  if(o.start==='f12a'||o.start==='f12p'){
    var fe=parseYM(o.sitting), fa=fe;
    add(addMonths(fe,-4),'reg','Register for Foundation','The last date to register. ICAI asks for four months before the exam month.');
    add(fe,'exam','Foundation exam','The first sitting you aim for.');
    if(retry){fa=addMonths(fe,4);add(fa,'exam','Foundation, second attempt','The plan allows one retry.');}
    fRes=addMonths(fa,2);
    add(fRes,'result','Foundation result','Assumed about two months after the exam.');
    phases.push({name:'Foundation',from:t0,to:fRes});
  }
  var ie=null,ia=null;
  if(o.start==='inter'){
    ie=parseYM(o.sitting);
    add(addMonths(ie,-8),'reg','Register for Intermediate','The last date to register. ICAI asks for eight months before the exam month.');
  } else if(fRes){
    ie=nextSittings(fRes,8,null,1)[0].exam;
    add(fRes,'reg','Register for Intermediate','Register right after the Foundation result. The eight-month study period starts here.');
  }
  if(ie){
    ia=ie;
    add(ie,'exam','Intermediate exam','Both groups in one sitting.');
    if(retry){ia=addMonths(ie,4);add(ia,'exam','Intermediate, second attempt','The plan allows one retry.');}
    iRes=addMonths(ia,2);
    add(iRes,'result','Intermediate result','Assumed about two months after the exam.');
    phases.push({name:'Intermediate',from:fRes||t0,to:iRes});
  }
  if(o.start==='train'){
    tStart=parseYM(o.sitting);
    add(addMonths(tStart,-1),'train','ICITSS, four weeks','Needed before practical training begins.');
  } else {
    tStart=addMonths(iRes,1);
    add(iRes,'train','ICITSS, four weeks','Needed before practical training begins.');
  }
  add(tStart,'train','Practical training begins','Two years with a practising Chartered Accountant. Nine to twelve months of industrial training can sit inside it.');
  tEnd=addMonths(tStart,24);
  add(tEnd,'train','Practical training ends','');
  add(tEnd,'reg','Advanced ICITSS and the four self-paced modules','Complete these after training and before Final. Register for the Final course any time after Intermediate.');
  phases.push({name:'Practical training',from:o.start==='train'?tStart:iRes,to:tEnd});
  fin=finalSitting(addMonths(tEnd,6));
  fa2=fin;
  add(fin,'exam','CA Final exam','ICAI’s FAQ asks for training to end six months before the exam month. Final is held in May and November.');
  if(retry){fa2=addMonths(fin,6);add(fa2,'exam','CA Final, second attempt','The plan allows one retry.');}
  var done=addMonths(fa2,2);
  add(done,'done','Qualified as a Chartered Accountant','Estimate. You then apply for ICAI membership.');
  phases.push({name:'Final',from:tEnd,to:done});
  steps.sort(function(a,b){return (a.date-b.date)||(a.i-b.i);});
  phases=phases.filter(function(p){return monthsBetween(p.from,p.to)>0;}).map(function(p){p.months=monthsBetween(p.from,p.to);return p;});
  return {steps:steps,phases:phases,done:done,monthsFromToday:Math.max(0,monthsBetween(t0,done)),retry:retry};
}

var QUIZ=[
 {d:'numbers',t:'I like working with numbers, tables and patterns.'},
 {d:'numbers',t:'I can stay focused on small details until the figures match.'},
 {d:'rules',t:'I enjoy understanding how rules, laws and systems work.'},
 {d:'rules',t:'I like building a clear argument for why an answer is right.'},
 {d:'stay',t:'I can keep studying for one goal over several years.'},
 {d:'stay',t:'If I fail an exam, I would study again and retry rather than quit.'},
 {d:'work',t:'I am comfortable with responsibility, deadlines and office or client work.'},
 {d:'work',t:'I am willing to spend four to six years reaching a professional qualification.'}
];
var SCALE=['Not like me','A little','Mostly','Very much like me'];
var DIMS={
  numbers:{name:'Numbers and accounts',tip:'Try a few chapters of Foundation-level accounting and quantitative aptitude before you register, and see whether you enjoy them.'},
  rules:{name:'Rules and reasoning',tip:'Read a short introduction to business law and company law. CA work leans on reasoning from rules.'},
  stay:{name:'Staying power',tip:'CA rewards steady daily study over many years. Test a three-month routine first and see how it feels.'},
  work:{name:'Work style and readiness',tip:'Talk to a practising CA or a trainee about an ordinary working day before you commit to the route.'}
};
var TIERS={
  strong:{label:'Strong fit',head:'CA looks like a strong fit for you',text:'Your answers point to the habits the course rewards: comfort with numbers and rules, steady study and patience. No quiz can promise success, so check the route and costs before you commit.'},
  promising:{label:'Worth a serious try',head:'CA is worth a serious try',text:'You show some of the habits the course needs and a few that still need testing. Try Foundation-level study for a few weeks and talk to a counsellor before you register.'},
  explore:{label:'Explore other routes too',head:'Look at other routes beside CA',text:'Your answers suggest CA may be a hard match right now. That can change with practice, and CS, CMA or a degree may suit you better. Talk it through before you decide.'}
};
function scoreQuiz(ans){
  var dims={},total=0,n=0,k;
  for(k in DIMS)dims[k]=0;
  QUIZ.forEach(function(q,i){var a=ans[i];if(a!==null&&a!==undefined){dims[q.d]+=a;total+=a;n++;}});
  var tier=total>=17?'strong':(total>=11?'promising':'explore');
  var weak=[];for(k in DIMS){if(dims[k]<=2)weak.push(k);}
  return {dims:dims,total:total,answered:n,tier:tier,weak:weak};
}

function waHref(msg,toMe){return 'https://wa.me/'+(toMe?WA_NUMBER:'')+'?text='+encodeURIComponent(msg);}
function roadmapMessage(lang){
  if(lang==='hi')return [
    "*CA बनने का रोडमैप (10वीं और 12वीं के बाद)*",
    "CA दिव्या अग्रवाल की ओर से",
    "",
    "1. *फाउंडेशन*: 10वीं के बाद रजिस्ट्रेशन। पहला अटेम्प्ट 12वीं की परीक्षा देने के बाद। परीक्षा जनवरी, मई और सितंबर में। पास होने के लिए हर पेपर में 40% और कुल 50%।",
    "2. *इंटरमीडिएट*: फाउंडेशन पास और 12वीं के बाद। ग्रेजुएट के लिए डायरेक्ट एंट्री (कॉमर्स में 55%, अन्य डिग्री में 60%)। परीक्षा से कम से कम 8 महीने पहले रजिस्ट्रेशन।",
    "3. *प्रैक्टिकल ट्रेनिंग*: 2 साल। इंटरमीडिएट के दोनों ग्रुप पास करने और 4 हफ्ते के ICITSS के बाद शुरू होती है।",
    "4. *फाइनल*: परीक्षा मई और नवंबर में। परीक्षा के महीने से 6 महीने पहले तक ट्रेनिंग पूरी होनी चाहिए।",
    "",
    "12वीं के बाद सबसे तेज़ रास्ते में लगभग 4.5 साल लगते हैं। यह हमारा अनुमान है।",
    "नियम ICAI की FAQ (सितंबर 2024) के अनुसार हैं। रजिस्ट्रेशन से पहले icai.org पर जाँच लें।"
  ].join('\n');
  return [
    "*CA roadmap after Class 10 and Class 12*",
    "From CA Divya Aggarwal",
    "",
    "1. *Foundation*: register after Class 10. First attempt comes after you appear in the Class 12 exam. Exams in January, May and September. Pass with 40% in each paper and 50% overall.",
    "2. *Intermediate*: after Foundation and Class 12. Graduates can enter directly with 55% in a commerce degree or 60% in any other degree. Register at least 8 months before the exam.",
    "3. *Practical training*: 2 years. It starts after both Intermediate groups and the 4-week ICITSS course.",
    "4. *Final*: exams in May and November. Training must end 6 months before the exam month.",
    "",
    "From Class 12, the fastest path takes about 4.5 years. That is our estimate.",
    "Rules are from ICAI's FAQ (Sep 2024). Please confirm on icai.org before you register."
  ].join('\n');
}
function personalMessage(route,plan,fit){
  var L=["*My CA route*","Made with Finance Simplified Career Desk by CA Divya Aggarwal",""];
  if(route){
    L.push("*"+route.title+"*",route.summary);
    if(route.steps&&route.steps.length){L.push("","Next steps:");route.steps.forEach(function(s,i){L.push((i+1)+". "+s);});}
    if(route.table&&route.table.rows.length){L.push("",route.table.title+":");route.table.rows.forEach(function(r){L.push("- "+r[0]+": register by "+r[1]);});}
  }
  if(plan){L.push("","*Timeline (estimate)*","Qualified around "+ymLabel(plan.done)+", about "+span(plan.monthsFromToday)+" from today.");}
  if(fit&&fit.answered===QUIZ.length){L.push("","Fit check: "+TIERS[fit.tier].label+" ("+fit.total+" of "+(QUIZ.length*3)+")");}
  L.push("","Dates are estimates. Please confirm on icai.org.");
  return L.join('\n');
}
function enquiryMessage(f){
  var L=["Hello CA Divya, I am writing from Finance Simplified Career Desk."];
  L.push("Name: "+f.name);
  L.push("I am: "+f.role);
  if(f.stage)L.push("Stage: "+f.stage);
  if(f.city)L.push("City: "+f.city);
  L.push("About: "+f.topic);
  if(f.msg)L.push("Message: "+f.msg);
  return L.join('\n');
}
/*PURE-END*/

(function(){
  var $=function(s){return document.querySelector(s);};
  var today=new Date();today.setHours(0,0,0,0);
  var lastRoute=null,lastPlan=null,lastFit=null;
  var notice=$('#notice');
  if(notice&&today>new Date(2026,10,29))notice.hidden=true;

  /* WhatsApp section */
  function selectNode(el){
    try{var r=document.createRange();r.selectNodeContents(el);var s=window.getSelection();s.removeAllRanges();s.addRange(r);}catch(e){}
  }
  function copyWith(text,btn,node){
    var orig=btn.textContent;
    function flash(msg){btn.textContent=msg;setTimeout(function(){btn.textContent=orig;},2200);}
    function fallback(){if(node)selectNode(node);flash('Select and copy');}
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){flash('Copied');},fallback);}
      else fallback();
    }catch(e){fallback();}
  }
  if(WA_NUMBER){
    var wl=$('#wa-line');wl.hidden=false;wl.textContent='WhatsApp for queries: +'+WA_NUMBER;
  }

  /* Route checker */
  var chipText={go:'Start now',soon:'Plan ahead',no:'Not yet eligible',info:'One more detail'};
  function renderRoute(){
    var checked=document.querySelector('input[name="stage"]:checked');
    var stage=checked?checked.value:'c12p';
    $('#degree').hidden=!(stage==='ugfinal'||stage==='grad');
    var raw=$('#marks').value.trim();
    var marks=raw===''?null:Number(raw);
    if(marks!==null&&!(isFinite(marks)&&marks>=0&&marks<=100))marks=null;
    var res=compute({stage:stage,stream:$('#stream').value,marks:marks},today);
    lastRoute=res;
    var html='<div class="res-head"><span class="chip '+res.status+'">'+chipText[res.status]+'</span></div>'+
      '<h2 class="res-title">'+res.title+'</h2><p>'+res.summary+'</p>';
    if(res.steps&&res.steps.length){
      html+='<h3 class="mini">Your next steps</h3><ol class="steps">'+res.steps.map(function(t){return '<li><span>'+t+'</span></li>';}).join('')+'</ol>';
    }
    if(res.table){
      html+='<h3 class="mini">'+res.table.title+'</h3><div class="tablewrap"><table class="ledger"><thead><tr><th>'+res.table.head[0]+'</th><th>'+res.table.head[1]+'</th></tr></thead><tbody>'+
        res.table.rows.map(function(r){return '<tr><td>'+r[0]+'</td><td class="num">'+r[1]+'</td></tr>';}).join('')+'</tbody></table></div><p class="tnote">'+res.table.note+'</p>';
    }
    html+='<p class="src">'+NOTE+'</p>';
    $('#result').innerHTML=html;
  }
  var form=$('#form');
  form.addEventListener('submit',function(e){e.preventDefault();});
  form.addEventListener('change',renderRoute);
  form.addEventListener('input',renderRoute);

  /* Planner */
  var sitLabels={f12a:'First Foundation sitting',f12p:'First Foundation sitting',inter:'First Intermediate sitting',train:'Month training starts'};
  function fillSittings(){
    var start=$('#plan-start').value,sel=$('#plan-sitting'),prev=sel.value;
    var opts=planSittings(start,today);
    sel.innerHTML=opts.map(function(o){return '<option value="'+o.value+'">'+o.label+'</option>';}).join('');
    var has=opts.some(function(o){return o.value===prev;});
    if(has)sel.value=prev;
    $('#plan-sit-label').textContent=sitLabels[start];
  }
  function renderPlan(){
    var sel=$('#plan-sitting');
    if(!sel.value){$('#plan-out').innerHTML='<p>No sitting is open for this starting point right now.</p>';return;}
    var plan=buildPlan({start:$('#plan-start').value,sitting:sel.value,retry:$('#plan-retry').checked},today);
    lastPlan=plan;
    var kindLabel={reg:'Register',exam:'Exam',result:'Result',train:'Training',done:'Qualified'};
    var html='<div class="est"><span class="k">Estimated qualification</span><strong class="big">'+ymLabel(plan.done)+'</strong><span>about '+span(plan.monthsFromToday)+' from today</span></div>';
    var total=plan.phases.reduce(function(a,p){return a+p.months;},0);
    html+='<div class="bar" role="img" aria-label="Phases of the plan">'+plan.phases.map(function(p,i){return '<span class="ph'+(i+1)+'" style="flex:'+p.months+' 1 0"></span>';}).join('')+'</div>';
    html+='<ul class="legend">'+plan.phases.map(function(p,i){return '<li><i class="ph'+(i+1)+'"></i>'+p.name+', '+span(p.months)+'</li>';}).join('')+'</ul>';
    html+='<h3 class="mini">Milestones</h3><ol class="tl">'+plan.steps.map(function(s){
      return '<li class="'+s.kind+'"><span class="d">'+ymLabel(s.date)+'</span><div class="b"><strong>'+s.label+'</strong>'+(s.detail?'<span class="n">'+s.detail+'</span>':'')+'</div></li>';
    }).join('')+'</ol>';
    html+='<p class="src">Assumes you clear each exam at the sitting shown'+(plan.retry?', with one extra attempt at each exam,':'')+', results arrive about two months after each exam, and training starts a month after the Intermediate result. Real dates follow ICAI’s calendar. Rules from ICAI’s FAQ (updated 27 Sep 2024).</p>';
    $('#plan-out').innerHTML=html;
  }
  $('#plan-form').addEventListener('submit',function(e){e.preventDefault();});
  $('#plan-start').addEventListener('change',function(){fillSittings();renderPlan();});
  $('#plan-sitting').addEventListener('change',renderPlan);
  $('#plan-retry').addEventListener('change',renderPlan);

  /* Quiz */
  var ql=$('#quiz-list');
  ql.innerHTML=QUIZ.map(function(q,i){
    return '<fieldset class="q"><legend class="qlegend">'+(i+1)+'. '+q.t+'</legend><div class="scale">'+
      SCALE.map(function(lab,v){return '<div class="seg"><input type="radio" name="q'+i+'" id="q'+i+'-'+v+'" value="'+v+'"><label for="q'+i+'-'+v+'">'+lab+'</label></div>';}).join('')+'</div></fieldset>';
  }).join('');
  function answers(){
    return QUIZ.map(function(q,i){var c=document.querySelector('input[name="q'+i+'"]:checked');return c?Number(c.value):null;});
  }
  function quizChange(){
    var n=answers().filter(function(a){return a!==null;}).length;
    $('#quiz-progress').textContent=n+' of '+QUIZ.length+' answered';
    $('#quiz-submit').disabled=n<QUIZ.length;
  }
  $('#quiz').addEventListener('change',quizChange);
  $('#quiz').addEventListener('submit',function(e){
    e.preventDefault();
    var r=scoreQuiz(answers());
    if(r.answered<QUIZ.length)return;
    lastFit=r;
    var T=TIERS[r.tier];
    var html='<div class="res-head"><span class="chip '+(r.tier==='strong'?'go':(r.tier==='promising'?'soon':'info'))+'">'+T.label+'</span><span class="qprog">'+r.total+' of '+(QUIZ.length*3)+'</span></div>'+
      '<h2 class="res-title">'+T.head+'</h2><p>'+T.text+'</p><div class="dims">'+
      Object.keys(DIMS).map(function(k){var pct=Math.round(r.dims[k]/6*100);return '<div class="dim"><div class="l"><span>'+DIMS[k].name+'</span><span>'+r.dims[k]+' of 6</span></div><div class="meter" role="img" aria-label="'+DIMS[k].name+' '+r.dims[k]+' of 6"><span style="width:'+pct+'%"></span></div></div>';}).join('')+'</div>';
    if(r.weak.length){html+='<h3 class="mini">Worth testing before you register</h3><ul class="tips">'+r.weak.map(function(k){return '<li>'+DIMS[k].tip+'</li>';}).join('')+'</ul>';}
    html+='<div class="row" style="margin-top:18px"><a class="btn" href="#enquire">Talk it through</a></div>';
    var out=$('#quiz-out');out.innerHTML=html;out.hidden=false;
    if(out.scrollIntoView)out.scrollIntoView({block:'nearest'});
  });

  /* Enquiry */
  function enqData(){
    return {name:$('#enq-name').value.trim(),role:$('#enq-role').value,stage:$('#enq-stage').value,city:$('#enq-city').value.trim(),topic:$('#enq-topic').value,msg:$('#enq-msg').value.trim()};
  }
  function enqProblem(){
    var d=enqData();
    if(!d.name)return 'Please add your name.';
    if(!d.role)return 'Please choose who you are.';
    if(!d.topic)return 'Please choose what your enquiry is about.';
    if(!$('#enq-consent').checked)return 'Please tick the box so we know you are happy to be contacted.';
    return '';
  }
  function enqUpdate(){
    $('#enq-send').href=waHref(enqMessage(),true);
  }
  function enqMessage(){var d=enqData();return enquiryMessage({name:d.name||'(name)',role:d.role||'(not chosen)',stage:d.stage,city:d.city,topic:d.topic||'(not chosen)',msg:d.msg});}
  var eform=$('#enq');
  eform.addEventListener('submit',function(e){e.preventDefault();});
  eform.addEventListener('input',function(){enqUpdate();$('#enq-err').hidden=true;});
  eform.addEventListener('change',function(){enqUpdate();$('#enq-err').hidden=true;});
  $('#enq-send').addEventListener('click',function(e){
    var p=enqProblem();
    if(p){e.preventDefault();var er=$('#enq-err');er.textContent=p;er.hidden=false;return;}
    var th=$('#enq-thanks');th.hidden=false;
  });
  $('#enq-copy').addEventListener('click',function(){
    var p=enqProblem();
    if(p){var er=$('#enq-err');er.textContent=p;er.hidden=false;return;}
    copyWith(enqMessage(),this,null);
  });
  if(!WA_NUMBER){$('#enq-hint').textContent='This opens WhatsApp so you can choose where to send it. Your details go only into that message. This page stores nothing.';}

  fillSittings();
  renderRoute();
  renderPlan();
  quizChange();
  enqUpdate();
})();

/* Paste your Google Form link between the quotes. While it is empty the button stays hidden. */
var GFORM_URL="";
(function(){var a=document.getElementById("enq-form");if(a&&GFORM_URL){a.href=GFORM_URL;a.hidden=false;}})();
