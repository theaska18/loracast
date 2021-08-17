//idropdown
Ext.define('IComboBox', {
	alias:'widget.icombobox',
	extend:'Ext.form.ComboBox',store: {xtype:'array'},queryMode: 'local',property:{},press:{},event:{},forceSelection :true,displayField: 'text',valueField: 'id',
	rawField:'text',emptyText:'Pilih -',enableKeyEvents:true,listeners:{},margin:true,labelAlign:'right',dataSelect:{},
	initComponent:function(){
		var fields=['id','text'],data=[],$this=this;
		if(this.fields!= undefined){fields=this.fields;}
		this.store=new Ext.data.Store({data:data,fields:fields});
		if(this.data!=undefined){this.store.add(this.data);}
		var property=this.property,event=this.event;
		property.type='dropdown';
		this.tmpValue=this.value;
		if(this.listeners==undefined){this.listeners=[];}
		var selectOri=null;
		if(this.listeners.select!=undefined){selectOri=this.listeners.select;}
		var select=function( combo, records, eOpts ){
			if (records[0] != undefined){combo.setRawValue(records[0].data[combo.rawField]);}
			if (records[0] != undefined){combo.dataSelect=records[0].raw;}
			if(selectOri != null){selectOri( combo, records, eOpts );}
			if(event.select != undefined){event.select( combo, records, eOpts );}
		};
		this.listeners.select=select;
		var blurOri=null;
		if(this.listeners.blur!=undefined){blurOri=this.listeners.blur;}
		var blur=function(textfield,e){
			if(blurOri != null){blurOri(textfield,e);}
			if(event.blur != undefined){event.blur(textfield,e);}
			if (textfield.valueModels[0] !== undefined){textfield.setRawValue(textfield.valueModels[0].data[textfield.rawField]);}
		};
		this.listeners.blur=blur;
		var focusOri=null;
		if(this.listeners.focus!=undefined){focusOri=this.listeners.focus;}
		var focus=function(textfield,e){if(focusOri != null){focusOri(textfield,e);}if(event.focus != undefined){event.focus(textfield,e);}};
		this.listeners.focus=focus;
		//keydown
		var keydownOri=null;
		if(this.listeners.keydown!=undefined){keydownOri=this.listeners.keydown;}
		var keydown=function(textfield,e){
			if(keydownOri != null){keydownOri(textfield,e);}
			_ctrl(textfield,e);
			var nav=navigator.platform.match("Mac");
			if (e.keyCode == 68 && ( nav? e.metaKey : e.ctrlKey)){textfield.setValue(null);$this.load('',true);e.preventDefault();}
			
			return false;
		};
		this.listeners.keydown=keydown;
		//keyup
		var keyupOri=null;
		if(this.listeners.keyup!=undefined){keyupOri=this.listeners.keyup;}
		var keyup=function(textfield,e){
			if(keyupOri != null){keyupOri(textfield,e);}
			_ctrl(textfield,e);
			if(e.keyCode==13){
				if(!textfield.isExpanded){
					nextFocus(textfield,e);	
				}
			}
			return false;
		};
		this.listeners.keyup=keyup;
		var allowBlank='';
		if(this.allowBlank != undefined && this.allowBlank ==false){allowBlank='<span style="color:red;">*</span>';}
		var labelWidth=95;
		if(this.labelWidth != undefined){labelWidth=this.labelWidth-5;}
		if(this.fieldLabel != undefined && this.fieldLabel !=''){
			if(this.width == undefined && this.anchor==undefined){this.anchor='100%';}
			this.emptyText=this.fieldLabel.replace('<br>','');
			var cssWidth='';
			if(this.labelAlign=='right'){
				cssWidth='width:'+labelWidth+'px;';
			}
			this.fieldLabel='<span style="float:left;text-align:left;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;'+cssWidth+'" title="'+this.fieldLabel+'">'+this.fieldLabel+allowBlank+'</span>';	
		}
		if(this.note != undefined && this.note !=''){
			this.on({
				afterrender:this.calculate,
				scope:this
			});
		}
		this.callParent(arguments);
	},
	calculate:function(textfield,e){
		var me=this,
			span=Ext.dom.Query.select('input',me.getEl().dom)[0];
		var newEl=document.createElement('td');
		newEl.innerHTML='&nbsp;<span class="fa fa-info-circle" title="'+me.note+'"></span>';
		newEl.style.width='20px';
		if(me.labelAlign=='top'){
			newEl.style['padding-top']='13px';
		}
		span.parentNode.parentNode.append(newEl);
	},
	setVal:function(val){this.setValue(val);if (this.valueModels[0] != undefined){this.setRawValue(this.valueModels[0].data[this.rawField]);}},
	addData:function(data){this.store.add(data);},
	addReset:function(data,first){
		var val=this.getValue();
		if(this.store != null && this.store.loadData != null){
			this.store.loadData([],false);
			this.store.add(data);
		}
		if(val==null || val==undefined || val==''){
			if(this.tmpValue != null && this.tmpValue != undefined && this.tmpValue !=''){
				this.setValue(this.tmpValue);
			}
		}else{
			this.setValue(val);
		}
	}
});