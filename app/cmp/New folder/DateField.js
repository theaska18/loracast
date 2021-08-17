Ext.define('App.cmp.DateField',{
	extend: 'Ext.form.DateField',
	result:'none',
	property:{},
	press:{},
	event:{},
	space:true,
	format:'d/m/Y',
	enableKeyEvents:true,
	margin:true,
	labelAlign:'right',
	initComponent:function(){
		var property=this.property,event=this.event,$this=this;
		property.type='datefield';
		if(this.listeners==undefined){this.listeners=[];}
		//blur
		var blurOri=null;
		if(this.listeners.blur!=undefined){blurOri=this.listeners.blur;}
		var blur=function(textfield,e){
			if(blurOri != null){blurOri(textfield,e);}
			if(event.blur != undefined){event.blur(textfield,e);}
		}
		this.listeners.blur=blur;
		//focus
		var focusOri=null;
		if(this.listeners.focus!=undefined){focusOri=this.listeners.focus;}
		var focus=function(textfield,e){if(focusOri != null){focusOri(textfield,e);}if(event.focus != undefined){event.focus(textfield,e);}}
		this.listeners.focus=focus;
		//keydown
		var keydownOri=null;
		if(this.listeners.keydown!=undefined){keydownOri=this.listeners.keydown;}
		var keydown=function(textfield,e){if(keydownOri != null){keydownOri(textfield,e);}_ctrl(textfield,e);return false;}
		this.listeners.keydown=keydown;
		var allowBlank='';
		if(this.allowBlank != undefined && this.allowBlank ==false){allowBlank='<span style="color:red;">*</span>';}
		if(this.fieldLabel != undefined && this.fieldLabel !=''){
			if($this.width == undefined){$this.width=200;}
			this.emptyText=this.fieldLabel.replace('<br>','');
			this.fieldLabel='<span style="float:left;text-align:left;">'+this.fieldLabel+allowBlank+'</span>';	
		}else{if($this.width == undefined){this.width=100;}}
		this.callParent(arguments);
	},
	listeners:{keypress:function(textfield,eo){if(eo.getCharCode()==Ext.EventObject.ENTER){if(textfield.submit != undefined){Ext.get(textfield.submit).dom.click();}}}},
	val:function(data){
		var value=this.getValue(),format='';
		if(value != null){
			var month=value.getMonth()+1,date=value.getDate();
			if(month.toString().length==1){month='0'+month.toString();}
			if(date.toString().length==1){date='0'+date.toString();}
			var format=value.getFullYear()+'-'+month+'-'+date;
		}
		return format;
	}
});