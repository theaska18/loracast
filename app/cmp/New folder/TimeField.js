Ext.define('App.cmp.TimeField',{
	extend: 'Ext.form.TimeField',
	result:'none',
	property:{},
	press:{},
	event:{},
	width: 100,
	format:'H:i',
	enableKeyEvents:true,
	initComponent:function(){
		var property=this.property,event=this.event;
		property.type='datefield';
		if(this.listeners==undefined){this.listeners=[];}
		//blur
		var blurOri=null;
		if(this.listeners.blur!=undefined){blurOri=this.listeners.blur;}
		var blur=function(textfield,e){
			if(blurOri != null){blurOri(textfield,e);}
			if(event.blur != undefined){event.blur(textfield,e);}
			textfield.setValue(textfield.getValue());
		}
		this.listeners.blur=blur;
		//focus
		var focusOri=null;
		if(this.listeners.focus!=undefined){focusOri=this.listeners.focus;}
		var focus=function(textfield,e){
			if(focusOri != null){focusOri(textfield,e);}
			if(event.focus != undefined){event.focus(textfield,e);}
		}
		this.listeners.focus=focus;
		//keydown
		var keydownOri=null;
		if(this.listeners.keydown!=undefined){keydownOri=this.listeners.keydown;}
		var keydown=function(textfield,e){
			if(keydownOri != null){keydownOri(textfield,e);}
			_ctrl(textfield,e);
			return false;
		}
		this.listeners.keydown=keydown;
		this.callParent(arguments);
	},
	val:function(data){
		var value=this.getValue(),format='';
		if(value != null){format=Ext.Date.format(value,'Y-m-d H:i:s');}
		return format;
	}
});