Ext.define('App.cmp.NumberField',{
	extend: 'Ext.form.TextField',
	margin:true,
	fieldStyle:'text-align: right;',
	property:{type:'numberfield'},
	app:{},
	value:0,
	labelAlign:'right',
	enableKeyEvents:true,
	initComponent:function(){
		var $this=this,prop=$this.app,app={type:'NUMBER',code:'IDR',lang:window.navigator.language,decimal:2},dirty=null;
		for(var index in prop) { app[index] = prop[index]; }
		$this.app=app;
		prop=$this.app;
		if(this.listeners==undefined){this.listeners=[];}
		var blurOri=null;
		if(this.listeners.blur!=undefined){blurOri=this.listeners.blur;}
		var blur=function(textfield,e){
			if(blurOri != null){blurOri(textfield,e);}
			if(prop.blur != undefined){prop.blur(textfield,e);}
			var val=textfield.getValue();
			val=lib.number.formatToNumber(val,prop.lang);
			if(isNaN(val)===true){val=0;}
			var normalVal=val.toLocaleString(prop.lang,{minimumFractionDigits:prop.decimal});
			if(prop.type=='NUMBER'){textfield.setValue(normalVal);
			}else if(prop.type=='CURRENCY'){
				val=val.toLocaleString(prop.lang,{style: 'currency', currency: prop.code,minimumFractionDigits:prop.decimal });
				if(normalVal.substring(0,1)=='-'){textfield.setValue(val.replace(normalVal.substring(1,normalVal.length)," "+normalVal.substring(1,normalVal.length)));
				}else{textfield.setValue(val.replace(normalVal," "+normalVal));}
			}
			if(textfield.user_property!= undefined){
				Ext.Ajax.request({
					url : url + 'admin/setUserProperty',
					method : 'POST',
					params : {code : textfield.user_property.code,name:textfield.user_property.name,value:textfield._getValue()},
					success : function(response) {var r = ajaxSuccess(response);},
					failure : function(jqXHR, exception) {ajaxError(jqXHR, exception);}
				});
			}
		}
		this.listeners.blur=blur;
		var focusOri=null;
		if(this.listeners.focus!=undefined){focusOri=this.listeners.focus;}
		var focus=function(textfield,e){
			if(focusOri != null){focusOri(textfield,e);}
			if(prop.focus != undefined){prop.focus(textfield,e);}
			var val=lib.number.formatToNumber(textfield.getValue(),prop.lang),exNum=1.5;
			exNum=exNum.toLocaleString(prop.lang).toString();
			var desimal=exNum.toString().substring(1,2);
			val=val.toString();
			if(desimal==','){val=val.replace(/\./g,',');}
			if(val==0){textfield.setValue('');}else{textfield.setValue(val);}
		}
		this.listeners.focus=focus;
		//keydown
		var keydownOri=null;
		if(this.listeners.keydown!=undefined){keydownOri=this.listeners.keydown;}
		var keydown=function(textfield,e){
			var keyDecimal=188,exNum=1.5,desimal=exNum.toString().substring(1,2),allow=false;
			exNum=exNum.toLocaleString(prop.lang).toString();
			if(desimal==','){keyDecimal=190;}
			if((e.keyCode>=48&&e.keyCode<=57)||e.keyCode==189||e.keyCode==8||e.keyCode==keyDecimal||e.keyCode==9||e.keyCode==46||e.keyCode==37||e.keyCode==39 || e.keyCode==13){
				allow=true;
				if(e.keyCode==keyDecimal){
					var val=textfield.getValue(),count = val.split('.').length;
					if(desimal==','){count = val.split(',').length;}
					if(val.length>0){if(count>1){e.preventDefault();}}else{e.preventDefault();}
				}	
			}else if((e.keyCode>=65 && e.keyCode<=90) || (e.keyCode>=97 && e.keyCode<=122)){e.preventDefault();}
			if(keydownOri != null){keydownOri(textfield,e);}
			return false;
		}
		this.listeners.keydown=keydown;
		var keypressOri=null;
		if(this.listeners.keypress!=undefined){keypressOri=this.listeners.keypress;}
		var keypress=function(textfield,e){
			if(e.keyCode==13){e.keyCode=9;}
			if(keypressOri != null){keypressOri(textfield,e);}
			return false;
		}
		this.listeners.keypress=keypress;
		var allowBlank='';
		if(this.allowBlank != undefined && this.allowBlank ==false){allowBlank='<span style="color:red;">*</span>';}
		if(this.fieldLabel != undefined && this.fieldLabel !=''){
			if(this.width == undefined && this.anchor==undefined){this.anchor='100%';}
			this.emptyText=this.fieldLabel.replace('<br>','');
			this.fieldLabel='<span style="float:left;text-align:left;">'+this.fieldLabel+allowBlank+'</span>';	
		}
		this.load=function(){
			if($this.user_property!= undefined){
				Ext.Ajax.request({
					url : url + 'admin/getUserProperty',
					method : 'GET',
					params : {code : $this.user_property.code,name:$this.user_property.name},
					success : function(response) {var r = ajaxSuccess(response);if (r.r == 'S'){$this._setValue(r.d);}},
					failure : function(jqXHR, exception) {ajaxError(jqXHR, exception);}
				});
			}
		}
		val=$this.value;
		var exNum=1.5;
		exNum=exNum.toLocaleString(this.app.lang).toString();
		var desimal=exNum.substring(1,2);
		if(desimal==','){val=val.toString().replace(/\./g,',');}
		val=lib.number.formatToNumber(val,this.app.lang);
		var normalVal=val.toLocaleString(this.app.lang,{minimumFractionDigits:this.app.decimal});
		if(this.app.type=='NUMBER'){$this.value=normalVal;
		}else if(this.app.type=='CURRENCY'){
			val=val.toLocaleString(this.app.lang,{style: 'currency', currency: this.app.code,minimumFractionDigits:this.app.decimal });
			if(normalVal.substring(0,1)=='-'){$this.value=val.replace(normalVal.substring(1,normalVal.length)," "+normalVal.substring(1,normalVal.length));
			}else{$this.value=val.replace(normalVal," "+normalVal);}
		}
		
		this.callParent(arguments);
		this.load();
	},
	_setValue:function(val){
		var exNum=1.5;
		exNum=exNum.toLocaleString(this.app.lang).toString();
		var desimal=exNum.substring(1,2);
		if(desimal==','){val=val.toString().replace(/\./g,',');}
		val=lib.number.formatToNumber(val,this.app.lang);
		var normalVal=val.toLocaleString(this.app.lang,{minimumFractionDigits:this.app.decimal});
		if(this.app.type=='NUMBER'){this.setValue(normalVal);
		}else if(this.app.type=='CURRENCY'){
			val=val.toLocaleString(this.app.lang,{style: 'currency', currency: this.app.code,minimumFractionDigits:this.app.decimal });
			if(normalVal.substring(0,1)=='-'){this.setValue(val.replace(normalVal.substring(1,normalVal.length)," "+normalVal.substring(1,normalVal.length)));
			}else{this.setValue(val.replace(normalVal," "+normalVal));}
		}
	},
	_getValue:function(){
		var val=lib.number.formatToNumber(this.getValue(),this.app.lang);
		if(isNaN(val)){return 0;}else{return val;}
	}
});