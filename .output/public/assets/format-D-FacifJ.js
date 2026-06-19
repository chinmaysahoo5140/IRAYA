function e(r){const t=typeof r=="string"?parseFloat(r):r;return Number.isNaN(t)?"—":new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(t)}export{e as f};
