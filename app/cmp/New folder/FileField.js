Ext.define("App.cmp.FileField",{extend:"Ext.form.field.File",q:{type:"filefield"},result:null,fileType:null,listeners:{change:function(e){var l=e.getEl().down("input[type=file]").dom.files[0],n=new FileReader;n.onload=function(l){return function(l){e.result=btoa(l.target.result),void 0!=e.onChange&&e.onChange(e),e.setValue(null)}}(l);var t=l.name.split(".");e.fileType=t[t.length-1],n.readAsBinaryString(l)}}});