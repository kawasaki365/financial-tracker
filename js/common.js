// Formatting helpers
function fmt(n, dp=2){ if(n===null||n===undefined) return '-'; return Number(n).toLocaleString(undefined,{maximumFractionDigits:dp}) }
function sign(n){ if(n>0) return '+'+n.toFixed(2)+'%'; if(n<0) return n.toFixed(2)+'%'; return '0.00%'; }
function chgClass(n){ return n>=0 ? 'chg up' : 'chg down'; }
function timeNow(){ const d=new Date(); return d.toLocaleTimeString() }
